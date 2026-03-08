import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Calculator() {
  const cards = [
    {
      title: "Goal-based SIP (Systematic investment plan)",
      description: "Find out monthly SIP amount you need to achieve your goals",
      emoji: "💸",
      link: "/calculators/sip", // ✅ working path
    },
    {
      title: "Car Affordability",
      description: "Find out the lifetime cost of owning your favourite car",
      emoji: "🚗",
      link: "/calculators/car", // ✅ fixed this path
    },
    {
      title: "iPhone Affordability",
      description: "Find out if your dream iPhone fits your budget",
      emoji: "📱",
      link: "/calculators/iphone",
    },
    {
      title: "SWP (Systematic Withdrawal Plan)",
      description: "Estimate remaining value after monthly withdrawals",
      emoji: "📤",
      link: "/calculators/swp",
    },

  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Calculators</h1>
        <p className="text-sm text-slate-500 mt-1">Financial planning tools</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
            <Link to={card.link} className="card card-hover p-5 flex justify-between items-center gap-4 block">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{card.emoji}</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">{card.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{card.description}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-600 shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
