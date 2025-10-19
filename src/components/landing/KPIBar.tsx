export default function KPIBar() {
    const kpis = [
        { value: '150+', label: 'Doanh nghiệp tin dùng' },
        { value: '24,000+', label: 'Xe được quản lý' },
        { value: '250,000+', label: 'Chuyến hàng / tháng' },
    ];

    return (
        <section id="benefits" className="py-10 bg-gradient-to-r from-white to-orange-50" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {kpis.map((k) => (
                    <div key={k.label} className="text-center bg-white rounded-xl shadow p-4 min-w-[160px]">
                        <div className="text-3xl text-orange-600" style={{ fontWeight: 700 }}>{k.value}</div>
                        <div className="text-sm text-gray-700" style={{ fontWeight: 400 }}>{k.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
