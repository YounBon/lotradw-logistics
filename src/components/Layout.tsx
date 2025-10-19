'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Package,
    Calculator,
    Truck,
    History,
    User,
    Menu,
    X,
    Home,
    Star,
    MapPin,
    BarChart3,
    Calendar
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { PATHS } from '@/constants';

// Navigation configurations
type NavigationItem = {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
};

const customerNavigation: NavigationItem[] = [
    { name: 'Trang chủ', href: PATHS.HOME, icon: Home },
    { name: 'Tạo đơn hàng', href: PATHS.CUSTOMER.CREATE_ORDER, icon: Package },
    { name: 'Báo giá nhanh', href: PATHS.CUSTOMER.QUOTE, icon: Calculator },
    { name: 'Theo dõi đơn hàng', href: PATHS.CUSTOMER.TRACKING, icon: MapPin },
    { name: 'Lịch sử đơn hàng', href: PATHS.CUSTOMER.ORDERS, icon: History },
    { name: 'Đánh giá dịch vụ', href: PATHS.CUSTOMER.RATINGS, icon: Star },
    { name: 'Tài khoản', href: PATHS.CUSTOMER.PROFILE, icon: User },
];

const carrierNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: PATHS.CARRIER.DASHBOARD, icon: Home },
    { name: 'Quản lý đơn hàng', href: PATHS.CARRIER.ORDERS, icon: Package },
    { name: 'Đội xe & Tài xế', href: PATHS.CARRIER.FLEET, icon: Truck },
    { name: 'Lịch trình', href: PATHS.CARRIER.SCHEDULE, icon: Calendar },
    { name: 'Báo cáo', href: PATHS.CARRIER.REPORTS, icon: BarChart3 },
    { name: 'Hồ sơ công ty', href: PATHS.CARRIER.PROFILE, icon: User },
];

interface LayoutProps {
    children: React.ReactNode;
}

// Extract navigation item component
interface NavigationItemProps {
    item: NavigationItem;
    isActive: boolean;
    onClick?: () => void;
}

function NavigationItem({ item, isActive, onClick }: NavigationItemProps) {
    return (
        <Link
            href={item.href}
            className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
            onClick={onClick}
        >
            <item.icon
                className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
            />
            {item.name}
        </Link>
    );
}

// Extract logo component
interface LogoProps {
    isCarrierPortal: boolean;
}

function Logo({ isCarrierPortal }: LogoProps) {
    return (
        <div className="flex items-center">
            <Truck className="h-8 w-8 text-orange-600" />
            <div className="ml-2">
                <span className="text-xl font-bold text-gray-900">LoTraDW</span>
                {isCarrierPortal && (
                    <p className="text-xs text-orange-600 font-medium">Carrier Portal</p>
                )}
            </div>
        </div>
    );
}

// Extract sidebar component
interface SidebarProps {
    navigation: NavigationItem[];
    pathname: string;
    isCarrierPortal: boolean;
    onItemClick?: () => void;
}

function Sidebar({ navigation, pathname, isCarrierPortal, onItemClick }: SidebarProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-6">
                <Logo isCarrierPortal={isCarrierPortal} />
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => (
                    <NavigationItem
                        key={item.name}
                        item={item}
                        isActive={pathname === item.href}
                        onClick={onItemClick}
                    />
                ))}
            </nav>
        </div>
    );
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Don't show layout on auth pages or on the public homepage (landing page)
    const isAuthPage = pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/carrier/sign');
    if (isAuthPage) {
        return <>{children}</>;
    }

    // Determine portal type and navigation
    const isCarrierPortal = pathname.startsWith('/carrier');
    const navigation = isCarrierPortal ? carrierNavigation : customerNavigation;
    const userGreeting = isCarrierPortal ? 'Xin chào, Đối tác vận chuyển' : 'Xin chào, Khách hàng';
    const signInPath = isCarrierPortal ? PATHS.CARRIER.SIGNIN : PATHS.AUTH.SIGNIN;

    const closeSidebar = () => setSidebarOpen(false);
    const openSidebar = () => setSidebarOpen(true);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={closeSidebar}
                    />
                    <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col">
                        <div className="flex h-16 items-center justify-between px-6 bg-white">
                            <Logo isCarrierPortal={isCarrierPortal} />
                            <Button variant="ghost" size="icon" onClick={closeSidebar}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <nav className="flex-1 space-y-1 px-4 py-4 bg-white">
                            {navigation.map((item) => (
                                <NavigationItem
                                    key={item.name}
                                    item={item}
                                    isActive={pathname === item.href}
                                    onClick={closeSidebar}
                                />
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <Sidebar
                    navigation={navigation}
                    pathname={pathname}
                    isCarrierPortal={isCarrierPortal}
                />
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={openSidebar}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    <div className="flex items-center space-x-4">
                        {/* When on public site pages, show Login / Register buttons on top-right */}
                        {(!pathname.startsWith('/admin') && !pathname.startsWith('/carrier')) ? (
                            <div className="flex items-center space-x-2">
                                <Link href="/auth/signin">
                                    <Button variant="ghost" size="sm">Đăng nhập</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button size="sm">Đăng ký</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">
                                {userGreeting}
                            </div>
                        )}
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}