export default function Awards() {
    const awards = [
        { title: 'Giải thưởng Sao Khuê 2019' },
        { title: 'Make in Vietnam 2022' },
        { title: 'Top Công nghệ 4.0 Việt Nam 2025' },
    ];

    return (
        <section className="py-12 bg-gray-50" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h3 className="text-lg mb-4" style={{ fontWeight: 700 }}>Được vinh danh bởi</h3>
                <div className="flex items-center justify-center gap-6 flex-wrap">
                    {awards.map((a) => (
                        <div key={a.title} className="text-sm text-gray-700 p-3 bg-white rounded shadow-sm">{a.title}</div>
                    ))}
                </div>
            </div>
        </section>
    );
}
