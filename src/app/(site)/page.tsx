import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
            <div className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl font-extrabold text-orange-600 leading-tight mb-6">LoTraDW — Logistics Platform with Data Warehouse & DSS</h1>
                        <p className="text-lg text-gray-700 mb-6">Kết nối khách hàng — nhà vận tải — quản trị viên. Tối ưu hóa chi phí, ghép đơn thông minh, và dự báo nhu cầu sử dụng mô-đun DSS tích hợp Data Warehouse.</p>

                        <div className="flex space-x-4">
                            <Link href="/auth/signin">
                                <Button size="lg">Đăng nhập</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button variant="outline" size="lg">Đăng ký</Button>
                            </Link>
                        </div>

                        <div className="mt-10 grid sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg shadow">
                                <h4 className="text-orange-600 font-semibold">Quick Quote</h4>
                                <p className="text-sm text-gray-600">Nhập điểm gửi/nhận và trọng lượng để nhận báo giá trung bình từ dữ liệu lịch sử.</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow">
                                <h4 className="text-orange-600 font-semibold">Carrier Suggestion DSS</h4>
                                <p className="text-sm text-gray-600">Gợi ý 2–3 nhà vận tải tối ưu dựa trên tuyến, rating và chi phí lịch sử.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-100 rounded-2xl shadow-lg transform -translate-x-4 -translate-y-4" />
                        <div className="relative bg-white rounded-2xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Platform Overview</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li>• Đăng ký / Đăng nhập cho Customer & Carrier (Admin được tạo thủ công).</li>
                                <li>• Tạo đơn, theo dõi trạng thái, tải hóa đơn, và đánh giá dịch vụ.</li>
                                <li>• Carrier quản lý đội xe, tài xế, và gửi báo giá.</li>
                                <li>• Admin kiểm soát người dùng, duyệt carrier, và xem dashboard KPI.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Modules & Features</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="font-semibold text-orange-600 mb-2">ETL & Data Warehouse</h4>
                            <p className="text-sm text-gray-600">Chuẩn hóa dữ liệu đơn hàng để phục vụ phân tích và dự báo.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="font-semibold text-orange-600 mb-2">Shared Delivery</h4>
                            <p className="text-sm text-gray-600">Ghép đơn cùng tuyến để tối ưu chi phí và nâng cao sử dụng xe.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="font-semibold text-orange-600 mb-2">Forecasting & KPI</h4>
                            <p className="text-sm text-gray-600">Dự báo nhu cầu và hiển thị KPI trên dashboard cho admin và carrier.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
