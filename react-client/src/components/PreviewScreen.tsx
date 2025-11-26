import { Stream } from "meetmesavinien";
import { useRef, useState } from "react";

export function PreviewScreen() {
  const localStreamRef = useRef<HTMLVideoElement>(null);
  let localStream: Stream | null = null;

  async function startLocalStream() {
    localStream = await Stream.getCamera(true, true);

    if (localStreamRef.current) {
      localStream.attachToElement(localStreamRef.current);
    }
  }

  function stopLocalStream() {
    if (localStream) {
      localStream.detachToElement();
      localStream = null;
    }
  }

  return (
    <div className="App">
      <div className="bg-black">
        <button id="startstream" onClick={startLocalStream}>
          Start stream
        </button>
        <button id="stopstream" onClick={stopLocalStream}>
          Stop stream
        </button>
        <video autoPlay ref={localStreamRef}></video>
      </div>
    </div>
  );
}
