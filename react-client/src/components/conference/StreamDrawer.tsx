import { useEffect, useRef, useState } from "react";
import { iStreamsDrawerProps } from "../../interfaces";
import { MiniVideo } from "./MiniVideo";

export function StreamDrawer({ streams, setStreams }: iStreamsDrawerProps) {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoNameRef = useRef<HTMLParagraphElement>(null);
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    if (streams.length > 0 && mainVideoRef.current) {
      streams[0]!.attachToElement(mainVideoRef.current);
    }
    if (streams.length > 0 && mainVideoNameRef.current) {
      mainVideoNameRef.current.innerHTML = streams[0].ownerName;
    }

    //Look for our localStream
    streams.forEach((stream, index) => {
      if (stream.isLocal()) {
        stream.localMuteAudio();
      } else {
        stream.localUnmuteAudio();
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
      }),
    );
  }

  function mainVideoNamePosition() {
    if (streams.length === 1) {
      return "bottom-[2%]";
    } else if (streams.length > 1) {
      return "bottom-[30%]";
    } else {
      return "";
    }
  }

  function changeDrawerVisibility() {
    console.log("CHANGE DRAWER");
    setIsShow((old) => !old);
  }

  return (
    <div className="relative w-screen h-screen bg-black">
      <div className="flex justify-center h-full w-full">
        <video ref={mainVideoRef} autoPlay playsInline />
      </div>
      <div
        className={`absolute right-[10%] ${mainVideoNamePosition()} size-fit px-[2%] py-[1%] rounded-2xl font-bold text-xl bg-gray-800/40 backdrop-blur-[4px] z-[99]`}
      >
        <p ref={mainVideoNameRef} className="white">
          Name
        </p>
      </div>
      {streams.length > 1 && (
        <div
          className={`absolute left-0 w-full h-[25%] ${isShow ? "bottom-0" : "-bottom-[25%]"} transition-all`}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-10 ">
            <div
              className="relative backdrop-blur rounded-t-full bg-black/60 w-28 h-8 hover:bg-white/20"
              onClick={() => changeDrawerVisibility()}
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/50" />
            </div>
          </div>

          <div className="w-full h-full backdrop-blur-sm p-2 flex gap-2 overflow-x-auto bg-black/60">
            {streams.slice(1).map((stream, index) => (
              <MiniVideo
                stream={stream}
                key={index}
                changeMainStream={changeMainStream}
              ></MiniVideo>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
