'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Menu, X, Home, Package, Truck, User } from 'lucide-react';
import { Button } from './ui/Button';

export default function AppShell({ children, role }: { children: ReactNode; role?: 'customer' | 'carrier' }) {
    const [open, setOpen] = useState(false);

    const nav = role === 'carrier' ? [
        { name: 'Dashboard', href: '/carrier/dashboard', icon: Truck },
        { name: 'Orders', href: '/carrier/orders', icon: Package },
        { name: 'Fleet', href: '/carrier/fleet', icon: Truck },
        { name: 'Schedule', href: '/carrier/schedule', icon: Home },
        { name: 'Reports', href: '/carrier/reports', icon: Home },
    ] : [
        { name: 'Trang chủ', href: '/', icon: Home },
        { name: 'Tạo đơn', href: '/orders/create', icon: Package },
        { name: 'Đơn hàng', href: '/orders', icon: Package },
        { name: 'Theo dõi', href: '/tracking', icon: Home },
        { name: 'Tài khoản', href: '/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="flex">
                <aside className="hidden md:flex md:w-64 md:flex-col md:pt-5 md:pb-4 md:bg-white md:border-r md:border-gray-100">
                    <div className="px-4 pb-4">
                        <Link href="/">
                            <div className="flex items-center gap-2">
                                <div className="text-orange-600 font-bold text-lg">LoTraDW</div>
                            </div>
                        </Link>
                    </div>

                    <nav className="px-2 space-y-1">
                        {nav.map((item) => (
                            <Link key={item.href} href={item.href} className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto p-4">
                        <div className="text-sm text-gray-500">Xin chào, Khách hàng</div>
                        <Button className="mt-2 w-full">Đăng xuất</Button>
                    </div>
                </aside>

                <div className="flex-1">
                    <header className="bg-white border-b border-gray-100 p-4 md:hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setOpen(!open)} className="p-2 rounded-md bg-gray-100">
                                    {open ? <X /> : <Menu />}
                                </button>
                                <div className="text-lg font-bold text-orange-600">LoTraDW</div>
                            </div>
                            <div>
                                <Button variant="outline">Tài khoản</Button>
                            </div>
                        </div>
                    </header>

                    <main className="p-6">{children}</main>
                </div>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/40">
                    <div className="absolute left-0 top-0 w-64 h-full bg-white p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-lg font-bold text-orange-600">LoTraDW</div>
                            <button onClick={() => setOpen(false)} className="p-2 rounded-md bg-gray-100"><X /></button>
                        </div>
                        <nav className="space-y-2">
                            {nav.map((item) => (
                                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
                                    <item.icon className="h-5 w-5 text-gray-500" /> {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
