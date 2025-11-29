import { useEffect, useRef } from "react";
import { iStreamsDrawerProps } from "../Conference";
import { MiniVideo } from "./MiniVideo";
import { Stream } from "meetmesavinien";

export interface iMiniVideoProps {
  stream: Stream;
}

export function StreamDrawer({ streams }: iStreamsDrawerProps) {
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streams.length > 0 && mainVideoRef.current) {
      mainVideoRef.current.srcObject = streams[0].mediastream;
    }
  }, [streams]);

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={mainVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {streams.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-2 flex gap-2 overflow-x-auto">
          {streams.slice(1).map((stream, index) => (
            <MiniVideo stream={stream}></MiniVideo>
          ))}
        </div>
      )}
    </div>
  );
}
