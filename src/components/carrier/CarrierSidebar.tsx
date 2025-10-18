"use client";

import Link from 'next/link';
import React from 'react';
import { Home, Package, Truck, Calendar, BarChart3, User } from 'lucide-react';
// local navigation type defined inline to avoid depending on Layout exports
type NavigationItem = {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
};
import { PATHS } from '@/constants';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: PATHS.CARRIER.DASHBOARD, icon: Home },
    { name: 'Quản lý đơn hàng', href: PATHS.CARRIER.ORDERS, icon: Package },
    { name: 'Đội xe & Tài xế', href: PATHS.CARRIER.FLEET, icon: Truck },
    { name: 'Lịch trình', href: PATHS.CARRIER.SCHEDULE, icon: Calendar },
    { name: 'Báo cáo', href: PATHS.CARRIER.REPORTS, icon: BarChart3 },
    { name: 'Hồ sơ công ty', href: PATHS.CARRIER.PROFILE, icon: User },
];

export default function CarrierSidebar({ pathname }: { pathname: string }) {
    return (
        <aside className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center">
                    <Truck className="h-8 w-8 text-orange-600" />
                    <div className="ml-2">
                        <span className="text-xl font-bold text-gray-900">LoTraDW</span>
                        <p className="text-xs text-orange-600 font-medium">Carrier Portal</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            pathname === item.href ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        )}
                    >
                        <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
