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

const signInSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await authService.signIn(data);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
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
                        <CardTitle>Đăng nhập</CardTitle>
                        <CardDescription>
                            Đăng nhập vào tài khoản của bạn để tiếp tục
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
                                label="Email"
                                type="email"
                                placeholder="Nhập email"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <Input
                                label="Mật khẩu"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Đăng nhập
                            </Button>

                            <div className="text-center text-sm space-y-2">
                                <div>
                                    <span className="text-gray-600">Chưa có tài khoản? </span>
                                    <Link href="/auth/signup" className="text-orange-600 hover:text-orange-800">
                                        Đăng ký ngay
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/auth/forgot-password" className="text-orange-600 hover:text-orange-800">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}