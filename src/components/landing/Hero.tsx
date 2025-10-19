"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const router = useRouter();

    return (
        <section className="bg-gradient-to-br from-orange-50 to-white py-16" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl text-orange-600 mb-4" style={{ fontWeight: 700 }}>Tiết kiệm đến 20% chi phí vận tải</h1>
                    <p className="text-lg text-gray-700 mb-6" style={{ fontWeight: 400 }}>LoTraDW — Hệ thống quản lý vận tải & Kho dữ liệu (Data Warehouse) tích hợp AI giúp tối ưu hóa vận hành và quyết định vận tải cho doanh nghiệp.</p>

                    <div className="flex items-center gap-4">
                        <Button className="shadow-lg bg-orange-600 hover:bg-orange-700 text-white border-orange-600" onClick={() => router.push('/auth/signin')}>Đăng nhập</Button>
                        <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" onClick={() => router.push('/auth/signup')}>Đăng ký</Button>
                    </div>

                    <ul className="mt-8 space-y-2 text-gray-600">
                        <li>• Quản lý toàn trình vận chuyển, theo dõi realtime</li>
                        <li>• Tối ưu lộ trình bằng AI, giảm chi phí và thời gian</li>
                        <li>• Kết nối ERP/WMS/OMS và hỗ trợ hóa đơn điện tử</li>
                    </ul>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 border border-orange-50">
                        <Image src="/images/landing/dashboard-sample.jpg" alt="Mẫu giao diện bảng điều khiển LoTraDW" width={540} height={320} className="rounded" />
                        <div className="mt-3 text-sm text-gray-600">Mẫu giao diện bảng điều khiển: quản lý đơn hàng, chi phí và KPI</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
