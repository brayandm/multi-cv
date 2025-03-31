"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white mt-[-80px] pt-[80px]">
      {/* Hero Section */}
      <section className="py-28 px-6 text-center bg-white dark:bg-gray-900">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Create impactful resumes with AI
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MultiCV helps you generate personalized resumes tailored to each job
          offer. Designed for technical professionals - fast, elegant, and
          AI-assisted.
        </motion.p>
        <div className="mt-10">
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            Start for free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 text-center bg-gray-100 dark:bg-gray-950">
        <h2 className="text-4xl font-bold mb-16">
          What can you do with MultiCV?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">Smart Assistant</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get help writing your experience, achievements, and skills in a
              clear, engaging, and optimized way.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">Multiple CVs</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Manage different versions of your resume for different companies,
              industries, or technical roles.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">Instant Adaptation</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Automatically generate job-specific resumes with a single click.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-28 px-6 text-center bg-white dark:bg-gray-900">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          The Future of MultiCV
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Imagine a world where you don’t even need to create a resume. Our
          mission is to connect people and companies directly, using AI to
          structure your profile, highlight your strengths, and eliminate unfair
          filters.
        </motion.p>
        <Button
          color="secondary"
          size="lg"
          onPress={() => router.push("/register")}
        >
          I want to be part of the future
        </Button>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 text-center bg-gray-100 dark:bg-gray-950">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Start building your resume with AI
        </motion.h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-8">
          Join hundreds of professionals already using MultiCV to stand out in
          their job applications and land real opportunities.
        </p>
        <Button
          color="primary"
          size="lg"
          onPress={() => router.push("/register")}
        >
          Get started now
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-10 px-6 text-sm text-center border-t border-gray-200 dark:border-gray-800">
        <div className="mb-2">
          <a
            href="/privacy-policy.html"
            className="hover:text-black dark:hover:text-white mx-2"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-and-conditions.html"
            className="hover:text-black dark:hover:text-white mx-2"
          >
            Terms of Service
          </a>
        </div>
        <div className="mb-2">
          <a
            href="mailto:hello.multicv@gmail.com"
            className="hover:text-black dark:hover:text-white"
          >
            Contact: hello.multicv@gmail.com
          </a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} MultiCV. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
