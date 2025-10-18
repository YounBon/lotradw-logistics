"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PATHS } from '@/constants';

export default function CarrierHeader() {
    return (
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">Xin chào, Đối tác vận chuyển</div>
            </div>
            <div>
                <Link href={PATHS.CARRIER.SIGNIN}>
                    <Button variant="outline" size="sm">Đăng xuất</Button>
                </Link>
            </div>
        </div>
    );
}
