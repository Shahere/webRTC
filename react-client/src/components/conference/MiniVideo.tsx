import { Stream } from "meetmesavinien";
import { useRef, useEffect } from "react";
import { iMiniVideoProps } from "./StreamDrawer";

export function MiniVideo({ stream }: iMiniVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream.mediastream;
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      className="w-32 h-24 rounded-lg object-cover border border-white/30"
    />
  );
}
