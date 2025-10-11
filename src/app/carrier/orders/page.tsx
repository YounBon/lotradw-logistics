'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Package,
    MapPin,
    Clock,
    DollarSign,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    Truck,
    Calendar,
    Weight,
    User
} from 'lucide-react';

export default function CarrierOrdersPage() {
    const [activeTab, setActiveTab] = useState<'open' | 'active' | 'completed'>('open');
    const [searchTerm, setSearchTerm] = useState('');

    const [openOrders] = useState([
        {
            id: 'ORD-2024-010',
            customer: 'Công ty ABC',
            route: {
                from: 'TP.HCM',
                to: 'Hà Nội',
                distance: '1,715 km'
            },
            cargo: {
                type: 'Điện tử',
                weight: '2.5 tấn',
                dimensions: '2x1.5x1 m'
            },
            timeline: {
                pickupDate: '2024-10-06',
                deliveryDate: '2024-10-08',
                posted: '2024-10-04'
            },
            price: {
                suggested: 8500000,
                type: 'Cố định'
            },
            priority: 'high',
            requirements: ['Xe tải nhỏ', 'Bảo hiểm hàng hóa', 'GPS tracking'],
            offers: 3
        },
        {
            id: 'ORD-2024-011',
            customer: 'Siêu thị XYZ',
            route: {
                from: 'Đà Nẵng',
                to: 'Hội An',
                distance: '32 km'
            },
            cargo: {
                type: 'Thực phẩm tươi sống',
                weight: '1.2 tấn',
                dimensions: '1.5x1x0.8 m'
            },
            timeline: {
                pickupDate: '2024-10-05',
                deliveryDate: '2024-10-05',
                posted: '2024-10-04'
            },
            price: {
                suggested: 850000,
                type: 'Có thương lượng'
            },
            priority: 'medium',
            requirements: ['Xe lạnh', 'Giao trong ngày'],
            offers: 1
        }
    ]);

    const [activeOrders] = useState([
        {
            id: 'ORD-2024-008',
            customer: 'Nhà máy DEF',
            route: {
                from: 'TP.HCM',
                to: 'Cần Thơ',
                distance: '169 km'
            },
            cargo: {
                type: 'Máy móc công nghiệp',
                weight: '3.8 tấn'
            },
            driver: 'Nguyễn Văn A',
            vehicle: '29A-12345',
            status: 'Đang vận chuyển',
            progress: 65,
            timeline: {
                pickupDate: '2024-10-04',
                deliveryDate: '2024-10-05',
                actualPickup: '2024-10-04 08:30'
            },
            price: 4500000,
            currentLocation: 'Mỹ Tho, Tiền Giang'
        },
        {
            id: 'ORD-2024-009',
            customer: 'Công ty GHI',
            route: {
                from: 'Hà Nội',
                to: 'Hải Phòng',
                distance: '102 km'
            },
            cargo: {
                type: 'Vật liệu xây dựng',
                weight: '5.0 tấn'
            },
            driver: 'Trần Văn B',
            vehicle: '43A-67890',
            status: 'Đã lấy hàng',
            progress: 25,
            timeline: {
                pickupDate: '2024-10-04',
                deliveryDate: '2024-10-05',
                actualPickup: '2024-10-04 14:00'
            },
            price: 2800000,
            currentLocation: 'Hà Nội'
        }
    ]);

    const [completedOrders] = useState([
        {
            id: 'ORD-2024-007',
            customer: 'Cửa hàng JKL',
            route: {
                from: 'TP.HCM',
                to: 'Vũng Tàu',
                distance: '125 km'
            },
            cargo: {
                type: 'Hàng tiêu dùng',
                weight: '1.5 tấn'
            },
            driver: 'Lê Văn C',
            vehicle: '30A-11111',
            status: 'Đã giao',
            timeline: {
                pickupDate: '2024-10-03',
                deliveryDate: '2024-10-03',
                actualPickup: '2024-10-03 09:00',
                actualDelivery: '2024-10-03 12:30'
            },
            price: 2200000,
            rating: 5,
            feedback: 'Giao hàng nhanh chóng, tài xế thân thiện'
        }
    ]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500 bg-red-50';
            case 'medium':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'low':
                return 'border-l-green-500 bg-green-50';
            default:
                return 'border-l-gray-300 bg-gray-50';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang vận chuyển':
                return 'bg-blue-100 text-blue-800';
            case 'Đã lấy hàng':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã giao':
                return 'bg-green-100 text-green-800';
            case 'Trễ hẹn':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const OpenOrderCard = ({ order }: { order: any }) => (
        <Card className={`p-6 border-l-4 ${getPriorityColor(order.priority)} hover:shadow-lg transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">{formatCurrency(order.price.suggested)}</p>
                    <p className="text-xs text-gray-500">{order.price.type}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{order.route.from} → {order.route.to}</span>
                    <span className="ml-auto text-gray-500">({order.route.distance})</span>
                </div>

                <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{order.cargo.type} • {order.cargo.weight}</span>
                </div>

                <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Lấy: {order.timeline.pickupDate} • Giao: {order.timeline.deliveryDate}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                    {order.requirements.map((req: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {req}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                    {order.offers} báo giá • Đăng {order.timeline.posted}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Chi tiết
                    </Button>
                    <Button size="sm">
                        Báo giá
                    </Button>
                </div>
            </div>
        </Card>
    );

    const ActiveOrderCard = ({ order }: { order: any }) => (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{order.route.from} → {order.route.to}</span>
                </div>

                <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{order.driver} • {order.vehicle}</span>
                </div>

                <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-orange-400 mr-2" />
                    <span>Hiện tại: {order.currentLocation}</span>
                </div>

                <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span>Tiến độ</span>
                        <span>{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-lg font-bold text-green-600">
                    {formatCurrency(order.price)}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Theo dõi
                    </Button>
                    <Button size="sm">
                        Cập nhật
                    </Button>
                </div>
            </div>
        </Card>
    );

    const CompletedOrderCard = ({ order }: { order: any }) => (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    {order.rating && (
                        <div className="mt-1">
                            <span className="text-yellow-500">{'⭐'.repeat(order.rating)}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{order.route.from} → {order.route.to}</span>
                </div>

                <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{order.driver} • {order.vehicle}</span>
                </div>

                <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Giao: {order.timeline.actualDelivery}</span>
                </div>

                {order.feedback && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">"{order.feedback}"</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-lg font-bold text-green-600">
                    {formatCurrency(order.price)}
                </div>
                <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                </Button>
            </div>
        </Card>
    );

    const getCurrentOrders = () => {
        switch (activeTab) {
            case 'open':
                return openOrders;
            case 'active':
                return activeOrders;
            case 'completed':
                return completedOrders;
            default:
                return [];
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Xem và quản lý các đơn hàng vận chuyển
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Lịch trình
                    </Button>
                    <Button size="sm">
                        <Package className="h-4 w-4 mr-2" />
                        Đơn mới
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-8 w-8 text-orange-600" />
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Đơn mở</p>
                            <p className="text-2xl font-bold text-gray-900">{openOrders.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Đang thực hiện</p>
                            <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-purple-600" />
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Doanh thu tuần</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(completedOrders.reduce((sum, order) => sum + order.price, 0))}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('open')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'open'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <AlertCircle className="h-4 w-4 inline mr-2" />
                        Đơn mở ({openOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'active'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Clock className="h-4 w-4 inline mr-2" />
                        Đang thực hiện ({activeOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <CheckCircle className="h-4 w-4 inline mr-2" />
                        Hoàn thành ({completedOrders.length})
                    </button>
                </nav>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                    />
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                </Button>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getCurrentOrders().map((order) => {
                    switch (activeTab) {
                        case 'open':
                            return <OpenOrderCard key={order.id} order={order} />;
                        case 'active':
                            return <ActiveOrderCard key={order.id} order={order} />;
                        case 'completed':
                            return <CompletedOrderCard key={order.id} order={order} />;
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
}