"use client";

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function CtaSection() {
    const router = useRouter();
    return (
        <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="bg-white/10 p-8 rounded-2xl shadow-lg inline-block">
                    <h2 className="text-2xl mb-4" style={{ fontWeight: 700 }}>Sẵn sàng tối ưu hoạt động vận tải của bạn?</h2>
                    <div className="flex items-center justify-center gap-4">
                        <Button className="bg-white text-orange-600 hover:bg-white/90" onClick={() => router.push('/auth/signin')}>Đăng nhập</Button>
                        <Button variant="outline" className="border-white text-white" onClick={() => router.push('/auth/signup')}>Đăng ký</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
