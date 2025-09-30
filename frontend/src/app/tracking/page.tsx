'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Search,
    MapPin,
    Clock,
    CheckCircle,
    Package,
    Truck,
    AlertCircle,
    Phone,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { orderService } from '@/lib/services';
import { Order } from '@/types';
import { formatCurrency, getOrderStatusColor, getOrderStatusText, formatDate, formatRelativeTime } from '@/lib/utils';

const trackingSchema = z.object({
    orderNumber: z.string().min(1, 'Vui lòng nhập mã đơn hàng'),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

const timelineIcons = {
    PENDING: Clock,
    CONFIRMED: CheckCircle,
    PICKUP_SCHEDULED: Package,
    PICKED_UP: Package,
    IN_TRANSIT: Truck,
    OUT_FOR_DELIVERY: Truck,
    DELIVERED: CheckCircle,
    CANCELLED: AlertCircle,
    FAILED_DELIVERY: AlertCircle,
};

export default function TrackingPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TrackingFormData>({
        resolver: zodResolver(trackingSchema),
    });

    const onSubmit = async (data: TrackingFormData) => {
        setIsLoading(true);
        setError('');
        setOrder(null);

        try {
            const foundOrder = await orderService.trackOrder(data.orderNumber);
            setOrder(foundOrder);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateETA = () => {
        if (!order || !order.eta) return null;

        const eta = new Date(order.eta);
        const now = new Date();
        const diffMs = eta.getTime() - now.getTime();

        if (diffMs <= 0) return 'Đã quá hạn';

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) {
            return `${diffDays} ngày ${diffHours} giờ`;
        }
        return `${diffHours} giờ`;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MapPin className="h-6 w-6 mr-2" />
                    Theo dõi đơn hàng
                </h1>
                <p className="text-gray-600">Nhập mã đơn hàng để xem trạng thái vận chuyển</p>
            </div>

            {/* Search Form */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Tìm kiếm đơn hàng</CardTitle>
                    <CardDescription>
                        Nhập mã đơn hàng (ví dụ: ORD20240101001)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Nhập mã đơn hàng"
                                error={errors.orderNumber?.message}
                                {...register('orderNumber')}
                            />
                        </div>
                        <Button type="submit" isLoading={isLoading}>
                            <Search className="h-4 w-4 mr-2" />
                            Tìm kiếm
                        </Button>
                    </form>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mt-4">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details */}
            {order && (
                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Đơn hàng #{order.orderNumber}</span>
                                <span className={`px-3 py-1 text-sm rounded-full ${getOrderStatusColor(order.status)}`}>
                                    {getOrderStatusText(order.status)}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Ngày tạo</p>
                                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Chi phí vận chuyển</p>
                                    <p className="font-medium">{formatCurrency(order.shippingCost)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nhà vận chuyển</p>
                                    <p className="font-medium">{order.carrierName || 'Chưa được gán'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ETA còn lại</p>
                                    <p className="font-medium text-orange-600">{calculateETA() || 'Đang cập nhật'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline vận chuyển</CardTitle>
                            <CardDescription>
                                Trạng thái chi tiết của đơn hàng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.timeline.map((event, index) => {
                                    const Icon = timelineIcons[event.status] || Package;
                                    const isCompleted = event.isCompleted;
                                    const isLast = index === order.timeline.length - 1;

                                    return (
                                        <div key={event.id} className="flex items-start space-x-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`
                          rounded-full p-2 
                          ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                        `}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                {!isLast && (
                                                    <div className={`w-0.5 h-12 mt-2 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`} />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {getOrderStatusText(event.status)}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {formatRelativeTime(event.timestamp)}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                                                {event.location && (
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {event.location}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDate(event.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sender Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Thông tin người gửi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                    <p className="font-medium">{order.senderInfo.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        {order.senderInfo.phone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium">
                                        {order.senderInfo.street}, {order.senderInfo.ward}, {order.senderInfo.district}, {order.senderInfo.province}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Receiver Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Thông tin người nhận
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                    <p className="font-medium">{order.receiverInfo.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        {order.receiverInfo.phone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium">
                                        {order.receiverInfo.street}, {order.receiverInfo.ward}, {order.receiverInfo.district}, {order.receiverInfo.province}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Package Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Chi tiết hàng hóa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{item.name}</h4>
                                                <p className="text-sm text-gray-600">Danh mục: {item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">Số lượng: {item.quantity}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.weight}kg - {formatCurrency(item.value)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Kích thước: {item.dimensions.length} × {item.dimensions.width} × {item.dimensions.height} cm
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Tổng trọng lượng:</span>
                                        <span className="font-medium">{order.totalWeight} kg</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tổng giá trị:</span>
                                        <span className="font-medium">{formatCurrency(order.totalValue)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}