'use client'

import Link from 'next/link'
import {
  CalendarClock,
  Car,
  Clock,
  Home,
  PlusCircle,
  Route,
  Settings,
  Truck,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFireproof } from 'use-fireproof'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Trip, Maintenance, Vehicle, useVehicles, useAllMaintenance, useAllTrips } from '@/lib/db'
// Helper functions
function getMaintenanceStatus(maintenance: Maintenance): 'overdue' | 'due-soon' | 'upcoming' {
  const today = new Date()
  const dueDate = new Date(maintenance.dueDate)

  // If due date is in the past, it's overdue
  if (dueDate < today) {
    return 'overdue'
  }

  // If due date is within 7 days, it's due soon
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(today.getDate() + 7)
  if (dueDate <= sevenDaysFromNow) {
    return 'due-soon'
  }

  // Otherwise, it's upcoming
  return 'upcoming'
}

function getTripStatus(trip: Trip): 'today' | 'upcoming' | 'past' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tripDate = new Date(trip.startDate)
  tripDate.setHours(0, 0, 0, 0)

  if (tripDate.getTime() === today.getTime()) {
    return 'today'
  } else if (tripDate > today) {
    return 'upcoming'
  } else {
    return 'past'
  }
}

export default function Dashboard() {
  const { database, useLiveQuery } = useFireproof('fleet-management')
  const vehicles = useVehicles()
  const maintenance = useAllMaintenance()
  const trips = useAllTrips()

  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeTrips: 0,
    maintenanceDue: 0,
    fleetUtilization: 0,
  })

  useEffect(() => {
    if (vehicles && maintenance && trips) {
      // Calculate dashboard stats
      const activeVehicles = vehicles.filter((v: Vehicle) => v.status === 'active').length
      const activeTrips = trips.filter((t: Trip) => t.status === 'in-progress').length
      const maintenanceDue = maintenance.filter(
        (m: Maintenance) =>
          getMaintenanceStatus(m) === 'overdue' || getMaintenanceStatus(m) === 'due-soon'
      ).length

      // Calculate fleet utilization (active vehicles / total vehicles)
      const fleetUtilization =
        vehicles.length > 0 ? Math.round((activeVehicles / vehicles.length) * 100) : 0

      setStats({
        totalVehicles: vehicles.length,
        activeTrips,
        maintenanceDue,
        fleetUtilization,
      })
    }
  }, [vehicles, maintenance, trips])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Truck className="h-6 w-6" />
            <span>FleetMaster</span>
          </Link>
          <Link href="/" className="text-foreground transition-colors hover:text-foreground">
            <Home className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Dashboard</span>
          </Link>
          <Link
            href="/vehicles"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Car className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Vehicles</span>
          </Link>
          <Link
            href="/trips"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Route className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Trips</span>
          </Link>
          <Link
            href="/maintenance"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Maintenance</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/vehicles/new">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Add Vehicle</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <p className="text-xs text-muted-foreground">Fleet inventory</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            </CardHeader>
            <CardContent>
              {trips.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeTrips}</div>
                  <p className="text-xs text-muted-foreground">Vehicles currently on the road</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            </CardHeader>
            <CardContent>
              {maintenance.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.maintenanceDue}</div>
                  <p className="text-xs text-muted-foreground">Within next 7 days</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.fleetUtilization}%</div>
                  <Progress value={stats.fleetUtilization} className="mt-1" />
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Tabs defaultValue="upcoming">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Clock className="mr-2 h-3.5 w-3.5" />
                  View All
                </Button>
              </div>
            </div>
            <TabsContent value="upcoming" className="mt-4">
              {trips.isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trips && trips.length > 0 ? (
                    trips
                      .filter(
                        (trip: Trip) => trip.status !== 'completed' && trip.status !== 'cancelled'
                      )
                      .sort(
                        (a: Trip, b: Trip) =>
                          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                      )
                      .slice(0, 3)
                      .map((trip: Trip, index: number) => {
                        const tripStatus = getTripStatus(trip)
                        const vehicle = vehicles?.find((v: Vehicle) => v._id === trip.vehicle_id)

                        return (
                          <Card key={trip._id || index}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle>{trip.tripName}</CardTitle>
                                <div
                                  className={`rounded px-2 py-1 text-xs font-medium ${
                                    tripStatus === 'today'
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {tripStatus === 'today'
                                    ? 'Today'
                                    : new Date(trip.startDate).toLocaleDateString()}
                                </div>
                              </div>
                              <CardDescription>
                                Vehicle: {vehicle?.vehicleId} - {vehicle?.make} {vehicle?.model}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{trip.startTime}</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button variant="outline" size="sm" className="w-full">
                                View Details
                              </Button>
                            </CardFooter>
                          </Card>
                        )
                      })
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No upcoming trips scheduled.{' '}
                      <Link href="/trips/new" className="text-primary underline">
                        Schedule a trip
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="maintenance" className="mt-4">
              {maintenance.isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm">
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {maintenance && maintenance.length > 0 ? (
                    maintenance
                      .filter((m: Maintenance) => m.status !== 'completed')
                      .sort(
                        (a: Maintenance, b: Maintenance) =>
                          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                      )
                      .slice(0, 3)
                      .map((item: Maintenance, index: number) => {
                        const status = getMaintenanceStatus(item)
                        const vehicle = vehicles?.find((v: Vehicle) => v._id === item.vehicle_id)

                        return (
                          <Card key={item._id || index}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle>{item.maintenanceType}</CardTitle>
                                <div
                                  className={`rounded px-2 py-1 text-xs font-medium ${
                                    status === 'overdue'
                                      ? 'bg-destructive/10 text-destructive'
                                      : status === 'due-soon'
                                        ? 'bg-yellow-500/10 text-yellow-500'
                                        : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {status === 'overdue'
                                    ? 'Overdue'
                                    : status === 'due-soon'
                                      ? 'Due Soon'
                                      : 'Upcoming'}
                                </div>
                              </div>
                              <CardDescription>
                                Vehicle: {vehicle?.vehicleId} - {vehicle?.make} {vehicle?.model}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                  <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button variant="outline" size="sm" className="w-full">
                                Schedule Now
                              </Button>
                            </CardFooter>
                          </Card>
                        )
                      })
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No maintenance tasks scheduled.{' '}
                      <Link href="/maintenance/new" className="text-primary underline">
                        Schedule maintenance
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="vehicles" className="mt-4">
              {vehicles.isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles && vehicles.length > 0 ? (
                    vehicles.slice(0, 3).map((vehicle: Vehicle, index: number) => (
                      <Card key={vehicle._id || index}>
                        <CardHeader className="pb-2">
                          <CardTitle>{vehicle.vehicleId}</CardTitle>
                          <CardDescription>
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span
                                className={`font-medium ${
                                  vehicle.status === 'active'
                                    ? 'text-green-500'
                                    : vehicle.status === 'in-maintenance'
                                      ? 'text-yellow-500'
                                      : 'text-red-500'
                                }`}
                              >
                                {vehicle.status === 'active'
                                  ? 'Active'
                                  : vehicle.status === 'in-maintenance'
                                    ? 'In Maintenance'
                                    : 'Out of Service'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Mileage:</span>
                              <span>{vehicle.currentMileage.toLocaleString()} mi</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Last Service:</span>
                              <span>
                                {vehicle.lastServiceDate
                                  ? new Date(vehicle.lastServiceDate).toLocaleDateString()
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Link href={`/vehicles/${vehicle._id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No vehicles found.{' '}
                      <Link href="/vehicles/new" className="text-primary underline">
                        Add a vehicle
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
