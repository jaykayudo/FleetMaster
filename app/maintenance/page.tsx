'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CalendarClock,
  Car,
  Check,
  ChevronDown,
  Filter,
  Home,
  PlusCircle,
  Search,
  Settings,
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
import { useAllMaintenance } from '@/lib/db'

export default function MaintenancePage() {
  const { toast } = useToast()
  const maintenance = useAllMaintenance()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [sortOrder, setSortOrder] = useState('due-soon')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [editedMaintenance, setEditedMaintenance] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter and sort maintenance
  const filteredMaintenance = maintenance
    .filter((item) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.vehicleId.toLowerCase().includes(query) ||
          item.maintenanceType.toLowerCase().includes(query) ||
          item.serviceLocation.toLowerCase().includes(query)
        )
      }
      return true
    })
    .filter((item) => {
      // Apply status filter
      if (statusFilter.length === 0) return true
      return statusFilter.includes(item.status)
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOrder) {
        case 'due-soon':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'due-later':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        case 'alphabetical':
          return a.maintenanceType.localeCompare(b.maintenanceType)
        default:
          return 0
      }
    })

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  // Get maintenance status badge color
  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500'
      case 'overdue':
        return 'bg-red-500/10 text-red-500'
      case 'completed':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // Get maintenance status based on due date
  const getMaintenanceStatus = (item) => {
    if (item.status === 'completed') return 'completed'

    const today = new Date()
    const dueDate = new Date(item.dueDate)

    // If due date is in the past, it's overdue
    if (dueDate < today) return 'overdue'

    // If due date is within 7 days, it's due soon
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)
    if (dueDate <= sevenDaysFromNow) return 'due-soon'

    // Otherwise, it's upcoming
    return 'upcoming'
  }

  // Handle card click to open modal
  const handleCardClick = (e, item) => {
    e.preventDefault() // Prevent navigation
    setSelectedMaintenance(item)
    setEditedMaintenance({ ...item })
    setIsModalOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setEditedMaintenance((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (field, value) => {
    setEditedMaintenance((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle marking maintenance as completed
  const handleMarkCompleted = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the maintenance item in the local state
      const updatedMaintenance = maintenance.map((item) =>
        item.id === editedMaintenance.id
          ? { ...editedMaintenance, status: 'completed', completedDate: new Date().toISOString() }
          : item
      )

      setMaintenance(updatedMaintenance)
      setIsModalOpen(false)

      toast({
        title: 'Maintenance completed',
        description: 'The maintenance has been marked as completed.',
      })
    } catch (error) {
      console.error('Error completing maintenance:', error)
      toast({
        title: 'Error',
        description: 'Failed to update maintenance. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle saving maintenance changes
  const handleSaveChanges = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the maintenance item in the local state
      const updatedMaintenance = maintenance.map((item) =>
        item.id === editedMaintenance.id ? editedMaintenance : item
      )

      setMaintenance(updatedMaintenance)
      setIsModalOpen(false)

      toast({
        title: 'Changes saved',
        description: 'The maintenance has been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating maintenance:', error)
      toast({
        title: 'Error',
        description: 'Failed to update maintenance. Please try again.',
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
          <Link
            href="/trips"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden lg:inline-block">Trips</span>
          </Link>
          <Link
            href="/maintenance"
            className="text-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline-block">Maintenance</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/maintenance/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Schedule Maintenance</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Maintenance</h1>
            <p className="text-muted-foreground">Manage your fleet maintenance schedule</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search maintenance..."
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
                  All Maintenance
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('scheduled')}
                  onCheckedChange={() => toggleStatusFilter('scheduled')}
                >
                  Scheduled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('overdue')}
                  onCheckedChange={() => toggleStatusFilter('overdue')}
                >
                  Overdue
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('completed')}
                  onCheckedChange={() => toggleStatusFilter('completed')}
                >
                  Completed
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="due-soon" onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due-soon">Due Soon</SelectItem>
                <SelectItem value="due-later">Due Later</SelectItem>
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
                      {Array(3)
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
          ) : filteredMaintenance.length > 0 ? (
            filteredMaintenance.map((item) => {
              const displayStatus = getMaintenanceStatus(item)

              return (
                <Card
                  key={item._id}
                  className="h-full transition-all hover:border-primary hover:shadow-sm cursor-pointer"
                  onClick={(e) => handleCardClick(e, item)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{item.maintenanceType}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getMaintenanceStatusColor(item.status)}`}
                      >
                        {item.status === 'scheduled'
                          ? displayStatus === 'overdue'
                            ? 'Overdue'
                            : displayStatus === 'due-soon'
                              ? 'Due Soon'
                              : 'Scheduled'
                          : item.status === 'completed'
                            ? 'Completed'
                            : 'Overdue'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Vehicle:</span>
                        <span>{item.vehicleId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-right max-w-[150px] truncate">
                          {item.serviceLocation}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                      {displayStatus === 'overdue' && (
                        <div className="text-red-500">Action required</div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No maintenance tasks found.{' '}
              {searchQuery || statusFilter.length > 0 ? (
                'Try adjusting your filters.'
              ) : (
                <Link href="/maintenance/new" className="text-primary underline">
                  Schedule maintenance
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Maintenance Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Maintenance Details</DialogTitle>
            <DialogDescription>
              View and update maintenance information or mark as completed.
            </DialogDescription>
          </DialogHeader>

          {editedMaintenance && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenanceType" className="text-right">
                  Type
                </Label>
                <Input
                  id="maintenanceType"
                  value={editedMaintenance.maintenanceType}
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
                  value={editedMaintenance.vehicleId}
                  onChange={handleInputChange}
                  className="col-span-3"
                  disabled
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editedMaintenance.dueDate}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceLocation" className="text-right">
                  Location
                </Label>
                <Input
                  id="serviceLocation"
                  value={editedMaintenance.serviceLocation}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editedMaintenance.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={editedMaintenance.notes || ''}
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
              {editedMaintenance && editedMaintenance.status !== 'completed' && (
                <Button
                  variant="default"
                  onClick={handleMarkCompleted}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Processing...' : 'Mark Completed'}
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
