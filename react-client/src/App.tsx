import "./App.css";
import { Stream } from "meetmesavinien";
import { useRef } from "react";

function App() {
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
      <div className="content">
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

export default App;
