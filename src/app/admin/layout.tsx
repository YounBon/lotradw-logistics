"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/services';
import { PATHS } from '@/constants';

const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Carriers', href: '/admin/carriers' },
    { name: 'Catalogs', href: '/admin/catalogs' },
    { name: 'Reports', href: '/admin/reports' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const user = await authService.getCurrentUser();
                if (!mounted) return;
                // User type in frontend may not include role; coerce to any for runtime check
                const u: any = user as any;
                if (!user || u.role !== 'admin') {
                    // not admin -> redirect to signin
                    window.location.href = PATHS.AUTH.SIGNIN;
                    return;
                }
            } catch (err) {
                // likely not authenticated
                window.location.href = PATHS.AUTH.SIGNIN;
                return;
            } finally {
                if (mounted) setChecking(false);
            }
        })();
        return () => { mounted = false; };
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-6">Đang kiểm tra quyền truy cập...</Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <aside className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-6">
                        <h2 className="text-xl font-bold">LoTraDW — Admin</h2>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-4">
                        {adminNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === item.href ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>
            </div>

            <div className="lg:pl-64">
                <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">Admin Console</div>
                    </div>
                    <div>
                        <a href="/auth/signin">
                            <Button>Đăng xuất</Button>
                        </a>
                    </div>
                </div>

                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
