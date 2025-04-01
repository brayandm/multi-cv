import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white px-6">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          {t("pages.not_found.title")}
        </h2>
        <p className="mb-6 text-white/80">{t("pages.not_found.description")}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-100 transition"
        >
          {t("pages.not_found.back")}
        </Link>
      </div>
    </div>
  );
}
