"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const plans = [
  {
    color: "green",
    title: "Freemium Plan",
    price: "Free",
    description: "Up to 3 CVs per month.",
    bullets: ["Try before you buy!", "Limited to 3 CVs per month."],
  },
  {
    color: "blue",
    title: "Occasional Plan",
    price: "€1.99 (one-time)",
    description: "10 total CVs, no expiration.",
    bullets: [
      "Casual users who want to create a few CVs.",
      "Generate 10 personalized CVs for less than the price of a beer 🍺",
    ],
  },
  {
    color: "red",
    title: "Daily Plan 15",
    price: "€9.99 / 30 days",
    description: "15 CVs per day, for 30 days.",
    bullets: [
      "Non-cumulative daily limit.",
      "Job seekers actively applying on a regular basis.",
    ],
  },
];

export default function PricingComponent() {
  const t = useTranslations();

  return (
    <motion.section
      className="py-28 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      {...fadeInUp}
    >
      <motion.h2 className="text-4xl font-bold text-center mb-16" {...fadeInUp}>
        {t("pages.landing_page.pricing.title", {
          defaultValue: "Pricing Plans",
        })}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.title}
            className={`border-t-8 rounded-xl shadow-md p-6 bg-white dark:bg-gray-800 border-${plan.color}-500`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircleIcon className={`h-6 w-6 text-${plan.color}-500`} />
              <h3 className="text-2xl font-semibold">{plan.title}</h3>
            </div>
            <div className="text-3xl font-bold mb-2 flex items-center gap-1">
              {plan.price}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {plan.description}
            </p>
            <ul className="space-y-2 text-left text-sm text-gray-800 dark:text-gray-300">
              {plan.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <span className="text-lg mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
