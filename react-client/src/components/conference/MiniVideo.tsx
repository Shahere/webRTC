import { Stream } from "mitmi";
import { useRef, useEffect } from "react";
import { iMiniVideoProps } from "./StreamDrawer";

export function MiniVideo({ stream, changeMainStream }: iMiniVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream.mediastream;
  }, [stream]);

  return (
    <video
      onClick={() => {
        changeMainStream(stream.id);
      }}
      ref={ref}
      autoPlay
      playsInline
      muted
      className="rounded-lg object-cover border border-white/30"
    />
  );
}
