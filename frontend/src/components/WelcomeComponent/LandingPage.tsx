"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Crea CVs efectivos con inteligencia artificial
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          MultiCV te ayuda a generar currículos personalizados según cada oferta
          de trabajo. Optimiza tus oportunidades de conseguir entrevistas.
        </p>
        <div className="mt-6">
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
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          ¿Qué puedes hacer con MultiCV?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Asistente inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Recibe ayuda para redactar tu experiencia, logros y habilidades de
              forma clara y atractiva.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Múltiples CVs</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Crea y administra diferentes versiones de tu CV para distintas
              ofertas laborales.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Enfócate en lo importante
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Genera automáticamente CVs adaptados a cada puesto sin perder
              tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* Coming soon future vision */}
      <section className="py-16 px-6 text-center bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          El futuro de MultiCV
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-6">
          En el futuro, nuestra plataforma conectará directamente empresas y
          candidatos sin necesidad de CVs, usando IA para estructurar toda la
          información de forma eficiente.
        </p>
        <Button
          color="secondary"
          size="lg"
          onPress={() => router.push("/register")}
        >
          Quiero ser parte del futuro
        </Button>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-gradient-to-t from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Empieza a crear tu CV con IA
        </h2>
        <p className="max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-6">
          Únete a cientos de profesionales que ya usan MultiCV para destacar en
          sus postulaciones.
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
