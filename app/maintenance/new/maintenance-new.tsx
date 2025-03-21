'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarClock, ChevronLeft, Home, Settings, Truck, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useDatabase, useVehicles } from '@/lib/db'

export default function NewMaintenancePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const { database } = useDatabase()
  const sampleVehicles = useVehicles()

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'maintenance',
    maintenanceType: '',
    dueDate: new Date().toISOString().split('T')[0],
    serviceLocation: '',
    status: 'scheduled',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }
  const handleVehicleIdChange = (value: string) => {
    const vehicle = sampleVehicles.filter((val) => val._id === value)[0]
    setFormData((prev) => ({
      ...prev,
      vehicle_id: value,
      vehicleId: vehicle.vehicleId,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.vehicleId || !formData.maintenanceType || !formData.dueDate) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    // Add the maintenance
    setIsPending(true)
    try {
      database.put(formData)
      toast({
        title: 'Maintenance scheduled',
        description: 'The maintenance has been scheduled successfully.',
      })
      router.push('/maintenance')
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to schedule maintenance. Please try again.',
        variant: 'destructive',
      })
      console.error('Error scheduling maintenance:', err)
    } finally {
      setIsPending(false)
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
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/maintenance">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Schedule Maintenance</h1>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Details</CardTitle>
                <CardDescription>Enter the details of the maintenance task</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle*</Label>
                  <Select onValueChange={(value) => handleVehicleIdChange(value)}>
                    <SelectTrigger id="vehicleId">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleVehicles.map((vehicle) => (
                        <SelectItem key={vehicle._id} value={vehicle._id}>
                          {vehicle.vehicleId} - {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceType">Maintenance Type*</Label>
                  <Select onValueChange={(value) => handleSelectChange('maintenanceType', value)}>
                    <SelectTrigger id="maintenanceType">
                      <SelectValue placeholder="Select maintenance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oil-change">Oil Change</SelectItem>
                      <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                      <SelectItem value="brake-inspection">Brake Inspection</SelectItem>
                      <SelectItem value="full-service">Full Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date*</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location*</Label>
                  <Input
                    id="serviceLocation"
                    type="text"
                    value={formData.serviceLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/maintenance">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Schedule Maintenance
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}
