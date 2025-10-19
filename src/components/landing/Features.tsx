export default function Features() {
    const items = [
        { title: 'Quản lý toàn trình vận chuyển', desc: 'Theo dõi realtime, cập nhật trạng thái và thông báo tức thời', icon: '🚚' },
        { title: 'Tối ưu lộ trình', desc: 'AI đề xuất lộ trình tối ưu, giảm chi phí nhiên liệu và thời gian', icon: '🧭' },
        { title: 'Tự động hóa chi phí', desc: 'Hóa đơn điện tử và báo cáo chi phí tự động, lưu trữ an toàn', icon: '💳' },
        { title: 'Báo cáo thông minh', desc: 'Bảng điều khiển trực quan với KPI real-time và phân tích xu hướng', icon: '📊' },
    ];

    return (
        <section id="features" className="py-16 bg-white" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl text-gray-800 mb-6" style={{ fontWeight: 700 }}>Tính năng nổi bật</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map((it) => (
                        <div key={it.title} className="bg-orange-50 p-5 rounded-xl shadow-md border border-transparent hover:border-orange-100 transition">
                            <div className="text-3xl mb-3 text-orange-600">{it.icon}</div>
                            <h3 className="text-gray-800 mb-2" style={{ fontWeight: 600 }}>{it.title}</h3>
                            <p className="text-sm text-gray-600" style={{ fontWeight: 400 }}>{it.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
