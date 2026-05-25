import { useEffect, useRef } from "react";
import { iStreamsDrawerProps } from "../../interfaces";
import { MiniVideoPanel } from "./MiniVideoPanel";

export function StreamPanel({ streams, setStreams }: iStreamsDrawerProps) {
  const MAX_COLS = 4;
  const MAX_ROWS = 3;
  const MAX_ITEMS = MAX_COLS * MAX_ROWS;
  const visibleStreams = streams.slice(0, MAX_ITEMS);

  useEffect(() => {
    //Look for our localStream
    streams.forEach((stream, index) => {
      if (stream.isLocal()) {
        stream.localMuteAudio();
      } else {
        stream.localUnmuteAudio();
      }
    });

    console.log(streams.length);
  }, [streams]);

  return (
    <div className="relative w-screen min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-wrap items-center justify-center">
        {visibleStreams.map((stream, index) => (
          <MiniVideoPanel key={index} stream={stream} />
        ))}
      </div>
    </div>
  );
}
