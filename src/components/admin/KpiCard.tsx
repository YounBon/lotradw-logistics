"use client";

import React from 'react';

export default function KpiCard({ title, value }: { title: string; value: React.ReactNode }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
        </div>
    );
}
