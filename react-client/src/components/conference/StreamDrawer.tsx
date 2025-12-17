import { useEffect, useRef } from "react";
import { iStreamsDrawerProps } from "../Conference";
import { MiniVideo } from "./MiniVideo";
import { Stream } from "mitmi";

export interface iMiniVideoProps {
  stream: Stream;
  changeMainStream: Function;
  key: Number;
}

export function StreamDrawer({ streams, setStreams }: iStreamsDrawerProps) {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoNameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (streams.length > 0 && mainVideoRef.current) {
      streams[0]!.attachToElement(mainVideoRef.current);
    }
    if (streams.length > 0 && mainVideoNameRef.current) {
      mainVideoNameRef.current.innerHTML = streams[0].ownerName;
    }

    //Look for our localStream
    streams.forEach((stream, index) => {
      if (stream.ownerId === "") {
        stream.disableAudio();
      } else {
        stream.enableAudio();
      }
    });

    console.log(streams);
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

  function mainVideoNamePosition() {
    if (streams.length == 1) {
      return "bottom-[2%]";
    } else if (streams.length > 1) {
      return "bottom-[30%]";
    } else {
      return "";
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black">
      <video
        ref={mainVideoRef}
        autoPlay
        playsInline
        className="w-screen h-screen object-cover"
      />
      <div
        className={`absolute right-[5%] ${mainVideoNamePosition()} bottom-[30%] size-fit px-[2%] py-[1%] rounded-2xl font-bold text-xl bg-gray-800/40 backdrop-blur-[4px] z-[99]`}
      >
        <p ref={mainVideoNameRef} className="white">
          Name
        </p>
      </div>
      {/* remplacer par w-fit et centrer apres l'element*/}
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
