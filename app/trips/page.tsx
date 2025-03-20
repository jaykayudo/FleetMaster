'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Car,
  Check,
  ChevronDown,
  Filter,
  Home,
  PlusCircle,
  Route,
  Search,
  Truck,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAllTrips } from '@/lib/db'

export default function TripsPage() {
  const { toast } = useToast()
  const trips = useAllTrips()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [sortOrder, setSortOrder] = useState('newest')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [editedTrip, setEditedTrip] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter and sort trips
  const filteredTrips = trips
    .filter((trip) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          trip.tripName.toLowerCase().includes(query) ||
          trip.vehicleId.toLowerCase().includes(query) ||
          trip.driverId.toLowerCase().includes(query) ||
          trip.destination.toLowerCase().includes(query)
        )
      }
      return true
    })
    .filter((trip) => {
      // Apply status filter
      if (statusFilter.length === 0) return true
      return statusFilter.includes(trip.status)
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOrder) {
        case 'newest':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case 'oldest':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case 'alphabetical':
          return a.tripName.localeCompare(b.tripName)
        default:
          return 0
      }
    })

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  // Get trip status badge color
  const getTripStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500'
      case 'in-progress':
        return 'bg-green-500/10 text-green-500'
      case 'completed':
        return 'bg-gray-500/10 text-gray-500'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // Get trip priority badge color
  const getTripPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-500/10 text-blue-500'
      case 'normal':
        return 'bg-green-500/10 text-green-500'
      case 'high':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'urgent':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // Handle card click to open modal
  const handleCardClick = (e, trip) => {
    e.preventDefault() // Prevent navigation
    setSelectedTrip(trip)
    setEditedTrip({ ...trip })
    setIsModalOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setEditedTrip((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (field, value) => {
    setEditedTrip((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle marking trip as completed
  const handleMarkCompleted = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the trip item in the local state
      const updatedTrips = trips.map((item) =>
        item.id === editedTrip.id
          ? { ...editedTrip, status: 'completed', completedDate: new Date().toISOString() }
          : item
      )

      setTrips(updatedTrips)
      setIsModalOpen(false)

      toast({
        title: 'Trip completed',
        description: 'The trip has been marked as completed.',
      })
    } catch (error) {
      console.error('Error completing trip:', error)
      toast({
        title: 'Error',
        description: 'Failed to update trip. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle starting a trip
  const handleStartTrip = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the trip item in the local state
      const updatedTrips = trips.map((item) =>
        item.id === editedTrip.id
          ? { ...editedTrip, status: 'in-progress', startedDate: new Date().toISOString() }
          : item
      )

      setTrips(updatedTrips)
      setIsModalOpen(false)

      toast({
        title: 'Trip started',
        description: 'The trip has been marked as in progress.',
      })
    } catch (error) {
      console.error('Error starting trip:', error)
      toast({
        title: 'Error',
        description: 'Failed to update trip. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle saving trip changes
  const handleSaveChanges = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the trip item in the local state
      const updatedTrips = trips.map((item) => (item.id === editedTrip.id ? editedTrip : item))

      setTrips(updatedTrips)
      setIsModalOpen(false)

      toast({
        title: 'Changes saved',
        description: 'The trip has been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating trip:', error)
      toast({
        title: 'Error',
        description: 'Failed to update trip. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
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
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Car className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Vehicles</span>
          </Link>
          <Link href="/trips" className="text-foreground transition-colors hover:text-foreground">
            <Route className="h-4 w-4 lg:hidden" />
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
          <Link href="/trips/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Schedule Trip</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trips</h1>
            <p className="text-muted-foreground">Manage your fleet trips and schedules</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search trips..."
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
                  All Trips
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('scheduled')}
                  onCheckedChange={() => toggleStatusFilter('scheduled')}
                >
                  Scheduled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('in-progress')}
                  onCheckedChange={() => toggleStatusFilter('in-progress')}
                >
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('completed')}
                  onCheckedChange={() => toggleStatusFilter('completed')}
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('cancelled')}
                  onCheckedChange={() => toggleStatusFilter('cancelled')}
                >
                  Cancelled
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
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array(6)
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
          ) : filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Card
                key={trip._id}
                className="h-full transition-all hover:border-primary hover:shadow-sm cursor-pointer"
                onClick={(e) => handleCardClick(e, trip)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{trip.tripName}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getTripStatusColor(trip.status)}`}
                    >
                      {trip.status === 'scheduled'
                        ? 'Scheduled'
                        : trip.status === 'in-progress'
                          ? 'In Progress'
                          : trip.status === 'completed'
                            ? 'Completed'
                            : 'Cancelled'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span>{trip.vehicleId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Driver:</span>
                      <span>{trip.driverId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>
                        {trip.startTime} - {trip.endTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="text-right max-w-[150px] truncate">{trip.destination}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTripPriorityColor(trip.priority)}`}
                      >
                        {trip.priority.charAt(0).toUpperCase() + trip.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                    </div>
                    {trip.status === 'scheduled' && (
                      <div className="text-blue-500">Ready to start</div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No trips found.{' '}
              {searchQuery || statusFilter.length > 0 ? (
                'Try adjusting your filters.'
              ) : (
                <Link href="/trips/new" className="text-primary underline">
                  Schedule a trip
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Trip Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              View and update trip information or change trip status.
            </DialogDescription>
          </DialogHeader>

          {editedTrip && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tripName" className="text-right">
                  Trip Name
                </Label>
                <Input
                  id="tripName"
                  value={editedTrip.tripName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleId" className="text-right">
                  Vehicle
                </Label>
                <Input
                  id="vehicleId"
                  value={editedTrip.vehicleId}
                  onChange={handleInputChange}
                  className="col-span-3"
                  disabled
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driverId" className="text-right">
                  Driver
                </Label>
                <Input
                  id="driverId"
                  value={editedTrip.driverId}
                  onChange={handleInputChange}
                  className="col-span-3"
                  disabled
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editedTrip.startDate}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={editedTrip.startTime}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={editedTrip.endTime}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">
                  Destination
                </Label>
                <Input
                  id="destination"
                  value={editedTrip.destination}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={editedTrip.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editedTrip.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={editedTrip.notes || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {editedTrip && editedTrip.status === 'scheduled' && (
                <Button
                  variant="default"
                  onClick={handleStartTrip}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Route className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Processing...' : 'Start Trip'}
                </Button>
              )}
              {editedTrip && editedTrip.status === 'in-progress' && (
                <Button
                  variant="default"
                  onClick={handleMarkCompleted}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Processing...' : 'Complete Trip'}
                </Button>
              )}
              <Button type="submit" onClick={handleSaveChanges} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
