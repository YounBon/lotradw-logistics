'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, MapPin, Package, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { quoteService } from '@/lib/services';
import { QuoteOption } from '@/types';
import { formatCurrency } from '@/lib/utils';

const quoteSchema = z.object({
    origin: z.object({
        province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố gửi'),
        district: z.string().min(1, 'Vui lòng chọn quận/huyện gửi'),
        ward: z.string().min(1, 'Vui lòng chọn phường/xã gửi'),
    }),
    destination: z.object({
        province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố nhận'),
        district: z.string().min(1, 'Vui lòng chọn quận/huyện nhận'),
        ward: z.string().min(1, 'Vui lòng chọn phường/xã nhận'),
    }),
    weight: z.number().min(0.1, 'Trọng lượng phải ít nhất 0.1kg'),
    dimensions: z.object({
        length: z.number().min(1, 'Chiều dài phải ít nhất 1cm'),
        width: z.number().min(1, 'Chiều rộng phải ít nhất 1cm'),
        height: z.number().min(1, 'Chiều cao phải ít nhất 1cm'),
    }),
    deliveryType: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
    value: z.number().min(1000, 'Giá trị hàng hóa phải ít nhất 1,000 VND'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const provinces = [
    'TP. Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'An Giang',
    'Bà Rịa - Vũng Tàu',
];

const deliveryTypes = [
    { value: 'STANDARD', label: 'Tiêu chuẩn (3-5 ngày)', icon: Package },
    { value: 'EXPRESS', label: 'Nhanh (1-2 ngày)', icon: Clock },
    { value: 'SAME_DAY', label: 'Trong ngày', icon: DollarSign },
];

export default function QuotePage() {
    const [quotes, setQuotes] = useState<QuoteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            weight: 1,
            dimensions: { length: 10, width: 10, height: 10 },
            deliveryType: 'STANDARD',
            value: 100000,
        },
    });

    const watchedDimensions = watch('dimensions');
    const volumeWeight = watchedDimensions
        ? (watchedDimensions.length * watchedDimensions.width * watchedDimensions.height) / 5000
        : 0;

    const onSubmit = async (data: QuoteFormData) => {
        setIsLoading(true);
        setError('');
        setQuotes([]);

        try {
            const quoteOptions = await quoteService.getQuote(data);
            setQuotes(quoteOptions);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tính toán báo giá. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calculator className="h-6 w-6 mr-2" />
                    Báo giá nhanh
                </h1>
                <p className="text-gray-600">Tính toán chi phí vận chuyển nhanh chóng và chính xác</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quote Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin vận chuyển</CardTitle>
                            <CardDescription>
                                Nhập thông tin để nhận báo giá chi tiết
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Origin */}
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Điểm gửi
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tỉnh/Thành phố
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...register('origin.province')}
                                            >
                                                <option value="">Chọn tỉnh/thành phố</option>
                                                {provinces.map((province) => (
                                                    <option key={province} value={province}>{province}</option>
                                                ))}
                                            </select>
                                            {errors.origin?.province && (
                                                <p className="text-sm text-red-600 mt-1">{errors.origin.province.message}</p>
                                            )}
                                        </div>
                                        <Input
                                            label="Quận/Huyện"
                                            type="text"
                                            placeholder="Nhập quận/huyện"
                                            error={errors.origin?.district?.message}
                                            {...register('origin.district')}
                                        />
                                        <Input
                                            label="Phường/Xã"
                                            type="text"
                                            placeholder="Nhập phường/xã"
                                            error={errors.origin?.ward?.message}
                                            {...register('origin.ward')}
                                        />
                                    </div>
                                </div>

                                {/* Destination */}
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                                        Điểm nhận
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tỉnh/Thành phố
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...register('destination.province')}
                                            >
                                                <option value="">Chọn tỉnh/thành phố</option>
                                                {provinces.map((province) => (
                                                    <option key={province} value={province}>{province}</option>
                                                ))}
                                            </select>
                                            {errors.destination?.province && (
                                                <p className="text-sm text-red-600 mt-1">{errors.destination.province.message}</p>
                                            )}
                                        </div>
                                        <Input
                                            label="Quận/Huyện"
                                            type="text"
                                            placeholder="Nhập quận/huyện"
                                            error={errors.destination?.district?.message}
                                            {...register('destination.district')}
                                        />
                                        <Input
                                            label="Phường/Xã"
                                            type="text"
                                            placeholder="Nhập phường/xã"
                                            error={errors.destination?.ward?.message}
                                            {...register('destination.ward')}
                                        />
                                    </div>
                                </div>

                                {/* Package Info */}
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center">
                                        <Package className="h-4 w-4 mr-2" />
                                        Thông tin kiện hàng
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <Input
                                            label="Trọng lượng (kg)"
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            error={errors.weight?.message}
                                            {...register('weight', { valueAsNumber: true })}
                                        />
                                        <Input
                                            label="Giá trị hàng hóa (VND)"
                                            type="number"
                                            min="1000"
                                            error={errors.value?.message}
                                            {...register('value', { valueAsNumber: true })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Kích thước (cm)</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input
                                                label="Dài"
                                                type="number"
                                                min="1"
                                                error={errors.dimensions?.length?.message}
                                                {...register('dimensions.length', { valueAsNumber: true })}
                                            />
                                            <Input
                                                label="Rộng"
                                                type="number"
                                                min="1"
                                                error={errors.dimensions?.width?.message}
                                                {...register('dimensions.width', { valueAsNumber: true })}
                                            />
                                            <Input
                                                label="Cao"
                                                type="number"
                                                min="1"
                                                error={errors.dimensions?.height?.message}
                                                {...register('dimensions.height', { valueAsNumber: true })}
                                            />
                                        </div>
                                        {volumeWeight > 0 && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Trọng lượng thể tích: {volumeWeight.toFixed(2)} kg
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Type */}
                                <div>
                                    <h3 className="font-medium mb-3">Loại dịch vụ</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {deliveryTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <label
                                                    key={type.value}
                                                    className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                                                >
                                                    <input
                                                        type="radio"
                                                        value={type.value}
                                                        className="sr-only"
                                                        {...register('deliveryType')}
                                                    />
                                                    <Icon className="h-5 w-5 text-blue-600 mr-3" />
                                                    <span className="text-sm font-medium">{type.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Button type="submit" isLoading={isLoading} className="w-full">
                                    Tính toán báo giá
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Quote Results */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kết quả báo giá</CardTitle>
                            <CardDescription>
                                Các tùy chọn vận chuyển phù hợp
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {quotes.length === 0 && !isLoading && (
                                <div className="text-center py-8">
                                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        Nhập thông tin và nhấn "Tính toán báo giá" để xem kết quả
                                    </p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Đang tính toán báo giá...</p>
                                </div>
                            )}

                            {quotes.length > 0 && (
                                <div className="space-y-4">
                                    {quotes.map((quote, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium">{quote.carrierName}</h4>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-600">
                                                        {formatCurrency(quote.price)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{quote.serviceType}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                <span>Thời gian giao: {Math.ceil(quote.duration / 24)} ngày</span>
                                                <span>ETA: {new Date(quote.eta).toLocaleDateString('vi-VN')}</span>
                                            </div>

                                            {quote.features.length > 0 && (
                                                <div className="text-sm">
                                                    <p className="text-gray-600 mb-1">Tính năng:</p>
                                                    <ul className="text-xs text-gray-500 space-y-1">
                                                        {quote.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-center">
                                                                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <Button variant="outline" size="sm" className="w-full mt-3">
                                                Chọn gói này
                                            </Button>
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