'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AuthLayout from '@/components/AuthLayout';
import { useFormValidation } from '@/hooks/useFormValidation';
import { PATHS, FORM_LABELS } from '@/constants';

interface SignInFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

const initialFormData: SignInFormData = {
    email: '',
    password: '',
    rememberMe: false
};

const validationRules = {
    email: { required: true, email: true },
    password: { required: true }
};

export default function CarrierSignInPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        formData,
        errors,
        isLoading,
        setIsLoading,
        setErrors,
        handleChange,
        validateForm
    } = useFormValidation<SignInFormData>(initialFormData, validationRules);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Handle successful login
            router.push(PATHS.CARRIER.DASHBOARD);

        } catch (error) {
            setErrors({ general: 'Email hoặc mật khẩu không đúng' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <AuthLayout
            title="Đăng nhập đối tác"
            subtitle="Truy cập hệ thống quản lý vận chuyển"
            isCarrier={true}
        >
            {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.general}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {FORM_LABELS.EMAIL}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="company@example.com"
                            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        {FORM_LABELS.PASSWORD}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            {FORM_LABELS.REMEMBER_ME}
                        </label>
                    </div>

                    <Link
                        href="/carrier/forgot-password"
                        className="text-sm text-orange-600 hover:text-orange-800"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Chưa có tài khoản?</span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href={PATHS.CARRIER.SIGNUP}>
                        <Button variant="outline" className="w-full">
                            Đăng ký làm đối tác vận chuyển
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    Dành cho khách hàng?{' '}
                    <Link href={PATHS.AUTH.SIGNIN} className="text-orange-600 hover:text-orange-800">
                        Đăng nhập tại đây
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}