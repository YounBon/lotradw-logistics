"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminCatalogsPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const c = await apiClient.get('/logistics/categories');
                const r = await apiClient.get('/logistics/regions');
                if (!mounted) return;
                setCategories((c.data ?? []) as any[]);
                setRegions((r.data ?? []) as any[]);
            } catch (err) {
                console.error('Failed to load catalogs', err);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Danh mục & Vùng</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h2 className="font-semibold">Danh mục</h2>
                    {categories.length === 0 ? <div className="text-sm text-gray-500">Không có</div> : categories.map((cat) => (
                        <div key={cat.id} className="py-2 border-b last:border-b-0">{cat.name}</div>
                    ))}
                    <div className="mt-2">
                        <Button size="sm" onClick={() => alert('Implement add category')}>Thêm danh mục</Button>
                    </div>
                </Card>

                <Card className="p-4">
                    <h2 className="font-semibold">Vùng hoạt động</h2>
                    {regions.length === 0 ? <div className="text-sm text-gray-500">Không có</div> : regions.map((r) => (
                        <div key={r.id} className="py-2 border-b last:border-b-0">{r.name}</div>
                    ))}
                    <div className="mt-2">
                        <Button size="sm" onClick={() => alert('Implement add region')}>Thêm vùng</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
