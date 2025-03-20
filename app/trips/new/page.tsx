'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Home, MapPin, Route, Truck, Users } from 'lucide-react'

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

export default function NewTripPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const sampleVehicles = useVehicles()
  const { database } = useDatabase()

  const [formData, setFormData] = useState({
    tripName: '',
    vehicleId: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: new Date().toISOString().split('T')[1],
    priority: 'normal',
    destination: '',
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
    if (!formData.tripName || !formData.vehicleId || !formData.destination) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    try {
      const dataEntry = {
        ...formData,
        type: 'trip',
        timestamp: Date.now(),
      }
      await database.put(dataEntry)

      toast({
        title: 'Trip scheduled',
        description: 'The trip has been scheduled successfully.',
      })
      router.push('/trips')
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to schedule trip. Please try again.',
        variant: 'destructive',
      })
      console.error('Error scheduling trip:', err)
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
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/trips">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Schedule Trip</h1>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Enter the basic details of the trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tripName">Trip Name*</Label>
                  <Input
                    id="tripName"
                    placeholder="e.g. Delivery to Chicago"
                    value={formData.tripName}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                  <Label htmlFor="priority">Prority*</Label>
                  <Select
                    defaultValue="normal"
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'low'}>Low</SelectItem>
                      <SelectItem value={'normal'}>Normal</SelectItem>
                      <SelectItem value={'high'}>High</SelectItem>
                      <SelectItem value={'urgent'}>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date*</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Time*</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination*</Label>
                  <Input
                    id="destination"
                    placeholder="e.g. Chicago Distribution Center"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/trips">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Schedule Trip
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
