"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminReportsPage() {
    const downloadCSV = () => alert('Implement CSV export via API');
    const downloadPDF = () => alert('Implement PDF export via API');

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Báo cáo</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h2 className="font-semibold">Báo cáo đơn hàng</h2>
                    <div className="mt-2 flex space-x-2">
                        <Button onClick={downloadCSV}>Xuất CSV</Button>
                        <Button onClick={downloadPDF}>Xuất PDF</Button>
                    </div>
                </Card>

                <Card className="p-4">
                    <h2 className="font-semibold">Báo cáo hiệu suất</h2>
                    <div className="mt-2 flex space-x-2">
                        <Button onClick={() => alert('Implement performance report')}>Xem</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
