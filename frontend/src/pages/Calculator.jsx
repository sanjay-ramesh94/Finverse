import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/solid";

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-6 pb-24 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Finverse Calculators</h1>

      <div className="flex flex-col items-center space-y-4 w-full">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="w-full max-w-md"
          >
            <Link
              to={card.link}
              className="bg-zinc-900 rounded-2xl px-4 py-5 flex justify-between items-center hover:bg-zinc-800 transition-all shadow-lg"
            >
              <div>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-sm text-gray-400">{card.description}</p>
              </div>
              <div className="text-right flex flex-col items-end space-y-2">
                <span className="text-3xl">{card.emoji}</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black text-white text-center py-3 text-sm border-t border-zinc-800">
        Help us make our calculators smarter –{" "}
        <span className="underline cursor-pointer text-teal-400">Share your feedback</span>
      </div>
    </div>
  );
}
