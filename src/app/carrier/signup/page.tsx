'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Truck, Building2, Phone, Mail, Lock, User, MapPin } from 'lucide-react';

export default function CarrierSignUpPage() {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        contactPerson: '',
        address: '',
        serviceAreas: '',
        businessLicense: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Tên công ty là bắt buộc';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = 'Người liên hệ là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Handle successful registration
            alert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');

        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            <Truck className="h-12 w-12 text-orange-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">LoTraDW</h1>
                                <p className="text-sm text-orange-600 font-medium">Carrier Portal</p>
                            </div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Đăng ký làm đối tác vận chuyển
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Tham gia mạng lưới vận chuyển của chúng tôi
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Building2 className="h-5 w-5 text-orange-600 mr-2" />
                                Thông tin công ty
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên công ty *
                                    </label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="VD: Công ty TNHH Vận chuyển ABC"
                                        className={errors.companyName ? 'border-red-500' : ''}
                                    />
                                    {errors.companyName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-1">
                                        Giấy phép kinh doanh
                                    </label>
                                    <Input
                                        id="businessLicense"
                                        name="businessLicense"
                                        type="text"
                                        value={formData.businessLicense}
                                        onChange={handleChange}
                                        placeholder="Số GPKD"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ công ty
                                </label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Địa chỉ trụ sở chính"
                                />
                            </div>

                            <div>
                                <label htmlFor="serviceAreas" className="block text-sm font-medium text-gray-700 mb-1">
                                    Khu vực hoạt động
                                </label>
                                <Input
                                    id="serviceAreas"
                                    name="serviceAreas"
                                    type="text"
                                    value={formData.serviceAreas}
                                    onChange={handleChange}
                                    placeholder="VD: TP.HCM, Hà Nội, Đà Nẵng"
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <User className="h-5 w-5 text-orange-600 mr-2" />
                                Thông tin liên hệ
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                                        Người liên hệ *
                                    </label>
                                    <Input
                                        id="contactPerson"
                                        name="contactPerson"
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        placeholder="Họ và tên người đại diện"
                                        className={errors.contactPerson ? 'border-red-500' : ''}
                                    />
                                    {errors.contactPerson && (
                                        <p className="mt-1 text-sm text-red-500">{errors.contactPerson}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0123456789"
                                        className={errors.phone ? 'border-red-500' : ''}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Lock className="h-5 w-5 text-orange-600 mr-2" />
                                Thông tin tài khoản
                            </h3>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="company@example.com"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu *
                                    </label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Tối thiểu 6 ký tự"
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Xác nhận mật khẩu *
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Nhập lại mật khẩu"
                                        className={errors.confirmPassword ? 'border-red-500' : ''}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{' '}
                            <Link href="/carrier/signin" className="text-orange-600 hover:text-orange-800 font-medium">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}