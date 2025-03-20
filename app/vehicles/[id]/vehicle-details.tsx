'use client'

import type React from 'react'

import Link from 'next/link'
import {
  CalendarClock,
  Car,
  ChevronRight,
  Clock,
  Edit,
  Home,
  MapPin,
  Route,
  Settings,
  Truck,
  Users,
} from 'lucide-react'
import { useParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useVehicle,
  useMaintenanceByVehicle,
  useTripsByVehicle,
  getMaintenanceStatus,
  getTripStatus,
  useDatabase,
} from '@/lib/db'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import type { Maintenance, Vehicle } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicleId = params.id as string
  const { database } = useDatabase()
  const { toast } = useToast()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null)
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null)
  const [newDueDate, setNewDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const vehicle = useVehicle(vehicleId)
  const maintenanceItems = useMaintenanceByVehicle(vehicleId)
  const trips = useTripsByVehicle(vehicleId)
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false)
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(false)
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)

  const handleCompleteMaintenance = async (maintenance) => {
    try {
      await database.put({
        ...maintenance,
        status: 'completed',
        completedDate: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error completing maintenance:', error)
      toast({
        title: 'Error',
        description: 'Failed to complete maintenance. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenEditModal = () => {
    if (vehicle) {
      setEditedVehicle({ ...vehicle })
      setIsEditModalOpen(true)
    }
  }

  const handleSaveVehicle = async () => {
    if (!editedVehicle) return

    setIsSubmitting(true)
    try {
      await database.put(editedVehicle)
      setIsEditModalOpen(false)
      toast({
        title: 'Vehicle edited',
        description: 'The vehicle data has been edited successfully.',
      })
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast({
        title: 'Error',
        description: 'Failed to edit vehicle. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    if (editedVehicle) {
      setEditedVehicle({
        ...editedVehicle,
        [id]: ['year', 'currentMileage'].includes(id) ? Number(value) : value,
      })
    }
  }

  const handleStatusChange = (value: string) => {
    if (editedVehicle) {
      setEditedVehicle({
        ...editedVehicle,
        status: value as 'active' | 'in-maintenance' | 'out-of-service',
      })
    }
  }

  const handleOpenRescheduleModal = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance)
    setNewDueDate(maintenance.dueDate)
    setIsRescheduleModalOpen(true)
  }

  const handleRescheduleMaintenance = async () => {
    if (!selectedMaintenance || !newDueDate) return

    setIsSubmitting(true)
    try {
      await database.put({
        ...selectedMaintenance,
        dueDate: newDueDate,
      })
      setIsRescheduleModalOpen(false)
      toast({
        title: 'Maintenance rescheduled',
        description: 'The maintenance has been rescheduled successfully.',
      })
    } catch (error) {
      console.error('Error rescheduling maintenance:', error)
      toast({
        title: 'Error',
        description: 'Failed to reschedule maintenance. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingVehicle) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          {/* Header content */}
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="grid gap-4">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4 text-sm">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
              </CardContent>
            </Card>
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          {/* Header content */}
        </header>
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Vehicle Not Found</CardTitle>
              <CardDescription>
                The vehicle you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/vehicles">
                <Button>Return to Vehicles</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
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
          <Link
            href="/drivers"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Users className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Drivers</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleOpenEditModal}>
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Vehicle</span>
          </Button>
        </div>
      </header>
      <div className="flex items-center gap-1 border-b bg-muted/40 px-4 py-2 text-sm text-muted-foreground md:px-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/vehicles" className="hover:text-foreground">
          Vehicles
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{vehicle.vehicleId}</span>
      </div>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{vehicle.vehicleId}</h1>
              <Badge
                variant="outline"
                className={`rounded-full ${
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
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {vehicle.make} {vehicle.model} ({vehicle.year}) • License: {vehicle.licensePlate}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/maintenance/new">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Settings className="h-4 w-4" />
                <span>Schedule Maintenance</span>
              </Button>
            </Link>
            <Link href="/trips/new">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Route className="h-4 w-4" />
                <span>Schedule Trip</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Make</div>
                <div>{vehicle.make}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Model</div>
                <div>{vehicle.model}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Year</div>
                <div>{vehicle.year}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">License Plate</div>
                <div>{vehicle.licensePlate}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Current Mileage</div>
                <div>{vehicle.currentMileage?.toLocaleString()} mi</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Fuel Type</div>
                <div>{vehicle.fuelType}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Purchase Date</div>
                <div>{new Date(vehicle.purchaseDate).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="maintenance">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="trips">Trips</TabsTrigger>
              </TabsList>
              <TabsContent value="maintenance" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Maintenance</CardTitle>
                    <CardDescription>Scheduled maintenance for this vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMaintenance ? (
                      <div className="space-y-4">
                        {Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                              </div>
                              <Skeleton className="h-4 w-48 mt-1" />
                              <Skeleton className="h-4 w-64 mt-2" />
                              <div className="mt-3 flex items-center gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : maintenanceItems && maintenanceItems.length > 0 ? (
                      <div className="space-y-4">
                        {maintenanceItems
                          .filter((item) => item.status !== 'completed')
                          .sort(
                            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                          )
                          .map((item) => {
                            const status = getMaintenanceStatus(item)

                            return (
                              <div key={item._id} className="rounded-lg border p-3">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{item.maintenanceType}</div>
                                  <Badge
                                    variant="outline"
                                    className={`rounded-full ${
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
                                  </Badge>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  Due: {new Date(item.dueDate).toLocaleDateString()}
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleCompleteMaintenance(item)}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenRescheduleModal(item)}
                                  >
                                    Reschedule
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No maintenance scheduled.{' '}
                        <Link href="/maintenance/new" className="text-primary underline">
                          Schedule maintenance
                        </Link>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href="/maintenance/new" className="w-full">
                      <Button className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Schedule New Maintenance
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="trips" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Trips</CardTitle>
                    <CardDescription>Scheduled trips for this vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTrips ? (
                      <div className="space-y-4">
                        {Array(2)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                              </div>
                              <Skeleton className="h-4 w-48 mt-1" />
                              <Skeleton className="h-4 w-64 mt-2" />
                              <div className="mt-3 flex items-center gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : trips && trips.length > 0 ? (
                      <div className="space-y-4">
                        {trips
                          .filter(
                            (trip) => trip.status !== 'completed' && trip.status !== 'cancelled'
                          )
                          .sort(
                            (a, b) =>
                              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                          )
                          .map((trip) => {
                            const tripStatus = getTripStatus(trip)

                            return (
                              <div key={trip._id} className="rounded-lg border p-3">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{trip.tripName}</div>
                                  <Badge
                                    variant="outline"
                                    className={`rounded-full ${
                                      tripStatus === 'today'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {tripStatus === 'today'
                                      ? 'Today'
                                      : new Date(trip.startDate).toLocaleDateString()}
                                  </Badge>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {new Date(trip.startDate).toLocaleDateString()} • {trip.startTime}{' '}
                                  - {trip.endTime}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{trip.destination}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <Button size="sm" variant="default">
                                    {trip.status === 'scheduled' ? 'Start Trip' : 'Complete Trip'}
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Reschedule
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No trips scheduled.{' '}
                        <Link href="/trips/new" className="text-primary underline">
                          Schedule a trip
                        </Link>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href="/trips/new" className="w-full">
                      <Button className="w-full">
                        <Route className="mr-2 h-4 w-4" />
                        Schedule New Trip
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      {/* Edit Vehicle Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Make changes to the vehicle information.</DialogDescription>
          </DialogHeader>

          {editedVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle ID</Label>
                  <Input
                    id="vehicleId"
                    value={editedVehicle.vehicleId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <RadioGroup value={editedVehicle.status} onValueChange={handleStatusChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-maintenance" id="in-maintenance" />
                      <Label htmlFor="in-maintenance">In Maintenance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="out-of-service" id="out-of-service" />
                      <Label htmlFor="out-of-service">Out of Service</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" value={editedVehicle.make} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" value={editedVehicle.model} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={editedVehicle.year}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={editedVehicle.licensePlate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Input
                    id="fuelType"
                    value={editedVehicle.fuelType}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentMileage">Current Mileage</Label>
                  <Input
                    id="currentMileage"
                    type="number"
                    value={editedVehicle.currentMileage}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveVehicle} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Maintenance Modal */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Maintenance</DialogTitle>
            <DialogDescription>Select a new due date for the maintenance task.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">New Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRescheduleModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleRescheduleMaintenance} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
