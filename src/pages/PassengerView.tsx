import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Users, ChevronUp, Navigation } from "lucide-react";
import RouteMap from "@/components/RouteMap";
import { MOCK_DRIVERS, type JeepneyDriver } from "@/data/routeData";

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function PassengerView() {
  const [drivers] = useState(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState<JeepneyDriver | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Simulated passenger location (along the route)
  const passengerLoc: [number, number] = [15.1100, 120.8030];

  const activeDrivers = useMemo(
    () => drivers.filter(d => d.status !== "offline"),
    [drivers]
  );

  const nearest = useMemo(() => {
    if (!activeDrivers.length) return null;
    return activeDrivers.reduce((closest, d) => {
      const dist = getDistance(passengerLoc[0], passengerLoc[1], d.lat, d.lng);
      const closestDist = getDistance(passengerLoc[0], passengerLoc[1], closest.lat, closest.lng);
      return dist < closestDist ? d : closest;
    });
  }, [activeDrivers]);

  const getETA = (driver: JeepneyDriver) => {
    const dist = getDistance(passengerLoc[0], passengerLoc[1], driver.lat, driver.lng);
    if (driver.speed <= 0) return "—";
    const minutes = Math.round((dist / driver.speed) * 60);
    return `${minutes} min`;
  };

  useEffect(() => {
    if (nearest && !selectedDriver) setSelectedDriver(nearest);
  }, [nearest]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map fills the screen */}
      <RouteMap
        drivers={activeDrivers}
        passengerLocation={passengerLoc}
        selectedDriverId={selectedDriver?.id}
        onDriverClick={(d) => {
          setSelectedDriver(d);
          setPanelOpen(true);
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000]">
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl bg-card/90 backdrop-blur-lg p-3 shadow-lg border border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Navigation className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-foreground">JeepTrack</h1>
            <p className="text-xs text-muted-foreground">Arayat → Cabiao</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-sm font-bold text-secondary">{activeDrivers.length} jeepneys</p>
          </div>
        </div>
      </div>

      {/* Nearest jeepney floating card */}
      {nearest && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 z-[1000]"
        >
          <div
            className="mx-4 mb-6 rounded-2xl bg-card/95 backdrop-blur-lg shadow-2xl border border-border overflow-hidden cursor-pointer"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2">
              <motion.div animate={{ rotate: panelOpen ? 180 : 0 }}>
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>

            {/* Nearest jeepney info */}
            <div className="p-4 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Nearest Jeepney</span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground">{nearest.plateNumber}</p>
                  <p className="text-sm text-muted-foreground">{nearest.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-primary">
                      <Clock className="h-4 w-4" />
                      <span className="text-xl font-extrabold">{getETA(nearest)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">ETA</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-secondary">
                      <Users className="h-4 w-4" />
                      <span className="text-lg font-bold">{nearest.passengers}/{nearest.capacity}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">Seats</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded list */}
            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border overflow-hidden"
                >
                  <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Active Jeepneys</p>
                    {activeDrivers.map(d => (
                      <div
                        key={d.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${
                          selectedDriver?.id === d.id ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriver(d);
                        }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{d.plateNumber}</p>
                          <p className="text-xs text-muted-foreground">{d.speed} km/h</p>
                        </div>
                        <div className="flex items-center gap-1 text-primary font-bold text-sm">
                          <Clock className="h-3 w-3" />
                          {getETA(d)}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
