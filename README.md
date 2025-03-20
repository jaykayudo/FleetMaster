# FleetMaster - Fleet Management System

FleetMaster is a comprehensive fleet management application designed to help businesses efficiently manage their vehicles, maintenance schedules, and trips. Built with Next.js and React, it provides a responsive and intuitive interface for tracking all aspects of your fleet operations.

## Key Features

- **Vehicle Management**: Track vehicle details, status, maintenance history, and current location
- **Driver Management**: Maintain driver profiles with license information and assignment status
- **Maintenance Scheduling**: Plan and monitor maintenance tasks with due date notifications
- **Trip Planning**: Schedule and manage vehicle trips with driver assignments
- **Dashboard Analytics**: View fleet utilization, active trips, and maintenance due
- **Modal Editing**: Edit maintenance and trip details through convenient modal interfaces
- **Offline-First Architecture**: Work with your data even without an internet connection

## Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React icons
- **Data Storage**: [use-fireproof](https://use-fireproof.com/) - local-first, encrypted database for offline-first applications
- **State Management**: React Hooks and Context API

## Offline-First with use-fireproof

FleetMaster uses **use-fireproof** for data storage, providing several key advantages:

- **Offline Capability**: The app works fully offline, syncing data when connectivity returns
- **Local-First**: Data is stored locally and encrypted for privacy and security
- **Real-Time Sync**: Changes are reflected immediately with real-time updates across components
- **Zero Backend Required**: No need for a traditional backend, reducing complexity and cost
- **Conflict Resolution**: Automatically manages data conflicts during synchronization

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fleet-management.git
   cd fleet-management
   ```
2. Install the dependencies
   ```bash
   npm install --force
   ```
3. Start the application

   ```bash
   npm run dev
   ```

4. Navigate to `http://localhost:3000`
