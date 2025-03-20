'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Car, ChevronLeft, Home, Save, Truck, Users } from 'lucide-react'

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
import { useToast } from '@/hooks/use-toast'
import { useFireproof } from 'use-fireproof'
import { useDatabase } from '@/lib/db'

// Simple version 1 of the add vehicle page
export default function NewVehiclePage() {
  const { database, useLiveQuery } = useDatabase()
  const vehicles = useLiveQuery((doc) => doc.type, { descending: true, key: 'vehicle' }).docs
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'vehicle',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    currentMileage: 0,
    fuelType: '',
    purchaseDate: '',
    status: 'active',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'year' || id === 'currentMileage' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.vehicleId || !formData.make || !formData.model) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    // Add the vehicle
    setIsPending(true)
    const databaseEntry = {
      ...formData,
      maintenance: [],
      trips: [],
      timestamp: Date.now(),
    }
    try {
      await database.put(databaseEntry)

      toast({
        title: 'Vehicle added',
        description: 'The vehicle has been added successfully.',
      })
      router.push('/vehicles')
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add vehicle. Please try again.',
        variant: 'destructive',
      })
      console.error('Error adding vehicle:', err)
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
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/vehicles">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Add New Vehicle (v1)</h1>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <CardDescription>Enter the basic details of the vehicle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle ID*</Label>
                  <Input
                    id="vehicleId"
                    placeholder="e.g. Truck #103"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make*</Label>
                    <Input
                      id="make"
                      placeholder="e.g. Ford"
                      value={formData.make}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model*</Label>
                    <Input
                      id="model"
                      placeholder="e.g. F-150"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      placeholder="e.g. 2022"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input
                      id="licensePlate"
                      placeholder="e.g. ABC-1234"
                      value={formData.licensePlate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Input
                      id="fuelType"
                      placeholder="e.g. Petrol"
                      type="text"
                      value={formData.fuelType}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      placeholder=""
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentMileage">Current Mileage</Label>
                  <Input
                    id="currentMileage"
                    type="number"
                    placeholder="0"
                    value={formData.currentMileage}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/vehicles">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Vehicle
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
          <div></div>
        </div>
      </main>
    </div>
  )
}
