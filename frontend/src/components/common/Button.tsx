// src/components/common/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'gap-1.5 rounded-md px-5 py-2.5 text-xs font-bold transition-all duration-800 ease-in-out',
  {
    variants: {
      intent: {
        
        primary: [
          'bg-yellow-400 text-black font-anton text-center items-center font-anton tracking-wide',                         
          'bg-linear-to-r from-violet-700 to-blue-600',   
          'bg-no-repeat bg-left bg-size-[0%_100%]',       
          'hover:bg-size-[100%_100%] hover:text-white hover:scale-105'
        ],

        ghost: [
          'bg-transparent w-60 h-10 border border-yellow-400 text-yellow-400 text-center font-anton items-center tracking-wide',
          'bg-linear-to-r from-violet-700 to-blue-600',   
          'bg-no-repeat bg-left bg-size-[0%_100%]',       
          'hover:bg-size-[100%_100%] hover:text-white hover:scale-105'
        ],

        secondary: [
          'bg-transparent text-white underline-offset-4 underline text-center items-center tracking-wide',  
          'hover:bg-size-[100%_100%] hover:text-yellow-400 hover:scale-105'
        ]
      }
    },
    defaultVariants: {
      intent: 'primary'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ intent, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);