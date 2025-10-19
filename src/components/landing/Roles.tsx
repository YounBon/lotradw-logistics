export default function Roles() {
    const roles = [
        { title: 'Quản trị viên', bullets: ['Toàn quyền quản lý hệ thống', 'Báo cáo tổng hợp', 'Phân quyền người dùng'] },
        { title: 'Điều phối viên', bullets: ['Lập kế hoạch vận chuyển', 'Phân chuyến tự động', 'Theo dõi realtime'] },
        { title: 'Tài xế', bullets: ['Nhận lệnh nhanh', 'Xác nhận ePOD', 'Cập nhật trạng thái'] },
        { title: 'Khách hàng', bullets: ['Theo dõi đơn hàng', 'Nhận thông báo', 'Xem lịch sử & hóa đơn'] },
    ];

    return (
        <section className="py-16 bg-orange-50" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl mb-6 text-gray-800" style={{ fontWeight: 700 }}>Giao diện theo vai trò</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {roles.map((r) => (
                        <div key={r.title} className="bg-white p-6 rounded-xl shadow-md border border-transparent hover:border-orange-100 transition">
                            <h3 className="text-gray-800 mb-3" style={{ fontWeight: 700 }}>{r.title}</h3>
                            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1" style={{ fontWeight: 400 }}>
                                {r.bullets.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
