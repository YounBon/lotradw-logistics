"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { dashboardService } from '@/lib/services';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await dashboardService.getStats();
                if (!mounted) return;
                setStats(data);
            } catch (err) {
                console.error('Failed to load dashboard stats', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    if (loading) return <div>Đang tải số liệu...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Tổng đơn</div>
                    <div className="text-2xl font-semibold">{stats?.totalOrders ?? '-'}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Đang hoạt động</div>
                    <div className="text-2xl font-semibold">{stats?.activeOrders ?? '-'}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Hoàn thành</div>
                    <div className="text-2xl font-semibold">{stats?.completedOrders ?? '-'}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Tổng doanh thu</div>
                    <div className="text-2xl font-semibold">{stats?.totalSpent ?? '-'}</div>
                </Card>
            </div>

            <section className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Đơn gần đây</h2>
                <div className="space-y-2">
                    {stats?.recentOrders?.length ? (
                        stats.recentOrders.map((o: any) => (
                            <Card key={o.id} className="p-3">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-medium">{o.orderNumber}</div>
                                        <div className="text-sm text-gray-500">{o.customerId}</div>
                                    </div>
                                    <div className="text-sm text-gray-700">{o.status}</div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500">Không có đơn gần đây</div>
                    )}
                </div>
            </section>
        </div>
    );
}
