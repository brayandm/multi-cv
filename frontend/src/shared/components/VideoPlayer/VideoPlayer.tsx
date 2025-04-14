import { memo, useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
};

function VideoPlayer({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Error playing video:", err);
      }
    };

    playVideo();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      preload="metadata"
      loop
      muted
      playsInline
    />
  );
}

export default memo(VideoPlayer);
