import { useEffect, useState } from "react";

interface IAnimatedTextProps {
  descriptions: string[];
  isCyclic?: boolean;
}

export default function AnimatedText({
  descriptions,
  isCyclic = true,
}: IAnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    if (descriptions.length <= 1) return;

    const interval = setInterval(() => {
      if (!isCyclic && currentIndex >= descriptions.length - 1) {
        return;
      }

      setPrevIndex(currentIndex);
      setCurrentIndex((prev) =>
        isCyclic ? (prev + 1) % descriptions.length : prev + 1
      );

      setTimeout(() => setPrevIndex(null), 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isCyclic, descriptions.length]);

  return (
    <div className="relative h-6 w-full overflow-hidden text-center">
      {prevIndex !== null && (
        <p
          key={`prev-${prevIndex}`}
          className="absolute w-full text-sm text-gray-600 dark:text-gray-300 slide-out"
        >
          {descriptions[prevIndex]}
        </p>
      )}
      <p
        key={`curr-${currentIndex}`}
        className="absolute w-full text-sm text-gray-600 dark:text-gray-300 slide-in"
      >
        {descriptions[currentIndex]}
      </p>
    </div>
  );
}
