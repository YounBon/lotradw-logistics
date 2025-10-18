import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-orange-600 mb-6">
                        LoTraDW Logistics Platform
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Hệ thống quản lý logistics toàn diện với công nghệ hiện đại
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Khách hàng mới</h3>
                        <p className="text-gray-600 mb-4">
                            Đăng ký tài khoản để sử dụng các dịch vụ logistics
                        </p>
                        <Link href="/auth/signup">
                            <Button className="w-full">Đăng ký ngay</Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Đã có tài khoản</h3>
                        <p className="text-gray-600 mb-4">
                            Đăng nhập để quản lý đơn hàng và theo dõi vận chuyển
                        </p>
                        <Link href="/auth/signin">
                            <Button variant="outline" className="w-full">Đăng nhập</Button>
                        </Link>
                    </div>

                    <div className="bg-orange-600 p-6 rounded-lg shadow-lg text-white">
                        <h3 className="text-2xl font-semibold mb-4">Carrier Portal</h3>
                        <p className="mb-4">
                            Xem giao diện dành cho nhà vận chuyển
                        </p>
                        <Link href="/carrier/dashboard">
                            <Button variant="outline" className="w-full border-white text-orange-600 bg-white hover:bg-gray-100">
                                Xem Carrier Portal
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
