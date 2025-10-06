'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Calendar,
    Clock,
    MapPin,
    Truck,
    User,
    Package,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

export default function CarrierSchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewType, setViewType] = useState<'daily' | 'weekly'>('weekly');

    // Sample schedule data
    const [scheduleData] = useState([
        {
            id: 'SCH-001',
            orderId: 'ORD-2024-008',
            driver: 'Nguyễn Văn A',
            vehicle: '29A-12345',
            route: {
                from: 'TP.HCM',
                to: 'Cần Thơ',
                distance: '169 km'
            },
            cargo: 'Máy móc công nghiệp',
            date: '2024-10-05',
            timeSlots: {
                pickup: '08:00 - 10:00',
                delivery: '14:00 - 16:00'
            },
            status: 'Đã xác nhận',
            priority: 'high',
            estimatedDuration: '6 giờ',
            customer: 'Nhà máy DEF'
        },
        {
            id: 'SCH-002',
            orderId: 'ORD-2024-009',
            driver: 'Trần Văn B',
            vehicle: '43A-67890',
            route: {
                from: 'Hà Nội',
                to: 'Hải Phòng',
                distance: '102 km'
            },
            cargo: 'Vật liệu xây dựng',
            date: '2024-10-05',
            timeSlots: {
                pickup: '06:00 - 08:00',
                delivery: '10:00 - 12:00'
            },
            status: 'Chờ xác nhận',
            priority: 'medium',
            estimatedDuration: '4 giờ',
            customer: 'Công ty GHI'
        },
        {
            id: 'SCH-003',
            orderId: 'ORD-2024-010',
            driver: 'Lê Văn C',
            vehicle: '30A-11111',
            route: {
                from: 'Đà Nẵng',
                to: 'Hội An',
                distance: '32 km'
            },
            cargo: 'Thực phẩm tươi sống',
            date: '2024-10-06',
            timeSlots: {
                pickup: '05:00 - 06:00',
                delivery: '07:00 - 08:00'
            },
            status: 'Đã xác nhận',
            priority: 'high',
            estimatedDuration: '2 giờ',
            customer: 'Siêu thị XYZ'
        },
        {
            id: 'SCH-004',
            orderId: 'ORD-2024-011',
            driver: 'Nguyễn Văn A',
            vehicle: '29A-12345',
            route: {
                from: 'Cần Thơ',
                to: 'TP.HCM',
                distance: '169 km'
            },
            cargo: 'Hàng trả về',
            date: '2024-10-06',
            timeSlots: {
                pickup: '18:00 - 19:00',
                delivery: '23:00 - 00:00'
            },
            status: 'Đã xác nhận',
            priority: 'low',
            estimatedDuration: '5 giờ',
            customer: 'Nhà máy DEF'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đã xác nhận':
                return 'bg-green-100 text-green-800';
            case 'Chờ xác nhận':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đang thực hiện':
                return 'bg-blue-100 text-blue-800';
            case 'Hoàn thành':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-300';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getWeekDays = (date: Date) => {
        const week = [];
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay()); // Start from Sunday

        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const getScheduleForDate = (date: string) => {
        return scheduleData.filter(schedule => schedule.date === date);
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (viewType === 'daily') {
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        } else {
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        }
        setCurrentDate(newDate);
    };

    const ScheduleCard = ({ schedule }: { schedule: any }) => (
        <Card className={`p-4 border-l-4 ${getPriorityColor(schedule.priority)} hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-gray-900">{schedule.orderId}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{schedule.route.from} → {schedule.route.to}</span>
                    <span className="ml-auto text-gray-500">({schedule.route.distance})</span>
                </div>

                <div className="flex items-center">
                    <Truck className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{schedule.driver} • {schedule.vehicle}</span>
                </div>

                <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Lấy: {schedule.timeSlots.pickup} • Giao: {schedule.timeSlots.delivery}</span>
                </div>

                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600">{schedule.cargo}</p>
                    <p className="text-xs text-gray-500">Khách hàng: {schedule.customer}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-xs text-gray-500">
                    Ước tính: {schedule.estimatedDuration}
                </span>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                        Chi tiết
                    </Button>
                    {schedule.status === 'Chờ xác nhận' && (
                        <Button size="sm">
                            Xác nhận
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );

    const DailyView = () => {
        const dateString = currentDate.toISOString().split('T')[0];
        const todaySchedules = getScheduleForDate(dateString);

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {formatDate(currentDate)}
                </h3>

                {todaySchedules.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Không có lịch trình nào cho ngày này</p>
                        <Button className="mt-4" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm lịch trình
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {todaySchedules.map((schedule) => (
                            <ScheduleCard key={schedule.id} schedule={schedule} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const WeeklyView = () => {
        const weekDays = getWeekDays(currentDate);

        return (
            <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                    const dateString = day.toISOString().split('T')[0];
                    const daySchedules = getScheduleForDate(dateString);
                    const isToday = day.toDateString() === new Date().toDateString();

                    return (
                        <div key={index} className="space-y-2">
                            <div className={`text-center p-2 rounded ${isToday ? 'bg-orange-100 text-orange-800' : 'bg-gray-50'}`}>
                                <p className="text-xs font-medium">
                                    {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                </p>
                                <p className={`text-lg font-bold ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>
                                    {day.getDate()}
                                </p>
                            </div>

                            <div className="space-y-2 min-h-[200px]">
                                {daySchedules.map((schedule) => (
                                    <Card key={schedule.id} className={`p-3 border-l-4 ${getPriorityColor(schedule.priority)} text-xs`}>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{schedule.orderId}</span>
                                                <span className={`px-1 py-0.5 text-xs rounded ${getStatusColor(schedule.status)}`}>
                                                    {schedule.status === 'Đã xác nhận' ? '✓' : '⏳'}
                                                </span>
                                            </div>

                                            <div className="text-gray-600">
                                                <p className="truncate">{schedule.route.from} → {schedule.route.to}</p>
                                                <p>{schedule.driver}</p>
                                                <p>{schedule.timeSlots.pickup}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {daySchedules.length === 0 && (
                                    <div className="text-center text-gray-400 py-8">
                                        <Calendar className="h-6 w-6 mx-auto mb-2" />
                                        <p className="text-xs">Không có lịch</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lịch trình công việc</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Xem và quản lý lịch trình giao hàng của đội xe
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm lịch trình
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Hôm nay</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {getScheduleForDate(new Date().toISOString().split('T')[0]).length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Đã xác nhận</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {scheduleData.filter(s => s.status === 'Đã xác nhận').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Chờ xác nhận</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {scheduleData.filter(s => s.status === 'Chờ xác nhận').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Truck className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Xe hoạt động</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(scheduleData.map(s => s.vehicle)).size}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Navigation and View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateDate('prev')}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                            {viewType === 'daily'
                                ? formatDate(currentDate)
                                : `Tuần ${Math.ceil(currentDate.getDate() / 7)} - Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
                            }
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateDate('next')}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Hôm nay
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewType('daily')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewType === 'daily'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Ngày
                        </button>
                        <button
                            onClick={() => setViewType('weekly')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewType === 'weekly'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Tuần
                        </button>
                    </div>
                </div>
            </div>

            {/* Schedule Content */}
            <div className="bg-white rounded-lg">
                {viewType === 'daily' ? <DailyView /> : <WeeklyView />}
            </div>
        </div>
    );
}