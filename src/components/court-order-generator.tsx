'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2, Download } from 'lucide-react';

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
import { CourtSealIcon } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent } from './ui/card';
import { capitalizeName } from '@/lib/utils';

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
  subject: string;
  body: string;
  ipcSections: string[];
  judge: {
    name: string;
    title: string;
    role: string;
  };
  signatureName: string;
};

export function CourtOrderGenerator() {
  const { toast } = useToast();
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [clNumber, setClNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
    setClNumber(String(Math.floor(Math.random() * 90) + 10));
  }, []);

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
    setIsGenerating(true);
    const processedValues = {
      ...values,
      targetName: capitalizeName(values.targetName),
    };
    
    if (values.targetName !== processedValues.targetName) {
        form.setValue('targetName', processedValues.targetName);
    }
    
    // Static document generation for GitHub Pages
    const staticDoc: LegalDoc = {
        subject: `Regarding grievance of ${values.grievanceType} at ${values.location}`,
        body: `This is a formal notice regarding an incident of ${values.grievanceType} which occurred at ${values.location}, involving ${processedValues.targetName}. The reported incident is as follows: "${values.incidentDescription}". This matter is being reviewed under the relevant sections of the law. Further action may be taken.`,
        ipcSections: ['IPC Section 268', 'IPC Section 290'],
        judge: {
            name: 'Ashish Garg',
            title: 'H.J.S.',
            role: 'Registrar General',
        },
        signatureName: 'A. Garg',
    };

    setLegalDoc(staticDoc);
    toast({
        title: 'Document Generated',
        description: 'The legal draft has been successfully created.',
    });
    setIsGenerating(false);
  };

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) return;

    toast({
      title: 'Preparing PDF...',
      description: 'Your download will begin shortly.',
    });

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const ratio = canvasWidth / pdfWidth;
    const imgHeight = canvasHeight / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('IndCourtOrder-AI-document.pdf');
  };
  
  const formValues = form.watch();

  return (
    <div className="container mx-auto grid grid-cols-1 gap-12 p-4 py-8 md:p-8 lg:grid-cols-2">
      <Card className="lg:h-fit lg:sticky lg:top-24">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">File a Grievance</h2>
                <p className="text-muted-foreground">
                  Describe the incident, and we will draft a formal communication in a judicial style.
                </p>
              </div>

              <FormField
                control={form.control}
                name="targetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Guilty <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel>Guilty Location <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel>Grievance Type <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel>Incident Description <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed account of the incident..."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be used to generate the body of the communication.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                 <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
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
          className="w-full max-w-2xl bg-white text-black rounded-lg shadow-2xl flex flex-col p-8 sm:p-12 font-body border"
        >
          {isGenerating ? (
            <div className="m-auto flex flex-col items-center justify-center gap-4 text-center aspect-[210/297]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-gray-500">Generating legal draft...</p>
            </div>
          ) : legalDoc ? (
              <div className="flex flex-col text-sm leading-6 min-h-[calc(297mm*0.8)]">
                <header className="flex justify-between items-start mb-6">
                    <div className="text-left w-1/3">
                        <p className="font-bold">From,</p>
                        <p>{legalDoc.judge.name}, {legalDoc.judge.title}</p>
                        <p>{legalDoc.judge.role},</p>
                        <p>High Court of Judicature at</p>
                        <p>Allahabad.</p>
                    </div>
                    <div className="flex flex-col items-center flex-shrink-0">
                        <CourtSealIcon className="w-24 h-24 text-black/80"/>
                    </div>
                    <div className="text-right w-1/3">
                        <p>Through E-mail/<br />Registered Post</p>
                    </div>
                </header>
                
                <div className="mb-4">
                    <p className="font-bold">To,</p>
                    <p>{formValues.targetName}</p>
                    <p>{formValues.location}</p>
                </div>

                <div className="mb-4 flex">
                  <p className="w-1/2">C.L. No. {clNumber} /Admin. 'D' Section</p>
                  <p className="w-1/2 text-right">Dated: {currentDate}</p>
                </div>

                <p className="mb-4"><span className='font-bold'>Subject:- </span>{legalDoc.subject}</p>

                <main className="space-y-4 text-justify flex-grow">
                    <p>{legalDoc.body}</p>
                    <p className='mt-4'>Therefore, I am communicating the same for information and compliance.</p>
                </main>

                <footer className="pt-8">
                    <div className="flex justify-end">
                        <div className="text-left">
                            <p className="font-serif italic text-2xl mt-4 mb-2">{legalDoc.signatureName}</p>
                            <p>({legalDoc.judge.name})</p>
                            <p>{legalDoc.judge.role}</p>
                        </div>
                    </div>
                </footer>
              </div>
          ) : (
             <div className="m-auto flex flex-col items-center justify-center text-center text-gray-500 select-none aspect-[210/297]">
              <div className="transform -rotate-12 opacity-50">
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
