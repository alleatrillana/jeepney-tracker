import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, MapPin, Gauge, Users, AlertTriangle } from "lucide-react";
import RouteMap from "@/components/RouteMap";
import { MOCK_DRIVERS } from "@/data/routeData";

export default function DriverView() {
  const [isOnTrip, setIsOnTrip] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentDriver = MOCK_DRIVERS[0]; // Simulated logged-in driver

  const startHold = useCallback(() => {
    setHoldProgress(0);
    let prog = 0;
    holdTimer.current = setInterval(() => {
      prog += 2;
      setHoldProgress(prog);
      if (prog >= 100) {
        if (holdTimer.current) clearInterval(holdTimer.current);
        setIsOnTrip(prev => !prev);
        setHoldProgress(0);
      }
    }, 30);
  }, []);

  const endHold = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    setHoldProgress(0);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-jeepney-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-lg font-bold text-primary">JeepTrack Driver</h1>
          <p className="text-xs text-muted-foreground">{currentDriver.plateNumber} · {currentDriver.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${isAvailable ? "text-secondary" : "text-muted-foreground"}`}>
            {isAvailable ? "Available" : "Offline"}
          </span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              isAvailable ? "bg-secondary" : "bg-muted"
            }`}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 rounded-full bg-card shadow"
              animate={{ left: isAvailable ? 24 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Mini map */}
      <div className="px-5 mb-4">
        <div className="rounded-xl overflow-hidden border border-border/20">
          <RouteMap drivers={[{ ...currentDriver, status: isOnTrip ? "active" : "offline" }]} compact />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 mb-6">
        {[
          { icon: Gauge, label: "Speed", value: isOnTrip ? `${currentDriver.speed} km/h` : "—", color: "text-primary" },
          { icon: Users, label: "Passengers", value: isOnTrip ? `${currentDriver.passengers}` : "—", color: "text-secondary" },
          { icon: MapPin, label: "Status", value: isOnTrip ? "En Route" : "Stopped", color: isOnTrip ? "text-secondary" : "text-accent" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center rounded-xl bg-muted/10 border border-border/10 p-3">
            <Icon className={`h-5 w-5 mb-1 ${color}`} />
            <span className="text-lg font-bold text-foreground">{value}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Main action button */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <AnimatePresence mode="wait">
          {!isAvailable ? (
            <motion.div
              key="offline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm text-center">Toggle availability to start accepting trips</p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Hold to {isOnTrip ? "end" : "start"} trip
              </p>

              {/* Hold button */}
              <div className="relative">
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="72" fill="none" stroke="hsl(var(--border))" strokeWidth="4" opacity="0.2" />
                  <circle
                    cx="80" cy="80" r="72"
                    fill="none"
                    stroke={isOnTrip ? "hsl(var(--accent))" : "hsl(var(--secondary))"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 72}`}
                    strokeDashoffset={`${2 * Math.PI * 72 * (1 - holdProgress / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.05s linear" }}
                  />
                </svg>

                <button
                  onMouseDown={startHold}
                  onMouseUp={endHold}
                  onMouseLeave={endHold}
                  onTouchStart={startHold}
                  onTouchEnd={endHold}
                  className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-colors shadow-2xl select-none ${
                    isOnTrip
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Power className="h-10 w-10" />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {isOnTrip ? "End Trip" : "Start Trip"}
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground max-w-[200px] text-center">
                Your location will be shared with passengers while on a trip
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
