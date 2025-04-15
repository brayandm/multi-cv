import { memo, useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
  play?: boolean;
};

function VideoPlayer({ src, className, play }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !play) return;

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
  }, [play]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      preload="auto"
      loop
      muted
      playsInline
    />
  );
}

export default memo(VideoPlayer);
