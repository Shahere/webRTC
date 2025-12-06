import { Stream } from "mitmi";
import { useRef, useEffect } from "react";
import { iMiniVideoProps } from "./StreamDrawer";

export function MiniVideo({ stream, changeMainStream }: iMiniVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream.mediastream;
  }, [stream]);

  return (
    <div className="relative h-full w-[350px] rounded-lg border border-white/30 overflow-hidden">
      <video
        onClick={() => {
          changeMainStream(stream.id);
        }}
        ref={ref}
        autoPlay
        playsInline
        muted
        className="h-full w-auto min-w-full object-cover"
      />

      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-3 py-1 rounded-md backdrop-blur-sm">
        {stream.ownerName}
      </div>
    </div>
  );
}
