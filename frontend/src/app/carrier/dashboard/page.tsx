'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Truck,
    Package,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    MapPin,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Calendar,
    Bell
} from 'lucide-react';

export default function CarrierDashboard() {
    const [stats, setStats] = useState({
        totalVehicles: 12,
        totalDrivers: 18,
        activeOrders: 8,
        completedOrders: 156,
        monthlyRevenue: 125000000,
        onTimeDelivery: 94.5,
        pendingOffers: 5,
        vehiclesInTransit: 6
    });

    const [recentOrders] = useState([
        {
            id: 'ORD-2024-001',
            route: 'TP.HCM → Hà Nội',
            cargo: 'Điện tử',
            weight: '2.5 tấn',
            status: 'Đang vận chuyển',
            driver: 'Nguyễn Văn A',
            vehicle: '29A-12345',
            estimatedDelivery: '2024-10-05',
            priority: 'high'
        },
        {
            id: 'ORD-2024-002',
            route: 'Đà Nẵng → TP.HCM',
            cargo: 'Thực phẩm',
            weight: '1.8 tấn',
            status: 'Đã giao',
            driver: 'Trần Văn B',
            vehicle: '43A-67890',
            estimatedDelivery: '2024-10-04',
            priority: 'medium'
        },
        {
            id: 'ORD-2024-003',
            route: 'Hà Nội → Hải Phòng',
            cargo: 'Vật liệu xây dựng',
            weight: '5.0 tấn',
            status: 'Chuẩn bị',
            driver: 'Lê Văn C',
            vehicle: '30A-11111',
            estimatedDelivery: '2024-10-06',
            priority: 'low'
        }
    ]);

    const [pendingOffers] = useState([
        {
            id: 'OFF-2024-001',
            route: 'TP.HCM → Cần Thơ',
            cargo: 'Máy móc công nghiệp',
            weight: '3.2 tấn',
            suggestedPrice: 4500000,
            deadline: '2024-10-05 14:00',
            distance: '169 km'
        },
        {
            id: 'OFF-2024-002',
            route: 'Hà Nội → Hạ Long',
            cargo: 'Hàng tiêu dùng',
            weight: '1.5 tấn',
            suggestedPrice: 2800000,
            deadline: '2024-10-05 16:00',
            distance: '165 km'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang vận chuyển':
                return 'bg-blue-100 text-blue-800';
            case 'Đã giao':
                return 'bg-green-100 text-green-800';
            case 'Chuẩn bị':
                return 'bg-yellow-100 text-yellow-800';
            case 'Trễ hẹn':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-300';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Đối tác</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Tổng quan hoạt động vận chuyển của bạn
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Lịch trình
                    </Button>
                    <Button size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Thông báo (3)
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Truck className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Số xe</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                            <p className="text-sm text-green-600">+2 xe mới</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Tài xế</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
                            <p className="text-sm text-blue-600">{stats.vehiclesInTransit} đang chạy</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Package className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                            <p className="text-sm text-orange-600">{stats.pendingOffers} chờ báo giá</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Doanh thu tháng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.monthlyRevenue)}
                            </p>
                            <p className="text-sm text-green-600">
                                <TrendingUp className="h-4 w-4 inline mr-1" />
                                +12.5%
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất giao hàng</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Giao đúng hẹn</span>
                            <span className="text-sm font-medium text-green-600">{stats.onTimeDelivery}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${stats.onTimeDelivery}%` }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                                <p className="text-sm text-gray-500">Đơn hoàn thành</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-600">{stats.activeOrders}</p>
                                <p className="text-sm text-gray-500">Đơn đang thực hiện</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cơ hội kinh doanh</h3>
                    <div className="space-y-3">
                        {pendingOffers.slice(0, 2).map((offer) => (
                            <div key={offer.id} className="border-l-4 border-orange-500 pl-4 py-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">{offer.route}</p>
                                        <p className="text-sm text-gray-600">{offer.cargo} • {offer.weight}</p>
                                        <p className="text-sm text-gray-500">Hạn: {offer.deadline}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">{formatCurrency(offer.suggestedPrice)}</p>
                                        <Button size="sm" className="mt-1">
                                            Báo giá
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4">
                            Xem tất cả cơ hội ({stats.pendingOffers})
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
                    <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Xem báo cáo
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tuyến đường
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tài xế / Xe
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dự kiến giao
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className={`border-l-4 ${getPriorityColor(order.priority)}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-500">{order.cargo} • {order.weight}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-900">{order.route}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm text-gray-900">{order.driver}</p>
                                            <p className="text-sm text-gray-500">{order.vehicle}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                            {order.estimatedDelivery}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Button variant="outline" size="sm">
                                            Chi tiết
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}