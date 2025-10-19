import Image from 'next/image';

export default function CaseStudies() {
    const cases = [
        { title: 'Tối ưu tuyến nội địa', subtitle: 'Giảm chi phí nhiên liệu 12% cho khách hàng A', image: '/images/landing/case-1.png' },
        { title: 'Ghép đơn thông minh', subtitle: 'Tăng tỷ lệ lấp đầy xe lên 18%', image: '/images/landing/case-2.png' },
    ];

    return (
        <section className="py-16 bg-gray-50" style={{ fontFamily: 'Inter, "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl mb-6" style={{ fontWeight: 700 }}>Dự án tiêu biểu</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {cases.map((c) => (
                        <div key={c.title} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-transparent hover:border-orange-100 transition">
                            <div className="w-full h-48 bg-gray-100">
                                <Image src={c.image} alt={c.title} width={1200} height={400} className="object-cover w-full h-full" />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg text-gray-800" style={{ fontWeight: 700 }}>{c.title}</h3>
                                <p className="text-sm text-gray-600" style={{ fontWeight: 400 }}>{c.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
