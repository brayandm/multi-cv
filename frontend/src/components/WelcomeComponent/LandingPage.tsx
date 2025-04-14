"use client";

import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import PricingComponent from "../PricingComponent";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import VideoPlayer from "@/shared/components/VideoPlayer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [pathname]);

  const t = useTranslations();

  return key ? (
    <div
      key={key}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white "
    >
      {/* Hero Section */}
      <motion.section
        className="pt-[200px] py-28 px-6 text-center bg-gradient-to-br from-primary-100 to-white dark:from-secondary-100 dark:to-gray-900"
        {...fadeInUp}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          {...fadeInUp}
        >
          {t("pages.landing_page.title")}
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-xl text-gray-800 dark:text-gray-300"
          {...fadeInUp}
          transition={{ delay: 0.3 }}
        >
          {t("pages.landing_page.description")}
        </motion.p>
        <motion.div className="mt-10" {...fadeInUp} transition={{ delay: 0.5 }}>
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            {t("pages.landing_page.start_free")}
          </Button>
        </motion.div>
      </motion.section>

      {/* Profile Filling Section */}
      <motion.section
        className="py-24 px-6 bg-white dark:bg-gray-900"
        {...fadeInUp}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            {...fadeInUp}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              {...fadeInUp}
            >
              {t("pages.landing_page.profile_filling.title")}
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-gray-700 dark:text-gray-300"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {t("pages.landing_page.profile_filling.description")}
            </motion.p>
            <div className="mt-6 space-y-3 flex flex-col items-center lg:items-start">
              <div className="flex flex-col gap-3">
                {[
                  t("pages.landing_page.profile_filling.features.1"),
                  t("pages.landing_page.profile_filling.features.2"),
                  t("pages.landing_page.profile_filling.features.3"),
                ].map((text, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start text-start text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                  >
                    <CheckCircleIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="ml-2">{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="w-[300px] md:w-[350] lg:w-[400px] rounded-xl overflow-hidden shadow-lg">
              <VideoPlayer
                src="/profile.webm"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-24 px-8 text-center bg-gray-50 dark:bg-gray-950"
        {...fadeInUp}
      >
        <motion.h2 className="text-4xl font-bold mb-16" {...fadeInUp}>
          {t("pages.landing_page.features.title")}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-7xl mx-auto">
          {(() => {
            const features = [
              {
                title: t("pages.landing_page.features.first.title"),
                description: t("pages.landing_page.features.first.description"),
              },
              {
                title: t("pages.landing_page.features.second.title"),
                description: t(
                  "pages.landing_page.features.second.description"
                ),
                comingSoon: false,
                nowAvailable: true,
              },
              {
                title: t("pages.landing_page.features.third.title"),
                description: t("pages.landing_page.features.third.description"),
                comingSoon: false,
                nowAvailable: true,
              },
            ];

            return features.map(
              ({ title, description, comingSoon, nowAvailable }, idx) => (
                <motion.div
                  key={title}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * idx }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-visible"
                >
                  {comingSoon && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-[-10px] right-2 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-xs font-semibold text-black shadow-sm"
                    >
                      {t("pages.landing_page.features.coming_soon")}
                    </motion.div>
                  )}
                  {nowAvailable && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-[-10px] right-2 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-xs font-semibold text-black shadow-sm"
                    >
                      {t("pages.landing_page.features.now_available")}
                    </motion.div>
                  )}
                  <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {description}
                  </p>
                </motion.div>
              )
            );
          })()}
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section
        className="py-28 px-6 text-center bg-white dark:bg-gray-900"
        {...fadeInUp}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8"
          {...fadeInUp}
        >
          {t("pages.landing_page.vision.title")}
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-10"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          {t("pages.landing_page.vision.description")}
        </motion.p>
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Button
            color="secondary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            {t("pages.landing_page.vision.start_now")}
          </Button>
        </motion.div>
      </motion.section>

      {/* Chrome Extension Section */}
      <motion.section
        className="py-24 px-6 text-center bg-gray-50 dark:bg-gray-950"
        {...fadeInUp}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          {...fadeInUp}
        >
          {t("pages.landing_page.extension.title")}
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-6"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          {t("pages.landing_page.extension.description")}
        </motion.p>
        <motion.div
          className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg mb-6"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <VideoPlayer src="/web-extension.webm" className="w-full h-full" />
        </motion.div>
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <Button
            color="secondary"
            size="lg"
            as={Link}
            href="https://chromewebstore.google.com/detail/multicv/kapghnfjdajpnejjdcklkpceliknligj"
            target="_blank"
          >
            {t("pages.landing_page.extension.install_now")}
          </Button>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-28 px-6 text-center bg-gray-50 dark:bg-gray-800"
        {...fadeInUp}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          {...fadeInUp}
        >
          {t("pages.landing_page.cta.title")}
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-8"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          {t("pages.landing_page.cta.description")}
        </motion.p>
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            {t("pages.landing_page.cta.start_now")}
          </Button>
        </motion.div>
      </motion.section>
      <PricingComponent />

      {/* Footer Section */}
      <Footer />
    </div>
  ) : (
    <></>
  );
}

export const Footer = () => {
  const t = useTranslations();

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(Math.random());
  }, []);

  return (
    <motion.footer
      key={key}
      className="bg-default-100 dark:bg-default-50 text-gray-600 dark:text-gray-400 py-10 px-6 text-sm text-center border-t border-default-200 dark:border-default-100"
      {...fadeInUp}
    >
      <motion.div className="mb-2" {...fadeInUp}>
        <Link
          href="/"
          className="hover:text-black dark:hover:text-white mx-2 whitespace-nowrap"
        >
          {t("pages.landing_page.footer.home")}
        </Link>
        <Link
          href="/pricing"
          className="hover:text-black dark:hover:text-white mx-2 whitespace-nowrap"
        >
          {t("pages.landing_page.footer.pricing")}
        </Link>
        <Link
          href="https://www.linkedin.com/company/multicv-space/"
          target="_blank"
          className="hover:text-black dark:hover:text-white mx-2 whitespace-nowrap"
        >
          {t("pages.landing_page.footer.linkedin")}
        </Link>
      </motion.div>

      <motion.div
        className="mb-2 flex flex-wrap gap-y-2 justify-center text-center"
        {...fadeInUp}
      >
        <Link
          href="/privacy-policy"
          className="hover:text-black dark:hover:text-white mx-2 whitespace-nowrap"
        >
          {t("pages.landing_page.footer.privacy_policy")}
        </Link>
        <Link
          href="/terms-and-conditions"
          className="hover:text-black dark:hover:text-white mx-2 whitespace-nowrap"
        >
          {t("pages.landing_page.footer.terms_and_conditions")}
        </Link>
        <Link
          href="/cookies-policy"
          className="hover:text-black dark:hover:text-white mx-2 whitespace-nowrap"
        >
          {t("pages.landing_page.footer.cookies_policy")}
        </Link>
      </motion.div>

      <motion.div className="mb-2" {...fadeInUp} transition={{ delay: 0.2 }}>
        <Link
          href="mailto:hello.multicv@gmail.com"
          className="hover:text-black dark:hover:text-white"
        >
          {t("pages.landing_page.footer.contact")}: hello.multicv@gmail.com
        </Link>
      </motion.div>
      <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
        &copy; {new Date().getFullYear()} MultiCV.{" "}
        {t("pages.landing_page.footer.all_rights_reserved")}.
      </motion.div>
    </motion.footer>
  );
};
