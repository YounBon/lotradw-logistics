"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';

export default function Header() {
    const router = useRouter();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm" style={{ fontFamily: 'Inter, "Noto Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Logo: truck icon + LoTraDW text (replace previous LD badge) */}
                        <div className="flex items-center">
                            <Truck className="h-8 w-8 text-orange-600" />
                            <div className="ml-2">
                                <div className="text-lg font-semibold text-gray-800" style={{ fontWeight: 700 }}>LoTraDW</div>
                                <div className="text-xs text-gray-500">Hệ thống quản lý vận tải và Kho dữ liệu</div>
                            </div>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center space-x-4 text-sm text-gray-700">
                        <Link href="#features" className="transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600">Tính năng</Link>
                        <Link href="#benefits" className="transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600">Lợi ích</Link>
                        <Link href="#clients" className="transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600">Khách hàng</Link>
                        <Link href="#faq" className="transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600">FAQ</Link>
                        <Link href="#contact" className="transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600">Liên hệ</Link>
                    </nav>

                    <div className="flex items-center space-x-3">
                        <button aria-label="Chuyển ngôn ngữ" className="text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100">VI</button>
                        <Button onClick={() => router.push('/auth/signin')}>Đăng nhập</Button>
                        <Button variant="outline" onClick={() => router.push('/auth/signup')}>Đăng ký</Button>
                    </div>
                </div>
            </header>
            {/* Spacer to prevent header from covering page content (matches header height) */}
            <div aria-hidden="true" className="h-16" />
        </>
    );
}
