'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useRef, useState, useTransition } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2, Download, AlertTriangle, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateLegalText } from '@/ai/flows/generate-legal-text-from-description';
import { CourtSealIcon } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent } from './ui/card';

const grievanceTypes = [
  'Noise',
  'Harassment',
  'Property',
  'Nuisance',
  'Other',
] as const;

const formSchema = z.object({
  targetName: z.string().min(2, 'Target name must be at least 2 characters.'),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  grievanceType: z.enum(grievanceTypes),
  incidentDescription: z.string().min(20, 'Description must be at least 20 words.'),
});

type FormValues = z.infer<typeof formSchema>;

type LegalDoc = {
  legalText: string;
  ipcSections: string[];
};

export function CourtOrderGenerator() {
  const { toast } = useToast();
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetName: '',
      location: '',
      grievanceType: 'Other',
      incidentDescription: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const result = await generateLegalText(values);
        if (result?.legalText) {
          setLegalDoc(result);
          toast({
            title: 'Document Generated',
            description: 'The legal draft has been successfully created.',
          });
        } else {
            throw new Error('AI failed to generate text.');
        }
      } catch (error) {
        console.error('Error generating legal text:', error);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description:
            'An error occurred while generating the legal document. Please try again.',
        });
        setLegalDoc(null);
      }
    });
  };

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) return;

    toast({
      title: 'Preparing PDF...',
      description: 'Your download will begin shortly.',
    });

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('IndCourtOrder-AI-document.pdf');
  };
  
  const watchedDescription = form.watch('incidentDescription');

  return (
    <div className="container mx-auto grid grid-cols-1 gap-12 p-4 py-8 md:p-8 lg:grid-cols-2">
      <Card className="lg:h-fit lg:sticky lg:top-24">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">File a Grievance</h2>
                <p className="text-muted-foreground">
                  Describe the incident, and our AI will draft a formal legal notice in a judicial style.
                </p>
              </div>

              <FormField
                control={form.control}
                name="targetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City/State - India)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grievanceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grievance Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grievance type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grievanceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incidentDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed account of the incident..."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific as possible for a more accurate legal draft.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                 <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Document
                </Button>
                {legalDoc && (
                   <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPdf}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex items-start justify-center">
        <div
          ref={previewRef}
          className="w-full max-w-2xl aspect-[210/297] bg-card text-card-foreground rounded-lg shadow-2xl dark:shadow-primary/10 flex flex-col p-8 sm:p-12 font-headline overflow-hidden border"
        >
          {legalDoc || isGenerating ? (
            <div className="relative flex-1 flex flex-col">
              {isGenerating ? (
                <div className="m-auto flex flex-col items-center gap-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating legal draft...</p>
                </div>
              ) : (
                legalDoc && (
                  <div className="flex flex-col h-full text-sm">
                    <header className="flex justify-between items-start mb-8">
                        <div className="text-left">
                            <p className="font-bold">Case No.: 2024-042</p>
                            <p>Court: District Court</p>
                        </div>
                        <CourtSealIcon className="w-24 h-24 text-foreground/80"/>
                    </header>

                    <main className="flex-1 space-y-4 text-justify leading-relaxed">
                        <h3 className="text-center font-bold text-base mb-6">Order Regarding Grievance</h3>
                        <p>{legalDoc.legalText}</p>
                    </main>

                    <footer className="mt-auto pt-8 text-xs">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="font-bold">Cited Sections:</p>
                                <p>{legalDoc.ipcSections.join(', ')}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-serif italic text-base">/Sgd./</p>
                                <p className="font-bold">Presiding Judge</p>
                                <p>By Order of the Court</p>
                            </div>
                        </div>
                    </footer>
                  </div>
                )
              )}
            </div>
          ) : (
             <div className="m-auto flex flex-col items-center justify-center text-center text-muted-foreground select-none">
              <div className="transform -rotate-12 opacity-50 dark:opacity-20">
                <h1 className="text-4xl md:text-6xl font-black uppercase">Awaiting</h1>
                <h1 className="text-4xl md:text-6xl font-black uppercase">Input</h1>
              </div>
              <p className="mt-8 text-sm">Your generated document will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
