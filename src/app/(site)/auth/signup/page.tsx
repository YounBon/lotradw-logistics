'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { authService } from '@/lib/services';

const signUpSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    phone: z.string().min(7, 'Số điện thoại không hợp lệ'),
    address: z.string().min(3, 'Vui lòng nhập địa chỉ'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await authService.signUp(data as any);
            router.push('/auth/signin');
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
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
                    <p className="text-gray-600">Đăng ký để sử dụng dịch vụ của chúng tôi</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Đăng ký</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <Input label="Họ và tên" {...register('name')} error={errors.name?.message} />
                            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                            <Input label="Số điện thoại" type="tel" {...register('phone')} error={errors.phone?.message} />
                            <Input label="Địa chỉ" {...register('address')} error={errors.address?.message} />
                            <Input label="Mật khẩu" type="password" {...register('password')} error={errors.password?.message} />

                            <Button type="submit" isLoading={isLoading} className="w-full">Đăng ký</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
