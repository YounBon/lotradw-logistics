'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Truck,
    Users,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    MapPin,
    Phone,
    CheckCircle,
    AlertCircle,
    Clock
} from 'lucide-react';

export default function FleetManagementPage() {
    const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers'>('vehicles');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [vehicles] = useState([
        {
            id: 'VH001',
            licensePlate: '29A-12345',
            type: 'Xe tải nhỏ',
            capacity: '2.5 tấn',
            driver: 'Nguyễn Văn A',
            status: 'Đang vận chuyển',
            location: 'TP.HCM',
            lastMaintenance: '2024-09-15',
            nextMaintenance: '2024-12-15',
            fuelType: 'Diesel',
            year: 2020
        },
        {
            id: 'VH002',
            licensePlate: '43A-67890',
            type: 'Xe tải vừa',
            capacity: '5.0 tấn',
            driver: 'Trần Văn B',
            status: 'Sẵn sàng',
            location: 'Đà Nẵng',
            lastMaintenance: '2024-08-20',
            nextMaintenance: '2024-11-20',
            fuelType: 'Diesel',
            year: 2019
        },
        {
            id: 'VH003',
            licensePlate: '30A-11111',
            type: 'Xe tải lớn',
            capacity: '10.0 tấn',
            driver: 'Lê Văn C',
            status: 'Bảo trì',
            location: 'Hà Nội',
            lastMaintenance: '2024-10-01',
            nextMaintenance: '2025-01-01',
            fuelType: 'Diesel',
            year: 2021
        }
    ]);

    const [drivers] = useState([
        {
            id: 'DR001',
            name: 'Nguyễn Văn A',
            phone: '0123456789',
            license: 'B2, C',
            experience: '8 năm',
            currentVehicle: '29A-12345',
            status: 'Đang làm việc',
            location: 'TP.HCM',
            rating: 4.8,
            totalTrips: 245,
            joinDate: '2020-03-15'
        },
        {
            id: 'DR002',
            name: 'Trần Văn B',
            phone: '0987654321',
            license: 'B2, C, D',
            experience: '12 năm',
            currentVehicle: '43A-67890',
            status: 'Nghỉ phép',
            location: 'Đà Nẵng',
            rating: 4.9,
            totalTrips: 389,
            joinDate: '2018-07-20'
        },
        {
            id: 'DR003',
            name: 'Lê Văn C',
            phone: '0369852147',
            license: 'B2, C, D, E',
            experience: '15 năm',
            currentVehicle: '30A-11111',
            status: 'Sẵn sàng',
            location: 'Hà Nội',
            rating: 4.7,
            totalTrips: 456,
            joinDate: '2017-01-10'
        }
    ]);

    const getVehicleStatusColor = (status: string) => {
        switch (status) {
            case 'Đang vận chuyển':
                return 'bg-blue-100 text-blue-800';
            case 'Sẵn sàng':
                return 'bg-green-100 text-green-800';
            case 'Bảo trì':
                return 'bg-yellow-100 text-yellow-800';
            case 'Hỏng hóc':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDriverStatusColor = (status: string) => {
        switch (status) {
            case 'Đang làm việc':
                return 'bg-blue-100 text-blue-800';
            case 'Sẵn sàng':
                return 'bg-green-100 text-green-800';
            case 'Nghỉ phép':
                return 'bg-yellow-100 text-yellow-800';
            case 'Không khả dụng':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const VehicleCard = ({ vehicle }: { vehicle: any }) => (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{vehicle.licensePlate}</h3>
                        <p className="text-sm text-gray-500">{vehicle.type}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVehicleStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Tải trọng:</span>
                    <span className="font-medium">{vehicle.capacity}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Tài xế:</span>
                    <span className="font-medium">{vehicle.driver}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Vị trí:</span>
                    <span className="font-medium flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {vehicle.location}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Bảo trì tiếp theo:</span>
                    <span className="font-medium">{vehicle.nextMaintenance}</span>
                </div>
            </div>

            <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                </Button>
                <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );

    const DriverCard = ({ driver }: { driver: any }) => (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                        <p className="text-sm text-gray-500">{driver.experience} kinh nghiệm</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDriverStatusColor(driver.status)}`}>
                    {driver.status}
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Bằng lái:</span>
                    <span className="font-medium">{driver.license}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Xe hiện tại:</span>
                    <span className="font-medium">{driver.currentVehicle}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Điện thoại:</span>
                    <span className="font-medium flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {driver.phone}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Đánh giá:</span>
                    <span className="font-medium">⭐ {driver.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Chuyến đi:</span>
                    <span className="font-medium">{driver.totalTrips} chuyến</span>
                </div>
            </div>

            <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                </Button>
                <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Đội xe</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Quản lý phương tiện và tài xế của công ty
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm mới
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Truck className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Tổng số xe</p>
                            <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Tổng tài xế</p>
                            <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-500">Sẵn sàng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {vehicles.filter(v => v.status === 'Sẵn sàng').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('vehicles')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'vehicles'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Truck className="h-4 w-4 inline mr-2" />
                        Phương tiện ({vehicles.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('drivers')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'drivers'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Users className="h-4 w-4 inline mr-2" />
                        Tài xế ({drivers.length})
                    </button>
                </nav>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder={`Tìm kiếm ${activeTab === 'vehicles' ? 'phương tiện' : 'tài xế'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                </Button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'vehicles'
                    ? vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))
                    : drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} />
                    ))
                }
            </div>
        </div>
    );
}