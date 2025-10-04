import Link from 'next/link';
import { Truck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    isCarrier?: boolean;
}

export default function AuthLayout({ children, title, subtitle, isCarrier = false }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
                        <Truck className="h-10 w-10 text-orange-600" />
                        <span className="text-2xl font-bold text-gray-900">LoTraDW</span>
                    </Link>
                    {isCarrier && (
                        <div className="mb-4">
                            <span className="inline-block bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                Carrier Portal
                            </span>
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
                    )}
                </div>

                {/* Form Card */}
                <Card className="p-8">
                    {children}
                </Card>
            </div>
        </div>
    );
}