import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="relative flex flex-col items-center">
        
        {/* Animated expanding rings behind the logo */}
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
          className="absolute top-0 left-0 w-16 h-16 rounded-3xl bg-slate-200 z-0"
        />
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity, delay: 1 }}
          className="absolute top-0 left-0 w-16 h-16 rounded-3xl bg-slate-200 z-0"
        />

        {/* Floating Logo Card */}
        <motion.div 
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center relative z-10"
        >
          <Wallet size={28} className="text-slate-800" />
        </motion.div>
        
        {/* Text and animated dots */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center"
        >
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Finverse</h2>
          <div className="flex gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-slate-400"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
