'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, MessageSquare, Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { orderService, ratingService } from '@/lib/services';
import { Order, ServiceRating } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const ratingSchema = z.object({
    orderId: z.string().min(1, 'Vui lòng chọn đơn hàng'),
    rating: z.number().min(1, 'Vui lòng chọn số sao').max(5),
    feedback: z.string().min(10, 'Nhận xét phải có ít nhất 10 ký tự'),
    categories: z.object({
        punctuality: z.number().min(1).max(5),
        communication: z.number().min(1).max(5),
        packaging: z.number().min(1).max(5),
        overall: z.number().min(1).max(5),
    }),
});

type RatingFormData = z.infer<typeof ratingSchema>;

const StarRating = ({
    value,
    onChange,
    size = 'w-6 h-6'
}: {
    value: number;
    onChange: (value: number) => void;
    size?: string;
}) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className={`${size} transition-colors ${star <= value
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                        }`}
                >
                    <Star className="w-full h-full" />
                </button>
            ))}
        </div>
    );
};

export default function RatingsPage() {
    const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
    const [ratings, setRatings] = useState<ServiceRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<RatingFormData>({
        resolver: zodResolver(ratingSchema),
        defaultValues: {
            rating: 5,
            categories: {
                punctuality: 5,
                communication: 5,
                packaging: 5,
                overall: 5,
            },
        },
    });

    const watchedRating = watch('rating');
    const watchedCategories = watch('categories');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const ordersResponse = await orderService.getOrders(1, 50, 'DELIVERED');
            const orders = ordersResponse.data;

            const ratingsPromises = orders.map(order => ratingService.getOrderRating(order.id));
            const ratingsResults = await Promise.allSettled(ratingsPromises);

            const existingRatings: ServiceRating[] = [];
            const unratedOrders: Order[] = [];

            orders.forEach((order, index) => {
                const ratingResult = ratingsResults[index];
                if (ratingResult.status === 'fulfilled' && ratingResult.value) {
                    existingRatings.push(ratingResult.value);
                } else {
                    unratedOrders.push(order);
                }
            });

            setDeliveredOrders(unratedOrders);
            setRatings(existingRatings);
        } catch (err: any) {
            setError('Không thể tải dữ liệu đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: RatingFormData) => {
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const order = deliveredOrders.find(o => o.id === data.orderId);
            if (!order) throw new Error('Không tìm thấy đơn hàng');

            await ratingService.submitRating({
                orderId: data.orderId,
                customerId: order.customerId,
                carrierId: order.carrierId!,
                rating: data.rating,
                feedback: data.feedback,
                categories: data.categories,
            });

            setSuccess('Đánh giá đã được gửi thành công!');
            reset();
            loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Star className="h-6 w-6 mr-2 text-yellow-500" />
                    Đánh giá dịch vụ
                </h1>
                <p className="text-gray-600">Đánh giá chất lượng dịch vụ vận chuyển</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Đánh giá đơn hàng mới</CardTitle>
                            <CardDescription>
                                Chia sẻ trải nghiệm của bạn về dịch vụ vận chuyển
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {deliveredOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Tất cả đơn hàng đã được đánh giá
                                    </h3>
                                    <p className="text-gray-600">
                                        Bạn đã đánh giá tất cả các đơn hàng đã giao thành công
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                                            {success}
                                        </div>
                                    )}

                                    {/* Order Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn đơn hàng cần đánh giá
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...register('orderId')}
                                        >
                                            <option value="">Chọn đơn hàng</option>
                                            {deliveredOrders.map((order) => (
                                                <option key={order.id} value={order.id}>
                                                    #{order.orderNumber} - {order.carrierName} ({formatDate(order.deliveryDate!)})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.orderId && (
                                            <p className="text-sm text-red-600 mt-1">{errors.orderId.message}</p>
                                        )}
                                    </div>

                                    {/* Overall Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Đánh giá tổng thể
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <StarRating
                                                value={watchedRating}
                                                onChange={(value) => setValue('rating', value)}
                                                size="w-8 h-8"
                                            />
                                            <span className="text-lg font-medium">
                                                {watchedRating}/5 sao
                                            </span>
                                        </div>
                                        {errors.rating && (
                                            <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
                                        )}
                                    </div>

                                    {/* Category Ratings */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-4">Đánh giá chi tiết</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Tính đúng giờ</span>
                                                <StarRating
                                                    value={watchedCategories.punctuality}
                                                    onChange={(value) => setValue('categories.punctuality', value)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Giao tiếp</span>
                                                <StarRating
                                                    value={watchedCategories.communication}
                                                    onChange={(value) => setValue('categories.communication', value)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Đóng gói</span>
                                                <StarRating
                                                    value={watchedCategories.packaging}
                                                    onChange={(value) => setValue('categories.packaging', value)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Chất lượng tổng thể</span>
                                                <StarRating
                                                    value={watchedCategories.overall}
                                                    onChange={(value) => setValue('categories.overall', value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nhận xét chi tiết
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={4}
                                            placeholder="Chia sẻ trải nghiệm chi tiết về dịch vụ vận chuyển..."
                                            {...register('feedback')}
                                        />
                                        {errors.feedback && (
                                            <p className="text-sm text-red-600 mt-1">{errors.feedback.message}</p>
                                        )}
                                    </div>

                                    <Button type="submit" isLoading={submitting} className="w-full">
                                        Gửi đánh giá
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Previous Ratings */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Đánh giá đã gửi</CardTitle>
                            <CardDescription>
                                Các đánh giá trước đây của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ratings.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {ratings.map((rating) => (
                                        <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < rating.rating
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(rating.createdAt)}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-2">{rating.feedback}</p>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                                <div>Đúng giờ: {rating.categories.punctuality}⭐</div>
                                                <div>Giao tiếp: {rating.categories.communication}⭐</div>
                                                <div>Đóng gói: {rating.categories.packaging}⭐</div>
                                                <div>Tổng thể: {rating.categories.overall}⭐</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
