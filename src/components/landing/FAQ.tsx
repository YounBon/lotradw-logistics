export default function FAQ() {
    const items = [
        { q: 'LoTraDW có thể tiết kiệm bao nhiêu chi phí vận tải?', a: 'LoTraDW giúp tiết kiệm 5–20% chi phí vận tải thông qua tối ưu hóa tuyến, quản lý nhiên liệu và giảm thời gian chờ.' },
        { q: 'Có dễ chuyển đổi từ Excel/Zalo sang LoTraDW không?', a: 'Rất dễ — hệ thống hỗ trợ import dữ liệu từ Excel và đội kỹ thuật hỗ trợ migration.' },
        { q: 'LoTraDW tích hợp được với hệ thống hiện tại không?', a: 'Có, LoTraDW tích hợp liền mạch với ERP, WMS, OMS và thiết bị GPS thông qua API.' },
        { q: 'Mobile app có dễ dùng cho tài xế?', a: 'Ứng dụng dành cho tài xế được thiết kế đơn giản, hỗ trợ nhận lệnh, ePOD và cập nhật trạng thái.' },
    ];

    return (
        <section id="faq" className="py-16 bg-white" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl mb-6" style={{ fontWeight: 700 }}>Câu hỏi thường gặp</h2>
                <div className="space-y-4">
                    {items.map((it) => (
                        <div key={it.q} className="p-4 bg-orange-50 rounded-lg shadow-sm border border-transparent hover:border-orange-100 transition">
                            <div className="font-medium text-gray-800">{it.q}</div>
                            <div className="text-sm text-gray-600 mt-2">{it.a}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
