"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-28 px-6 text-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Crea CVs efectivos con inteligencia artificial
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MultiCV te ayuda a generar currículos personalizados según cada oferta
          de trabajo. Diseñado para personas técnicas, rápido, elegante y
          asistido por IA.
        </motion.p>
        <div className="mt-10">
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/register")}
          >
            Empieza gratis
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-4xl font-bold mb-16">
          ¿Qué puedes hacer con MultiCV?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">
              Asistente inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Recibe ayuda para redactar tu experiencia, logros y habilidades de
              forma clara, atractiva y optimizada.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">Múltiples CVs</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gestiona múltiples versiones de tu CV según el tipo de empresa,
              sector o rol técnico que estés buscando.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3">
              Adaptación instantánea
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Genera automáticamente versiones específicas para cada oferta con
              un solo clic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-28 px-6 text-center bg-gray-100 dark:bg-gray-800">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          El futuro de MultiCV
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Imagina un mundo donde no necesitas crear un currículum. Nuestra
          misión es conectar personas y empresas directamente, usando IA para
          estructurar tu perfil, destacar tu potencial y eliminar filtros
          injustos.
        </motion.p>
        <Button
          color="secondary"
          size="lg"
          onPress={() => router.push("/register")}
        >
          Quiero ser parte del futuro
        </Button>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 text-center bg-gradient-to-t from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Empieza a crear tu CV con IA
        </motion.h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-8">
          Únete a cientos de profesionales que ya usan MultiCV para destacar en
          sus postulaciones y acceder a oportunidades reales.
        </p>
        <Button
          color="primary"
          size="lg"
          onPress={() => router.push("/register")}
        >
          Empieza ahora
        </Button>
      </section>
    </div>
  );
}
