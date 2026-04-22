import { useState } from "react";
import { motion } from "framer-motion";
import { Bus, Gauge, Users, Activity, MapPin, Search } from "lucide-react";
import RouteMap from "@/components/RouteMap";
import { MOCK_DRIVERS, type JeepneyDriver } from "@/data/routeData";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card border border-border p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function DriverRow({ driver, isSelected, onClick }: { driver: JeepneyDriver; isSelected: boolean; onClick: () => void }) {
  const statusColors = {
    active: "bg-secondary",
    "en-route": "bg-primary",
    offline: "bg-muted",
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
        isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
      }`}
    >
      <div className={`h-2.5 w-2.5 rounded-full ${statusColors[driver.status]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{driver.name}</p>
        <p className="text-xs text-muted-foreground">{driver.plateNumber}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{driver.speed} km/h</p>
        <p className="text-xs text-muted-foreground">{driver.passengers}/{driver.capacity} pax</p>
      </div>
      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
        driver.status === "active" ? "bg-secondary/20 text-secondary" :
        driver.status === "en-route" ? "bg-primary/20 text-primary" :
        "bg-muted text-muted-foreground"
      }`}>
        {driver.status}
      </span>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [drivers] = useState(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState<JeepneyDriver | null>(null);
  const [search, setSearch] = useState("");

  const activeCount = drivers.filter(d => d.status !== "offline").length;
  const totalPassengers = drivers.reduce((sum, d) => sum + d.passengers, 0);
  const avgSpeed = Math.round(
    drivers.filter(d => d.status !== "offline").reduce((sum, d) => sum + d.speed, 0) / (activeCount || 1)
  );

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.plateNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Sidebar */}
      <div className="w-full lg:w-[420px] flex flex-col border-r border-border overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Bus className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">JeepTrack Admin</h1>
              <p className="text-xs text-muted-foreground">Arayat–Cabiao Fleet Monitor</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={Activity} label="Active" value={String(activeCount)} color="bg-secondary" />
            <StatCard icon={Users} label="Passengers" value={String(totalPassengers)} color="bg-primary" />
            <StatCard icon={Gauge} label="Avg Speed" value={`${avgSpeed}`} color="bg-accent" />
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search driver or plate..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Driver list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map(driver => (
            <DriverRow
              key={driver.id}
              driver={driver}
              isSelected={selectedDriver?.id === driver.id}
              onClick={() => setSelectedDriver(driver)}
            />
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-[300px]">
        <RouteMap
          drivers={drivers}
          selectedDriverId={selectedDriver?.id}
          onDriverClick={setSelectedDriver}
        />

        {/* Selected driver overlay */}
        {selectedDriver && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-80 z-[1000] rounded-xl bg-card/95 backdrop-blur-lg border border-border shadow-2xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-foreground">{selectedDriver.name}</p>
                <p className="text-xs text-muted-foreground">{selectedDriver.plateNumber}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                selectedDriver.status === "active" ? "bg-secondary/20 text-secondary" :
                selectedDriver.status === "en-route" ? "bg-primary/20 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {selectedDriver.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">{selectedDriver.speed}</p>
                <p className="text-[10px] text-muted-foreground">km/h</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{selectedDriver.passengers}/{selectedDriver.capacity}</p>
                <p className="text-[10px] text-muted-foreground">passengers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{selectedDriver.heading}°</p>
                <p className="text-[10px] text-muted-foreground">heading</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
