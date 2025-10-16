"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminCarriersPage() {
    const [carriers, setCarriers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await apiClient.get('/logistics/carriers');
                if (!mounted) return;
                setCarriers((res.data ?? []) as any[]);
            } catch (err) {
                console.error('Failed to load carriers', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    if (loading) return <div>Đang tải nhà vận tải...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Quản lý nhà vận tải</h1>
            <div className="space-y-2">
                {carriers.length === 0 && <div className="text-sm text-gray-500">Không tìm thấy nhà vận tải</div>}
                {carriers.map((c) => (
                    <Card key={c.id} className="p-3 flex justify-between items-center">
                        <div>
                            <div className="font-medium">{c.company_name}</div>
                            <div className="text-sm text-gray-500">{c.phone} — {c.email}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-sm">{c.approval_status}</div>
                            <Button size="sm" onClick={() => alert('Implement approve carrier via API')}>Phê duyệt</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
