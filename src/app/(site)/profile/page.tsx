'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { authService } from '@/lib/services';
import { User as UserType } from '@/types';

const profileSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
                reset({
                    name: userData.name,
                    phone: userData.phone,
                    address: userData.address,
                });
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
            }
        };

        loadUser();
    }, [reset]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            setSuccess('Cập nhật thông tin thành công!');
            reset(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý thông tin cá nhân</h1>
                <p className="text-gray-600">Cập nhật thông tin tài khoản của bạn</p>
            </div>

            <div className="space-y-6">
                {/* Current Info Display */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Thông tin hiện tại
                        </CardTitle>
                        <CardDescription>
                            Thông tin tài khoản đã đăng ký
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Họ và tên</p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-medium">{user.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cập nhật thông tin</CardTitle>
                        <CardDescription>
                            Thay đổi thông tin cá nhân của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                            <Input
                                label="Họ và tên"
                                type="text"
                                placeholder="Nhập họ và tên"
                                error={errors.name?.message}
                                {...register('name')}
                            />

                            <Input
                                label="Số điện thoại"
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                error={errors.phone?.message}
                                {...register('phone')}
                            />

                            <Input
                                label="Địa chỉ"
                                type="text"
                                placeholder="Nhập địa chỉ chi tiết"
                                error={errors.address?.message}
                                {...register('address')}
                            />

                            <div className="flex space-x-3">
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    disabled={!isDirty}
                                >
                                    Cập nhật thông tin
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset({
                                            name: user.name,
                                            phone: user.phone,
                                            address: user.address,
                                        });
                                        setError('');
                                        setSuccess('');
                                    }}
                                    disabled={!isDirty}
                                >
                                    Hủy bỏ
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin tài khoản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">ID tài khoản:</span> {user.id}</p>
                            <p><span className="font-medium">Ngày tạo:</span> {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                            <p><span className="font-medium">Cập nhật cuối:</span> {new Date(user.updatedAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
