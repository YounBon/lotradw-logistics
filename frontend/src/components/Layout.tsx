'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Package,
    Calculator,
    Truck,
    History,
    User,
    Menu,
    X,
    Home,
    Star,
    MapPin,
    BarChart3,
    Calendar,
    Settings,
    Users
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

// Customer navigation
const customerNavigation = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Tạo đơn hàng', href: '/orders/create', icon: Package },
    { name: 'Báo giá nhanh', href: '/quote', icon: Calculator },
    { name: 'Theo dõi đơn hàng', href: '/tracking', icon: MapPin },
    { name: 'Lịch sử đơn hàng', href: '/orders', icon: History },
    { name: 'Đánh giá dịch vụ', href: '/ratings', icon: Star },
    { name: 'Tài khoản', href: '/profile', icon: User },
];

// Carrier navigation
const carrierNavigation = [
    { name: 'Dashboard', href: '/carrier/dashboard', icon: Home },
    { name: 'Quản lý đơn hàng', href: '/carrier/orders', icon: Package },
    { name: 'Đội xe & Tài xế', href: '/carrier/fleet', icon: Truck },
    { name: 'Lịch trình', href: '/carrier/schedule', icon: Calendar },
    { name: 'Báo cáo', href: '/carrier/reports', icon: BarChart3 },
    { name: 'Hồ sơ công ty', href: '/carrier/profile', icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Don't show layout on auth pages and carrier auth pages
    if (pathname.startsWith('/auth') || pathname.startsWith('/carrier/sign')) {
        return <>{children}</>;
    }

    // Determine which navigation to use based on the current path
    const isCarrierPortal = pathname.startsWith('/carrier');
    const navigation = isCarrierPortal ? carrierNavigation : customerNavigation;
    const portalTitle = isCarrierPortal ? 'Carrier Portal' : 'LoTraDW';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={cn(
                'fixed inset-0 z-50 lg:hidden',
                sidebarOpen ? 'block' : 'hidden'
            )}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center">
                            <Truck className="h-8 w-8 text-orange-600" />
                            <div className="ml-2">
                                <span className="text-xl font-bold text-gray-900">LoTraDW</span>
                                {isCarrierPortal && (
                                    <p className="text-xs text-orange-600 font-medium">Carrier Portal</p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 h-5 w-5 flex-shrink-0',
                                            isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-6">
                        <Truck className="h-8 w-8 text-orange-600" />
                        <div className="ml-2">
                            <span className="text-xl font-bold text-gray-900">LoTraDW</span>
                            {isCarrierPortal && (
                                <p className="text-xs text-orange-600 font-medium">Carrier Portal</p>
                            )}
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 h-5 w-5 flex-shrink-0',
                                            isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                            {isCarrierPortal ? 'Xin chào, Đối tác vận chuyển' : 'Xin chào, Khách hàng'}
                        </div>
                        <Link href={isCarrierPortal ? "/carrier/signin" : "/auth/signin"}>
                            <Button variant="outline" size="sm">Đăng xuất</Button>
                        </Link>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}