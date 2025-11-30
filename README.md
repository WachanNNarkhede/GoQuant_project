# 🌐 Latency Topology Visualizer

A real-time 3D visualization platform that monitors cryptocurrency exchange server latency across major cloud providers (AWS, GCP, Azure). Built with Next.js, Three.js, and modern web technologies.

![Latency Topology Visualizer](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)

## 🚀 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://your-app-name.vercel.app)

**Live Application:** https://go-quant-project.vercel.app/

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Assumptions](#-assumptions)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🌍 3D Visualization
- Interactive 3D world map with realistic Earth rendering
- Exchange server locations with color-coded markers
- Cloud provider regions with boundary visualization
- Smooth camera controls (rotate, zoom, pan)

### 📊 Real-time Monitoring
- Live latency connections with animated data streams
- Color-coded latency indicators (green < 100ms, yellow < 200ms, red > 200ms)
- Real-time performance metrics dashboard
- Automatic data updates every 10 seconds

### 🎛️ Interactive Controls
- Cloud provider filtering (AWS, GCP, Azure)
- Latency range sliders
- Search functionality for exchanges and regions
- Visualization layer toggles
- Time range selectors (1h, 24h, 7d, 30d)

### 📈 Analytics & Charts
- Historical latency trends with time-series charts
- Performance statistics (min, max, average latency)
- Real-time metrics display
- Export functionality for reports

### 🎨 User Experience
- Responsive design for all screen sizes
- Dark/Light theme toggle
- Mobile-optimized touch controls
- Professional glass-morphism UI design

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework

### 3D Visualization
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber

### State Management
- **Redux Toolkit** - Predictable state container
- **React Redux** - Official React bindings for Redux

### Data Visualization
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icons

### Utilities
- **date-fns** - Date utility library
- **clsx** - Conditional className utility
- **tailwind-merge** - Tailwind CSS class merging

### Deployment
- **Vercel** - Platform for frontend frameworks

## 🏗️ Architecture
latency-topology-visualizer/
├── app/ # Next.js App Router
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ └── providers/ # Context providers
├── components/
│ ├── 3d-map/ # 3D visualization components
│ ├── charts/ # Data visualization components
│ ├── ui/ # Reusable UI components
│ └── layout/ # Layout components
├── lib/
│ ├── redux/ # Redux store and slices
│ ├── services/ # API services and data fetching
│ └── utils/ # Utility functions
├── types/ # TypeScript type definitions
└── public/ # Static assets

text

### Key Components

- **WorldMap**: Main 3D visualization component
- **Earth**: 3D Earth rendering with realistic textures
- **ExchangeMarker**: Interactive exchange server markers
- **LatencyConnection**: Animated latency connections
- **Header**: Modern navigation with live metrics
- **ControlPanel**: Interactive filters and controls
- **PerformanceMetrics**: Real-time performance dashboard

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

bash
npm install
Run development server

bash
npm run dev
Open your browser
Navigate to http://localhost:3000

Build for Production
bash
npm run build
npm start
🛠️ Development
Available Scripts
bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
Project Structure
TypeScript: Full type safety throughout the application

Component Architecture: Modular, reusable components

State Management: Centralized Redux store with RTK

3D Integration: Optimized Three.js rendering with React Three Fiber

🌐 Deployment
Vercel Deployment
Push to GitHub

bash
git add .
git commit -m "Deploy ready"
git push origin main
Deploy to Vercel

Connect your GitHub repository to Vercel

Automatic deployments on push to main

Environment variables configured automatically

Environment Variables
Create .env.local for local development:

env
NEXT_PUBLIC_APP_URL=http://localhost:3000
📋 Assumptions
Data Sources & APIs
Primary Data: Mock data with realistic latency patterns

Real APIs: Integration with free services (Google DNS, Cloudflare)

Fallback System: Graceful degradation when APIs are unavailable

Data Enhancement: Real measurements used to calibrate mock data

Performance Considerations
3D Optimization: Limited geometry complexity for mobile devices

Data Updates: 10-second intervals to balance real-time feel and performance

Bundle Size: Code splitting and dynamic imports for heavy components

Memory Management: Proper cleanup of Three.js resources



Data Freshness: Client-side caching with periodic validation

Security: CORS-compliant API calls with proper error handling
