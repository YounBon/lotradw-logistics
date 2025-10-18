"use client";

import Link from 'next/link';
import React from 'react';
import { Home, User, Truck, BarChart3 } from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Carriers', href: '/admin/carriers', icon: Truck },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export default function AdminSidebar({ pathname }: { pathname: string }) {
    return (
        <aside className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-6">
                <h2 className="text-lg font-bold">Admin</h2>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === item.href ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
