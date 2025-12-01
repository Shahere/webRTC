import { useEffect, useRef } from "react";
import { iStreamsDrawerProps } from "../Conference";
import { MiniVideo } from "./MiniVideo";
import { Stream } from "meetmesavinien";

export interface iMiniVideoProps {
  stream: Stream;
  changeMainStream: Function;
  key: Number;
}

export function StreamDrawer({ streams, setStreams }: iStreamsDrawerProps) {
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streams.length > 0 && mainVideoRef.current) {
      mainVideoRef.current.srcObject = streams[0].mediastream;
    }
  }, [streams]);

  function changeMainStream(streamId: String) {
    setStreams((prev) =>
      [...prev].sort((a, b) => {
        if (a.id === streamId) return -1;
        if (b.id === streamId) return 1;
        return 0;
      })
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black">
      <video
        ref={mainVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {streams.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-[25%] bg-black/60 backdrop-blur-sm p-2 flex gap-2 overflow-x-auto">
          {streams.slice(1).map((stream, index) => (
            <MiniVideo
              stream={stream}
              key={index}
              changeMainStream={changeMainStream}
            ></MiniVideo>
          ))}
        </div>
      )}
    </div>
  );
}
