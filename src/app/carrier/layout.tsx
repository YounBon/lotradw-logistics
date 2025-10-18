import { redirect } from 'next/navigation';
import CarrierSidebar from '@/components/carrier/CarrierSidebar';
import CarrierHeader from '@/components/carrier/CarrierHeader';

async function getCurrentUserServer() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiBase ? `${apiBase}/auth/me` : '/auth/me';

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const body = await res.json();
        return body.user ?? body;
    } catch {
        return null;
    }
}

export default async function CarrierLayout({ children }: { children: React.ReactNode }) {
    const user: any = await getCurrentUserServer();
    if (!user || user.role !== 'carrier') {
        redirect('/auth/signin');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <CarrierSidebar pathname={''} />
            </div>

            <div className="lg:pl-64">
                <CarrierHeader />

                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export const dynamic = 'force-dynamic';
