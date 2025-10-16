"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await apiClient.get('/auth/v_users_with_profile');
                if (!mounted) return;
                setUsers((res.data ?? []) as any[]);
            } catch (err) {
                console.error('Failed to load users', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    if (loading) return <div>Đang tải người dùng...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
            <div className="space-y-2">
                {users.length === 0 && <div className="text-sm text-gray-500">Không tìm thấy người dùng</div>}
                {users.map((u) => (
                    <Card key={u.id} className="p-3 flex justify-between items-center">
                        <div>
                            <div className="font-medium">{u.email}</div>
                            <div className="text-sm text-gray-500">{u.first_name ?? ''} {u.last_name ?? ''}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-sm">{u.role}</div>
                            <Button size="sm" onClick={() => alert('Implement edit user via API')}>Sửa</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
