import { Stream } from "meetmesavinien";
import { useRef, useState } from "react";

export function PreviewScreen() {
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<null | Stream>(null);

  async function startLocalStream() {
    if (localStream) return;
    let localStreamPre = await Stream.getCamera(true, true);
    setLocalStream(localStreamPre);

    if (localStreamRef.current) {
      localStreamPre.attachToElement(localStreamRef.current);
    }
  }

  function stopLocalStream() {
    if (!localStream) return;
    localStream.detachToElement();
    setLocalStream(null);
  }

  return (
    <div className="text-white bg-stone-900 w-full h-screen flex justify-center items-center flex-col">
      <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Preview
      </h2>

      <div className="">
        <video
          className={`${localStream == null ? "size-0" : ""}`}
          autoPlay
          ref={localStreamRef}
        ></video>
        <div className="flex justify-center space-between mt-[5%]">
          <button
            id="startstream"
            onClick={startLocalStream}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Start stream
          </button>
          <button
            id="stopstream"
            onClick={stopLocalStream}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Stop stream
          </button>
        </div>
      </div>
    </div>
  );
}
