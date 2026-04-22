// Arayat to Cabiao route coordinates (approximate path along the main road)
export const ROUTE_COORDINATES: [number, number][] = [
  [15.1432, 120.7694], // Arayat town center
  [15.1380, 120.7750],
  [15.1310, 120.7820],
  [15.1250, 120.7900],
  [15.1180, 120.7960],
  [15.1100, 120.8030],
  [15.1020, 120.8110],
  [15.0950, 120.8180],
  [15.0880, 120.8250],
  [15.0800, 120.8320],
  [15.0720, 120.8400],
  [15.0650, 120.8470],
  [15.0580, 120.8530],
  [15.0510, 120.8600],
  [15.0450, 120.8670], // Cabiao town center
];

export const ROUTE_CENTER: [number, number] = [15.0940, 120.8180];
export const ROUTE_ZOOM = 13;

export interface JeepneyDriver {
  id: string;
  name: string;
  plateNumber: string;
  status: "active" | "offline" | "en-route";
  lat: number;
  lng: number;
  speed: number; // km/h
  heading: number; // degrees
  passengers: number;
  capacity: number;
  lastUpdate: Date;
}

// Simulated active drivers
export const MOCK_DRIVERS: JeepneyDriver[] = [
  {
    id: "d1",
    name: "Juan dela Cruz",
    plateNumber: "ABC-1234",
    status: "active",
    lat: 15.1350,
    lng: 120.7780,
    speed: 32,
    heading: 135,
    passengers: 12,
    capacity: 20,
    lastUpdate: new Date(),
  },
  {
    id: "d2",
    name: "Maria Santos",
    plateNumber: "XYZ-5678",
    status: "active",
    lat: 15.1050,
    lng: 120.8080,
    speed: 28,
    heading: 135,
    passengers: 8,
    capacity: 20,
    lastUpdate: new Date(),
  },
  {
    id: "d3",
    name: "Pedro Reyes",
    plateNumber: "DEF-9012",
    status: "en-route",
    lat: 15.0700,
    lng: 120.8420,
    speed: 35,
    heading: 135,
    passengers: 18,
    capacity: 20,
    lastUpdate: new Date(),
  },
  {
    id: "d4",
    name: "Ana Lim",
    plateNumber: "GHI-3456",
    status: "offline",
    lat: 15.1432,
    lng: 120.7694,
    speed: 0,
    heading: 0,
    passengers: 0,
    capacity: 20,
    lastUpdate: new Date(Date.now() - 3600000),
  },
];
