import React from 'react';

export const CourtSealIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <defs>
      <path
        id="circlePath"
        d="M 10, 50
           a 40,40 0 1,1 80,0
           a 40,40 0 1,1 -80,0"
        fill="none"
      />
    </defs>
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <g fill="currentColor" className="text-[9px] font-bold tracking-wider uppercase">
      <text>
        <textPath href="#circlePath" startOffset="25%" textAnchor="middle">
          ★ HIGH COURT ★
        </textPath>
        <textPath href="#circlePath" startOffset="75%" textAnchor="middle">
          AT ALLAHABAD
        </textPath>
      </text>
    </g>
    <g transform="translate(50 50) scale(0.35)">
      <path
        d="M9.5 2.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1Z"
        stroke="currentColor" strokeWidth="1.5"
      />
      <path
        d="M16.5 2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2Z"
        stroke="currentColor" strokeWidth="1.5"
      />
      <path
        d="M2 6.5a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Z"
        fill="currentColor"
      />
      <path
        d="m12 7 5.5 8.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="m12 7-5.5 8.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M3 20.5h18"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </g>
  </svg>
);
