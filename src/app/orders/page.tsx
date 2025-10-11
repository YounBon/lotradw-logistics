'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    History,
    Download,
    Eye,
    Filter,
    ChevronLeft,
    ChevronRight,
    Package,
    MapPin,
    Calendar,
    DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { orderService } from '@/lib/services';
import { Order, PaginatedResponse } from '@/types';
import { formatCurrency, getOrderStatusColor, getOrderStatusText, formatDate, downloadFile } from '@/lib/utils';

const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'IN_TRANSIT', label: 'Đang vận chuyển' },
    { value: 'DELIVERED', label: 'Đã giao hàng' },
    { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        search: '',
    });

    const limit = 10;

    useEffect(() => {
        loadOrders();
    }, [currentPage, filters.status]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.getOrders(
                currentPage,
                limit,
                filters.status || undefined
            );
            setOrders(response.data);
            setTotalPages(response.pagination.totalPages);
            setTotal(response.pagination.total);
        } catch (err: any) {
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderId: string, format: 'pdf' | 'csv') => {
        try {
            const blob = await orderService.downloadInvoice(orderId, format);
            downloadFile(blob, `invoice-${orderId}.${format}`);
        } catch (err: any) {
            alert('Không thể tải hóa đơn. Vui lòng thử lại.');
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const filteredOrders = orders.filter(order =>
        !filters.search ||
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.senderInfo.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.receiverInfo.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <History className="h-6 w-6 mr-2" />
                    Lịch sử đơn hàng
                </h1>
                <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Bộ lọc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Tìm kiếm theo mã đơn hàng, tên..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />

                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <Button onClick={loadOrders} variant="outline">
                            Áp dụng bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Không tìm thấy đơn hàng
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {filters.search || filters.status ? 'Thử thay đổi bộ lọc hoặc' : ''} tạo đơn hàng đầu tiên của bạn
                        </p>
                        <Link href="/orders/create">
                            <Button>Tạo đơn hàng mới</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <Card key={order.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">#{order.orderNumber}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(order.status)}`}>
                                                {getOrderStatusText(order.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{order.senderInfo.province} → {order.receiverInfo.province}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-1" />
                                                <span>{formatCurrency(order.shippingCost)}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <Package className="h-4 w-4 mr-1" />
                                                <span>{order.items.length} mặt hàng</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-600">
                                            <p><span className="font-medium">Người nhận:</span> {order.receiverInfo.name}</p>
                                            {order.carrierName && (
                                                <p><span className="font-medium">Nhà vận chuyển:</span> {order.carrierName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                Chi tiết
                                            </Button>
                                        </Link>

                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadInvoice(order.id, 'pdf')}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                PDF
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadInvoice(order.id, 'csv')}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                CSV
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Card className="mt-6">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Hiển thị {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, total)} của {total} đơn hàng
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <span className="text-sm font-medium">
                                    Trang {currentPage} / {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{total}</div>
                        <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.status === 'DELIVERED').length}
                        </div>
                        <div className="text-sm text-gray-600">Đã giao thành công</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {orders.filter(o => ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)).length}
                        </div>
                        <div className="text-sm text-gray-600">Đang xử lý</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}