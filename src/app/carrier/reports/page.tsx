'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle,
    Truck,
    DollarSign,
    Package,
    Users,
    Fuel,
    Route
} from 'lucide-react';

export default function CarrierReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
    const [selectedReport, setSelectedReport] = useState<'overview' | 'performance' | 'financial' | 'fleet'>('overview');

    // Sample KPI data
    const [kpiData] = useState({
        totalTrips: 156,
        completedTrips: 148,
        totalDistance: 12450, // km
        delayRate: 5.5, // %
        onTimeDelivery: 94.5, // %
        fuelConsumption: 2340, // liters
        revenue: 125000000, // VND
        costs: 89000000, // VND
        profit: 36000000, // VND
        activeVehicles: 12,
        activeDrivers: 18,
        averageRating: 4.7,
        customerSatisfaction: 96.2 // %
    });

    // Sample trip data
    const [tripData] = useState([
        {
            month: 'T1',
            trips: 45,
            distance: 3200,
            revenue: 28000000,
            onTime: 92.3,
            delays: 8
        },
        {
            month: 'T2',
            trips: 52,
            distance: 3800,
            revenue: 32000000,
            onTime: 94.1,
            delays: 6
        },
        {
            month: 'T3',
            trips: 48,
            distance: 3450,
            revenue: 29500000,
            onTime: 95.8,
            delays: 4
        },
        {
            month: 'T4',
            trips: 56,
            distance: 4000,
            revenue: 35500000,
            onTime: 96.4,
            delays: 3
        }
    ]);

    // Sample vehicle performance data
    const [vehiclePerformance] = useState([
        {
            vehicle: '29A-12345',
            driver: 'Nguyễn Văn A',
            trips: 32,
            distance: 2800,
            fuelEfficiency: 8.5, // km/l
            onTimeRate: 96.9,
            rating: 4.8,
            maintenance: 2
        },
        {
            vehicle: '43A-67890',
            driver: 'Trần Văn B',
            trips: 28,
            distance: 2450,
            fuelEfficiency: 7.8,
            onTimeRate: 92.9,
            rating: 4.6,
            maintenance: 1
        },
        {
            vehicle: '30A-11111',
            driver: 'Lê Văn C',
            trips: 35,
            distance: 3100,
            fuelEfficiency: 8.2,
            onTimeRate: 97.1,
            rating: 4.9,
            maintenance: 0
        }
    ]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const KPICard = ({ title, value, unit, trend, icon: Icon, color }: {
        title: string;
        value: number | string;
        unit?: string;
        trend?: number;
        icon: any;
        color: string;
    }) => (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {typeof value === 'number' && unit === 'currency'
                            ? formatCurrency(value)
                            : typeof value === 'number' && unit !== '%'
                                ? formatNumber(value)
                                : value
                        }
                        {unit && unit !== 'currency' && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
                    </p>
                    {trend && (
                        <div className={`flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                            <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Card>
    );

    const OverviewReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Tổng số chuyến"
                    value={kpiData.totalTrips}
                    unit="chuyến"
                    trend={12.5}
                    icon={Package}
                    color="bg-blue-100 text-blue-600"
                />
                <KPICard
                    title="Tổng quãng đường"
                    value={kpiData.totalDistance}
                    unit="km"
                    trend={8.3}
                    icon={Route}
                    color="bg-green-100 text-green-600"
                />
                <KPICard
                    title="Tỷ lệ đúng hẹn"
                    value={kpiData.onTimeDelivery}
                    unit="%"
                    trend={2.1}
                    icon={CheckCircle}
                    color="bg-orange-100 text-orange-600"
                />
                <KPICard
                    title="Tỷ lệ trễ hẹn"
                    value={kpiData.delayRate}
                    unit="%"
                    trend={-1.2}
                    icon={AlertTriangle}
                    color="bg-red-100 text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng hoạt động</h3>
                    <div className="space-y-4">
                        {tripData.map((data, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{data.month}</p>
                                        <p className="text-sm text-gray-500">{data.trips} chuyến</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatCurrency(data.revenue)}</p>
                                    <p className="text-sm text-gray-500">{data.distance} km</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích hiệu suất</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Đánh giá trung bình</span>
                            <div className="flex items-center">
                                <span className="text-yellow-500 mr-1">⭐</span>
                                <span className="font-bold">{kpiData.averageRating}/5.0</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Hài lòng khách hàng</span>
                            <span className="font-bold text-green-600">{kpiData.customerSatisfaction}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tiêu thụ nhiên liệu</span>
                            <span className="font-bold">{formatNumber(kpiData.fuelConsumption)} lít</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Chi phí vận hành</span>
                            <span className="font-bold text-red-600">{formatCurrency(kpiData.costs)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-gray-600 font-medium">Lợi nhuận</span>
                            <span className="font-bold text-green-600">{formatCurrency(kpiData.profit)}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const PerformanceReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Xe hoạt động"
                    value={kpiData.activeVehicles}
                    unit="xe"
                    icon={Truck}
                    color="bg-blue-100 text-blue-600"
                />
                <KPICard
                    title="Tài xế hoạt động"
                    value={kpiData.activeDrivers}
                    unit="người"
                    icon={Users}
                    color="bg-green-100 text-green-600"
                />
                <KPICard
                    title="Hiệu suất nhiên liệu"
                    value="8.2"
                    unit="km/l"
                    trend={3.2}
                    icon={Fuel}
                    color="bg-orange-100 text-orange-600"
                />
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất từng xe</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Xe / Tài xế
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số chuyến
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quãng đường
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hiệu suất NL
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đúng hẹn
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đánh giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bảo trì
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehiclePerformance.map((vehicle) => (
                                <tr key={vehicle.vehicle} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{vehicle.vehicle}</p>
                                            <p className="text-sm text-gray-500">{vehicle.driver}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {vehicle.trips}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatNumber(vehicle.distance)} km
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {vehicle.fuelEfficiency} km/l
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${vehicle.onTimeRate >= 95
                                                ? 'bg-green-100 text-green-800'
                                                : vehicle.onTimeRate >= 90
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {vehicle.onTimeRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">⭐</span>
                                            {vehicle.rating}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {vehicle.maintenance} lần
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const FinancialReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Doanh thu"
                    value={kpiData.revenue}
                    unit="currency"
                    trend={15.2}
                    icon={DollarSign}
                    color="bg-green-100 text-green-600"
                />
                <KPICard
                    title="Chi phí"
                    value={kpiData.costs}
                    unit="currency"
                    trend={-5.8}
                    icon={TrendingDown}
                    color="bg-red-100 text-red-600"
                />
                <KPICard
                    title="Lợi nhuận"
                    value={kpiData.profit}
                    unit="currency"
                    trend={28.7}
                    icon={TrendingUp}
                    color="bg-orange-100 text-orange-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích doanh thu</h3>
                    <div className="space-y-4">
                        {tripData.map((data, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-gray-600">{data.month}</span>
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium">{formatCurrency(data.revenue)}</span>
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-600 h-2 rounded-full"
                                            style={{ width: `${(data.revenue / 40000000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cơ cấu chi phí</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Nhiên liệu</span>
                            <span className="font-medium">45.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Lương tài xế</span>
                            <span className="font-medium">28.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bảo trì</span>
                            <span className="font-medium">12.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bảo hiểm</span>
                            <span className="font-medium">8.1%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Khác</span>
                            <span className="font-medium">5.5%</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const FleetReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title="Tổng số xe"
                    value={kpiData.activeVehicles}
                    unit="xe"
                    icon={Truck}
                    color="bg-blue-100 text-blue-600"
                />
                <KPICard
                    title="Xe hoạt động"
                    value={kpiData.activeVehicles - 2}
                    unit="xe"
                    icon={CheckCircle}
                    color="bg-green-100 text-green-600"
                />
                <KPICard
                    title="Xe bảo trì"
                    value={2}
                    unit="xe"
                    icon={AlertTriangle}
                    color="bg-yellow-100 text-yellow-600"
                />
                <KPICard
                    title="Hiệu suất TB"
                    value="8.2"
                    unit="km/l"
                    icon={Fuel}
                    color="bg-orange-100 text-orange-600"
                />
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đội xe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-700 mb-3">Theo loại xe</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Xe tải nhỏ (&lt; 3.5 tấn)</span>
                                <span className="font-medium">6 xe</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Xe tải vừa (3.5-7.5 tấn)</span>
                                <span className="font-medium">4 xe</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Xe tải lớn (&gt; 7.5 tấn)</span>
                                <span className="font-medium">2 xe</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-700 mb-3">Theo năm sản xuất</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">2021-2024</span>
                                <span className="font-medium">5 xe</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">2018-2020</span>
                                <span className="font-medium">4 xe</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">&lt; 2018</span>
                                <span className="font-medium">3 xe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );

    const getCurrentReport = () => {
        switch (selectedReport) {
            case 'overview':
                return <OverviewReport />;
            case 'performance':
                return <PerformanceReport />;
            case 'financial':
                return <FinancialReport />;
            case 'fleet':
                return <FleetReport />;
            default:
                return <OverviewReport />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Báo cáo hoạt động</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Phân tích và theo dõi hiệu suất hoạt động của công ty
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                    </Button>
                    <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex space-x-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                        <option value="year">Năm này</option>
                    </select>
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setSelectedReport('overview')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedReport === 'overview'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Tổng quan
                    </button>
                    <button
                        onClick={() => setSelectedReport('performance')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedReport === 'performance'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Hiệu suất
                    </button>
                    <button
                        onClick={() => setSelectedReport('financial')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedReport === 'financial'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Tài chính
                    </button>
                    <button
                        onClick={() => setSelectedReport('fleet')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedReport === 'fleet'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Đội xe
                    </button>
                </div>
            </div>

            {/* Report Content */}
            {getCurrentReport()}
        </div>
    );
}