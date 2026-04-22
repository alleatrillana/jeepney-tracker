import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, MapPin, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg"; // @ts-ignore

const roles = [
  {
    id: "passenger",
    label: "Passenger",
    desc: "Find the nearest jeepney and track it live",
    icon: MapPin,
    path: "/passenger",
    gradient: "from-secondary to-emerald-600",
  },
  {
    id: "driver",
    label: "Driver",
    desc: "Share your location while on a paid trip",
    icon: Bus,
    path: "/driver",
    gradient: "from-primary to-amber-500",
  },
  {
    id: "admin",
    label: "Administrator",
    desc: "Monitor fleet efficiency and safety",
    icon: Shield,
    path: "/admin",
    gradient: "from-accent to-rose-600",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-jeepney-dark/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md mx-auto px-6 py-12"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Bus className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-center text-primary mb-1">JeepTrack</h1>
        <p className="text-sm text-center text-muted-foreground mb-10">Arayat — Cabiao Route</p>

        {/* Role cards */}
        <div className="space-y-3">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => navigate(role.path)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/10 backdrop-blur-md border border-border/20 hover:bg-card/20 transition-all group text-left"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.gradient} shadow-lg shrink-0`}>
                <role.icon className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-primary">{role.label}</p>
                <p className="text-xs text-muted-foreground">{role.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </motion.button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/60 text-center mt-8">
          © 2026 JeepTrack · Real-time jeepney tracking for a better commute
        </p>
      </motion.div>
    </div>
  );
}
