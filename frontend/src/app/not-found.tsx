import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white px-6">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Página no encontrada
        </h2>
        <p className="mb-6 text-white/80">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-100 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
