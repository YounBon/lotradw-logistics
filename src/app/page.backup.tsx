import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import AppShell from '@/components/AppShell';

export default function HomePageBackup() {
    return (
        <AppShell role="customer">
            <div className="min-h-[70vh] bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">LoTraDW Logistics Platform</h1>
                    <p className="text-xl text-gray-600 mb-8">Bản backup của trang chủ trước khi sửa lỗi JSX.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/auth/signin"><Button className="w-full">Đăng nhập</Button></Link>
                        <Link href="/auth/signup"><Button className="w-full" variant="outline">Đăng ký</Button></Link>
                        <Link href="/carrier/dashboard"><Button className="w-full">Carrier</Button></Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
