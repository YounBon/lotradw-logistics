'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, Package, User, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { orderService } from '@/lib/services';
import { useRouter } from 'next/navigation';

const itemSchema = z.object({
    name: z.string().min(1, 'Tên hàng hóa không được trống'),
    quantity: z.number().min(1, 'Số lượng phải ít nhất là 1'),
    weight: z.number().min(0.1, 'Trọng lượng phải ít nhất 0.1kg'),
    dimensions: z.object({
        length: z.number().min(1, 'Chiều dài phải ít nhất 1cm'),
        width: z.number().min(1, 'Chiều rộng phải ít nhất 1cm'),
        height: z.number().min(1, 'Chiều cao phải ít nhất 1cm'),
    }),
    value: z.number().min(1000, 'Giá trị hàng hóa phải ít nhất 1,000 VND'),
    category: z.string().min(1, 'Danh mục không được trống'),
});

const addressSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    street: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
    district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
    province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
    postalCode: z.string().optional(),
});

const orderSchema = z.object({
    senderInfo: addressSchema,
    receiverInfo: addressSchema,
    items: z.array(itemSchema).min(1, 'Phải có ít nhất một mặt hàng'),
    deliveryDeadline: z.string().min(1, 'Vui lòng chọn thời hạn giao hàng'),
    notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const categories = [
    'Điện tử',
    'Thời trang',
    'Thực phẩm',
    'Sách/văn phòng phẩm',
    'Gia dụng',
    'Mỹ phẩm',
    'Khác'
];

const provinces = [
    'TP. Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'An Giang',
    'Bà Rịa - Vũng Tàu',
    // Add more provinces as needed
];

export default function CreateOrderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            items: [{
                name: '',
                quantity: 1,
                weight: 1,
                dimensions: { length: 1, width: 1, height: 1 },
                value: 10000,
                category: '',
            }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const watchedItems = watch('items');

    const totalWeight = watchedItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalValue = watchedItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);

    const onSubmit = async (data: OrderFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const order = await orderService.createOrder(data);
            router.push(`/orders/${order.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Tạo đơn hàng thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tạo đơn hàng mới</h1>
                <p className="text-gray-600">Điền thông tin chi tiết để tạo đơn hàng vận chuyển</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Sender Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Thông tin người gửi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Họ và tên người gửi"
                                type="text"
                                placeholder="Nhập họ tên"
                                error={errors.senderInfo?.name?.message}
                                {...register('senderInfo.name')}
                            />
                            <Input
                                label="Số điện thoại"
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                error={errors.senderInfo?.phone?.message}
                                {...register('senderInfo.phone')}
                            />
                        </div>
                        <Input
                            label="Địa chỉ chi tiết"
                            type="text"
                            placeholder="Số nhà, tên đường"
                            error={errors.senderInfo?.street?.message}
                            {...register('senderInfo.street')}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('senderInfo.province')}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                                {errors.senderInfo?.province && (
                                    <p className="text-sm text-red-600 mt-1">{errors.senderInfo.province.message}</p>
                                )}
                            </div>
                            <Input
                                label="Quận/Huyện"
                                type="text"
                                placeholder="Nhập quận/huyện"
                                error={errors.senderInfo?.district?.message}
                                {...register('senderInfo.district')}
                            />
                            <Input
                                label="Phường/Xã"
                                type="text"
                                placeholder="Nhập phường/xã"
                                error={errors.senderInfo?.ward?.message}
                                {...register('senderInfo.ward')}
                            />
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
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Họ và tên người nhận"
                                type="text"
                                placeholder="Nhập họ tên"
                                error={errors.receiverInfo?.name?.message}
                                {...register('receiverInfo.name')}
                            />
                            <Input
                                label="Số điện thoại"
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                error={errors.receiverInfo?.phone?.message}
                                {...register('receiverInfo.phone')}
                            />
                        </div>
                        <Input
                            label="Địa chỉ chi tiết"
                            type="text"
                            placeholder="Số nhà, tên đường"
                            error={errors.receiverInfo?.street?.message}
                            {...register('receiverInfo.street')}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('receiverInfo.province')}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                                {errors.receiverInfo?.province && (
                                    <p className="text-sm text-red-600 mt-1">{errors.receiverInfo.province.message}</p>
                                )}
                            </div>
                            <Input
                                label="Quận/Huyện"
                                type="text"
                                placeholder="Nhập quận/huyện"
                                error={errors.receiverInfo?.district?.message}
                                {...register('receiverInfo.district')}
                            />
                            <Input
                                label="Phường/Xã"
                                type="text"
                                placeholder="Nhập phường/xã"
                                error={errors.receiverInfo?.ward?.message}
                                {...register('receiverInfo.ward')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Thông tin hàng hóa
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({
                                    name: '',
                                    quantity: 1,
                                    weight: 1,
                                    dimensions: { length: 1, width: 1, height: 1 },
                                    value: 10000,
                                    category: '',
                                })}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Thêm mặt hàng
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">Mặt hàng {index + 1}</h4>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Tên hàng hóa"
                                        type="text"
                                        placeholder="VD: Laptop Dell XPS 13"
                                        error={errors.items?.[index]?.name?.message}
                                        {...register(`items.${index}.name`)}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Danh mục
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...register(`items.${index}.category`)}
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        {errors.items?.[index]?.category && (
                                            <p className="text-sm text-red-600 mt-1">{errors.items[index]?.category?.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Input
                                        label="Số lượng"
                                        type="number"
                                        min="1"
                                        error={errors.items?.[index]?.quantity?.message}
                                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                    />
                                    <Input
                                        label="Trọng lượng (kg)"
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        error={errors.items?.[index]?.weight?.message}
                                        {...register(`items.${index}.weight`, { valueAsNumber: true })}
                                    />
                                    <Input
                                        label="Giá trị (VND)"
                                        type="number"
                                        min="1000"
                                        error={errors.items?.[index]?.value?.message}
                                        {...register(`items.${index}.value`, { valueAsNumber: true })}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Kích thước (cm)</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input
                                            label="Dài"
                                            type="number"
                                            min="1"
                                            error={errors.items?.[index]?.dimensions?.length?.message}
                                            {...register(`items.${index}.dimensions.length`, { valueAsNumber: true })}
                                        />
                                        <Input
                                            label="Rộng"
                                            type="number"
                                            min="1"
                                            error={errors.items?.[index]?.dimensions?.width?.message}
                                            {...register(`items.${index}.dimensions.width`, { valueAsNumber: true })}
                                        />
                                        <Input
                                            label="Cao"
                                            type="number"
                                            min="1"
                                            error={errors.items?.[index]?.dimensions?.height?.message}
                                            {...register(`items.${index}.dimensions.height`, { valueAsNumber: true })}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Tổng kết đơn hàng</h4>
                            <div className="text-sm space-y-1">
                                <p>Tổng số mặt hàng: {fields.length}</p>
                                <p>Tổng trọng lượng: {totalWeight.toFixed(1)} kg</p>
                                <p>Tổng giá trị: {totalValue.toLocaleString('vi-VN')} VND</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Thời gian giao hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Thời hạn giao hàng"
                            type="datetime-local"
                            error={errors.deliveryDeadline?.message}
                            {...register('deliveryDeadline')}
                            min={new Date().toISOString().slice(0, 16)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú (tùy chọn)
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Ghi chú thêm về đơn hàng..."
                                {...register('notes')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex space-x-4">
                    <Button type="submit" isLoading={isLoading}>
                        Tạo đơn hàng
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Hủy bỏ
                    </Button>
                </div>
            </form>
        </div>
    );
}