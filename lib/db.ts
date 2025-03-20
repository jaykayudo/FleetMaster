'use client'
import { useEffect, useState } from 'react'
import { useFireproof } from 'use-fireproof'
// Data types
export interface Vehicle {
  _id?: string
  vehicleId: string
  type: 'vehicle'
  make: string
  model: string
  year: number
  licensePlate: string
  fuelType: string
  purchaseDate: string
  currentMileage?: number
  status: 'active' | 'in-maintenance' | 'out-of-service'
  maintenance?: Maintenance[]
  trips?: Trip[]
  timestamp: number
}

export interface Maintenance {
  _id?: string
  type: 'maintenance'
  vehicle_id: string // the _id field of the vehicle data
  vehicleId: string // the vehicleId field of the vehicle data
  maintenanceType: string
  dueDate: string
  description?: string
  serviceLocation: string
  status: 'scheduled' | 'completed' | 'overdue'
}

export interface Trip {
  _id?: string
  type: 'trip'
  tripName: string
  vehicle_id: string // the _id field of the vehicle data
  vehicleId: string // the vehicleId field of the vehicle data
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  destination: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  notes?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
}

// Initialize the database hook
export function useDatabase() {
  const { database, useLiveQuery, useDocument } = useFireproof('fleet-master')
  return { database, useLiveQuery, useDocument }
}

// Hooks for vehicles
export function useVehicles() {
  const { useLiveQuery } = useDatabase()
  return useLiveQuery((doc) => doc.type, { descending: true, key: 'vehicle' }).docs as Vehicle[]
}

export function useVehicle(id: string) {
  const { useDocument } = useDatabase()
  return useDocument({ _id: id }).doc as Vehicle
}

// Hooks for maintenance
export function useMaintenanceByVehicle(vehicle_id: string) {
  const { useLiveQuery } = useDatabase()
  return useLiveQuery((doc) => [doc.type, doc.vehicle_id], {
    key: ['maintenance', vehicle_id],
    descending: true,
  }).docs as Maintenance[]
}

export function useAllMaintenance() {
  const { useLiveQuery } = useDatabase()
  return useLiveQuery((doc) => doc.type, { descending: true, key: 'maintenance' })
    .docs as Maintenance[]
}

// Hooks for trips
export function useTripsByVehicle(vehicle_id: string) {
  const { useLiveQuery } = useDatabase()
  return useLiveQuery((doc) => [doc.type, doc.vehicle_id], {
    key: ['trip', vehicle_id],
    descending: true,
  }).docs as Trip[]
}

export function useAllTrips() {
  const { useLiveQuery } = useDatabase()
  return useLiveQuery((doc) => doc.type, { descending: true, key: 'trip' }).docs as Trip[]
}

// Helper function to get maintenance status
export function getMaintenanceStatus(
  maintenance: Maintenance
): 'overdue' | 'due-soon' | 'upcoming' {
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

// Helper function to get trip status based on dates
export function getTripStatus(trip: Trip): 'today' | 'upcoming' | 'past' {
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
