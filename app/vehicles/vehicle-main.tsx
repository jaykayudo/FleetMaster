'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car, ChevronDown, Filter, Home, PlusCircle, Search, Truck, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useVehicles } from '@/lib/db'

// Sample vehicle data
const sampleVehicles = [
  {
    id: 'vehicle_1',
    vehicleId: 'Truck #103',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    color: 'Oxford White',
    licensePlate: 'ABC-1234',
    vin: '1FTEW1EP5NFA12345',
    currentMileage: 45230,
    fuelType: 'Gasoline',
    currentLocation: 'Main Depot',
    purchaseDate: '2022-01-15',
    lastServiceDate: '2025-02-10',
    status: 'active',
  },
  {
    id: 'vehicle_2',
    vehicleId: 'Van #205',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2021,
    color: 'Silver',
    licensePlate: 'XYZ-5678',
    vin: 'WD3PE7CD5MP567890',
    currentMileage: 32450,
    fuelType: 'Diesel',
    currentLocation: 'Warehouse A',
    purchaseDate: '2021-06-10',
    lastServiceDate: '2025-03-05',
    status: 'active',
  },
  {
    id: 'vehicle_3',
    vehicleId: 'Truck #108',
    make: 'Chevrolet',
    model: 'Silverado',
    year: 2023,
    color: 'Red Hot',
    licensePlate: 'DEF-9012',
    vin: '1GCUYDED3PZ123456',
    currentMileage: 18750,
    fuelType: 'Gasoline',
    currentLocation: 'Service Center',
    purchaseDate: '2023-03-20',
    lastServiceDate: '2025-03-12',
    status: 'in-maintenance',
  },
  {
    id: 'vehicle_4',
    vehicleId: 'SUV #302',
    make: 'Toyota',
    model: 'RAV4',
    year: 2024,
    color: 'Blue',
    licensePlate: 'GHI-3456',
    vin: 'JTMRJREV7LD123456',
    currentMileage: 5280,
    fuelType: 'Hybrid',
    currentLocation: 'Main Depot',
    purchaseDate: '2024-01-05',
    lastServiceDate: null,
    status: 'active',
  },
]

export default function VehiclesPage() {
  const vehicles = useVehicles()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [sortOrder, setSortOrder] = useState('newest')

  console.log(vehicles)

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          vehicle.vehicleId.toLowerCase().includes(query) ||
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.licensePlate.toLowerCase().includes(query)
        )
      }
      return true
    })
    .filter((vehicle) => {
      // Apply status filter
      if (statusFilter.length === 0) return true
      return statusFilter.includes(vehicle.status)
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOrder) {
        case 'newest':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
        case 'oldest':
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
        case 'mileage-high':
          return b.currentMileage - a.currentMileage
        case 'mileage-low':
          return a.currentMileage - b.currentMileage
        default:
          return 0
      }
    })

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Truck className="h-6 w-6" />
            <span>FleetMaster</span>
          </Link>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            <Home className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Dashboard</span>
          </Link>
          <Link
            href="/vehicles"
            className="text-foreground transition-colors hover:text-foreground"
          >
            <Car className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Vehicles</span>
          </Link>
          <Link
            href="/trips"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden lg:inline-block">Trips</span>
          </Link>
          <Link
            href="/maintenance"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden lg:inline-block">Maintenance</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/vehicles/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Vehicle</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Vehicles</h1>
            <p className="text-muted-foreground">Manage your fleet vehicles and their details</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vehicles..."
                className="pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter.length === 0}
                  onCheckedChange={() => setStatusFilter([])}
                >
                  All Vehicles
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('active')}
                  onCheckedChange={() => toggleStatusFilter('active')}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('in-maintenance')}
                  onCheckedChange={() => toggleStatusFilter('in-maintenance')}
                >
                  In Maintenance
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('out-of-service')}
                  onCheckedChange={() => toggleStatusFilter('out-of-service')}
                >
                  Out of Service
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="newest" onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="mileage-high">Highest Mileage</SelectItem>
                <SelectItem value="mileage-low">Lowest Mileage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            // Loading skeletons
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-2 text-sm">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between text-sm">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardFooter>
                </Card>
              ))
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <Link href={`/vehicles/${vehicle._id}`} key={vehicle._id} className="block">
                <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{vehicle.vehicleId}</CardTitle>
                      <div
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          vehicle.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : vehicle.status === 'in-maintenance'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {vehicle.status === 'active'
                          ? 'Active'
                          : vehicle.status === 'in-maintenance'
                            ? 'In Maintenance'
                            : 'Out of Service'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Make/Model:</span>
                        <span>
                          {vehicle.make} {vehicle.model}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span>{vehicle.year}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">License:</span>
                        <span>{vehicle.licensePlate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Mileage:</span>
                        <span>{vehicle.currentMileage?.toLocaleString()} mi</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No vehicles found.{' '}
              {searchQuery || statusFilter.length > 0 ? (
                'Try adjusting your filters.'
              ) : (
                <Link href="/vehicles/new" className="text-primary underline">
                  Add a vehicle
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
