'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { authService } from '@/lib/services';

const signUpSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
    phone: z.string().regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const { confirmPassword, ...signUpData } = data;
            await authService.signUp(signUpData);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center">
                        <Truck className="h-12 w-12 text-orange-600" />
                    </div>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">LoTraDW</h1>
                    <p className="text-gray-600">Hệ thống quản lý logistics</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Đăng ký tài khoản</CardTitle>
                        <CardDescription>
                            Tạo tài khoản mới để sử dụng dịch vụ logistics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                    {error}
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
                                label="Email"
                                type="email"
                                placeholder="Nhập email"
                                error={errors.email?.message}
                                {...register('email')}
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

                            <Input
                                label="Mật khẩu"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <Input
                                label="Xác nhận mật khẩu"
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Đăng ký
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-gray-600">Đã có tài khoản? </span>
                                <Link href="/auth/signin" className="text-orange-600 hover:text-orange-800">
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}