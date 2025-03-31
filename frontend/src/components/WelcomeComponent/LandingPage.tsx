"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white ">
      {/* Hero Section */}
      <motion.section
        className="mt-[-80px] pt-[200px] py-28 px-6 text-center bg-gradient-to-br from-blue-100 to-white dark:from-secondary-100 dark:to-gray-900"
        {...fadeInUp}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          {...fadeInUp}
        >
          Create impactful resumes with AI
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-xl text-gray-800 dark:text-gray-300"
          {...fadeInUp}
          transition={{ delay: 0.3 }}
        >
          MultiCV helps you generate personalized resumes tailored to each job
          offer. Built to support technical professionals with a fast and
          elegant AI-powered experience.
        </motion.p>
        <motion.div className="mt-10" {...fadeInUp} transition={{ delay: 0.5 }}>
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            Start for free
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-24 px-8 text-center bg-gray-100 dark:bg-gray-950"
        {...fadeInUp}
      >
        <motion.h2 className="text-4xl font-bold mb-16" {...fadeInUp}>
          What can you do with MultiCV?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-7xl mx-auto">
          {["Smart Assistant", "Multiple CVs", "Instant Adaptation"].map(
            (title, idx) => {
              const isComingSoon =
                title === "Multiple CVs" || title === "Instant Adaptation";

              return (
                <motion.div
                  key={title}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  {...fadeInUp}
                  transition={{ delay: 0.2 * idx }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-visible"
                >
                  {isComingSoon && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-[-10px] right-2 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-xs font-semibold text-black shadow-sm"
                    >
                      Coming soon
                    </motion.div>
                  )}
                  <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {title === "Smart Assistant" &&
                      "Get help writing your experience, achievements, and skills in a clear, engaging, and optimized way."}
                    {title === "Multiple CVs" &&
                      "Manage different versions of your resume for different companies, industries, or technical roles."}
                    {title === "Instant Adaptation" &&
                      "Automatically generate job-specific resumes with a single click."}
                  </p>
                </motion.div>
              );
            }
          )}
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
          The Future of MultiCV
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-10"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Imagine a world where you don’t even need to create a resume. Our
          mission is to connect people and companies directly, using AI to
          structure your profile, highlight your strengths, and eliminate unfair
          filters.
        </motion.p>
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Button
            color="secondary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            I want to be part of the future
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
          Start building your resume with AI
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-8"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Be part of our beta phase and help shape MultiCV. Start crafting
          smarter resumes with AI and get a head start on your job search.
        </motion.p>
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            Get started now
          </Button>
        </motion.div>
      </motion.section>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export const Footer = () => {
  return (
    <motion.footer
      className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-10 px-6 text-sm text-center border-t border-gray-200 dark:border-gray-800"
      {...fadeInUp}
    >
      <motion.div className="mb-2" {...fadeInUp}>
        <Link href="/" className="hover:text-black dark:hover:text-white mx-2">
          Main Page
        </Link>
        <a
          href="/privacy-policy"
          className="hover:text-black dark:hover:text-white mx-2"
        >
          Privacy Policy
        </a>
        <a
          href="/terms-and-conditions"
          className="hover:text-black dark:hover:text-white mx-2"
        >
          Terms of Service
        </a>
        <a
          href="/cookies-policy"
          className="hover:text-black dark:hover:text-white mx-2"
        >
          Cookies Policy
        </a>
      </motion.div>
      <motion.div className="mb-2" {...fadeInUp} transition={{ delay: 0.2 }}>
        <a
          href="mailto:hello.multicv@gmail.com"
          className="hover:text-black dark:hover:text-white"
        >
          Contact: hello.multicv@gmail.com
        </a>
      </motion.div>
      <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
        &copy; {new Date().getFullYear()} MultiCV. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};
