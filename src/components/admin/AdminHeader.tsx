"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminHeader({ onLogout }: { onLogout?: () => void }) {
    return (
        <div className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white px-4 shadow sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700">LoTraDW — Admin Console</div>
            </div>
            <div>
                <Button variant="outline" size="sm" onClick={onLogout}>Đăng xuất</Button>
            </div>
        </div>
    );
}
