'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', isLoading = false, children, disabled, ...props }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

        const variants = {
            default: 'bg-orange-600 text-white hover:bg-orange-700',
            destructive: 'bg-red-600 text-white hover:bg-red-700',
            outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
            ghost: 'hover:bg-gray-100',
            link: 'underline-offset-4 hover:underline text-orange-600',
        };

        const sizes = {
            default: 'h-10 py-2 px-4',
            sm: 'h-9 px-3 rounded-md',
            lg: 'h-11 px-8 rounded-md',
            icon: 'h-10 w-10',
        };

        return (
            <button
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    isLoading && 'cursor-not-allowed',
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };