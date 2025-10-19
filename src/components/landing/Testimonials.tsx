"use client";

export default function Testimonials() {
    const items = [
        {
            quote: 'LoTraDW giúp chúng tôi tối ưu lộ trình, giảm chi phí nhiên liệu và tăng tỷ lệ giao đúng hạn.',
            name: 'Công ty TNHH Vận Tải An Phát',
            role: 'Quản lý vận hành'
        },
        {
            quote: 'Giao diện dễ dùng, báo cáo rõ ràng — đội điều phối làm việc nhanh hơn hẳn.',
            name: 'Công ty Xuất Nhập Khẩu Minh Việt',
            role: 'Trưởng phòng Logistics'
        },
        {
            quote: 'Tích hợp ERP và hóa đơn điện tử rất mượt, tiết kiệm nhiều thời gian nhập liệu.',
            name: 'Công ty TM DV Green',
            role: 'Kế toán trưởng'
        }
    ];

    return (
        <section className="py-16 bg-white" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl mb-6" style={{ fontWeight: 700 }}>Khách hàng nói gì về LoTraDW</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((t) => (
                        <div key={t.name} className="p-5 bg-orange-50 rounded-xl shadow-md border border-transparent hover:border-orange-100 transition">
                            <p className="text-gray-800 mb-4" style={{ fontWeight: 400 }}>“{t.quote}”</p>
                            <div className="text-sm text-gray-700" style={{ fontWeight: 700 }}>{t.name}</div>
                            <div className="text-xs text-gray-500">{t.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
