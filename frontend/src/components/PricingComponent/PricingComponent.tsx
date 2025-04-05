"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const colorMap = {
  green: "border-green-500 text-green-500",
  blue: "border-blue-500 text-blue-500",
  red: "border-red-500 text-red-500",
};

const bgGradientMap = {
  green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
  blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
};

export default function PricingComponent() {
  const t = useTranslations();

  const plans: {
    color: keyof typeof colorMap;
    title: string;
    price: string;
    description: string;
    bullets: string[];
  }[] = [
    {
      color: "green",
      title: t("pages.pricing.free_plan.title"),
      price: t("pages.pricing.free_plan.price"),
      description: t("pages.pricing.free_plan.description"),
      bullets: [
        t("pages.pricing.free_plan.features.1"),
        t("pages.pricing.free_plan.features.2"),
      ],
    },
    {
      color: "blue",
      title: t("pages.pricing.occasional_plan.title"),
      price: t("pages.pricing.occasional_plan.price"),
      description: t("pages.pricing.occasional_plan.description"),
      bullets: [
        t("pages.pricing.occasional_plan.features.1"),
        t("pages.pricing.occasional_plan.features.2"),
      ],
    },
    {
      color: "red",
      title: t("pages.pricing.daily_15_plan.title"),
      price: t("pages.pricing.daily_15_plan.price"),
      description: t("pages.pricing.daily_15_plan.description"),
      bullets: [
        t("pages.pricing.daily_15_plan.features.1"),
        t("pages.pricing.daily_15_plan.features.2"),
      ],
    },
  ];

  return (
    <motion.section
      className="py-28 px-6 bg-default-100 dark:bg-gray-900 text-gray-900 dark:text-white"
      {...fadeInUp}
    >
      <motion.h2 className="text-5xl font-bold text-center mb-16" {...fadeInUp}>
        {t("pages.pricing.title")}
      </motion.h2>

      <motion.p
        className="max-w-3xl mx-auto text-center text-2xl mb-12"
        {...fadeInUp}
        transition={{ delay: 0.3 }}
      >
        {t("pages.pricing.description")}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.title}
            className={`border-t-8 rounded-xl shadow-md p-6 bg-white dark:bg-gray-800 border-${plan.color}-500`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircleIcon
                className={`h-6 w-6 ${colorMap[plan.color].split(" ")[1]}`}
              />
              <h3 className="text-2xl font-semibold">{plan.title}</h3>
            </div>
            <div className="text-3xl font-bold mb-2 flex items-center gap-1">
              {plan.price}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {plan.description}
            </p>
            <ul className="space-y-2 text-left text-sm text-gray-800 dark:text-gray-300 mb-6">
              {plan.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <span className="text-lg mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`
                w-full font-semibold
                bg-gradient-to-r ${bgGradientMap[plan.color]}
                shadow-md hover:shadow-lg 
              `}
            >
              {t("pages.pricing.select_button")}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
