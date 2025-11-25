import "./App.css";
import { Stream } from "meetmesavinien";
import { useRef } from "react";

function App() {
  let localStreamRef = useRef();
  let localStream = null;

  async function startLocalStream() {
    localStream = await Stream.getCamera(true, true);
    localStream.attachToElement(localStreamRef.current);
  }
  function stopLocalStream() {
    localStream.detachToElement();
    localStream = null;
  }
  return (
    <div className="App">
      <div className="content">
        <button id="startstream" onClick={startLocalStream}>
          Start stream
        </button>
        <button id="startstream" onClick={stopLocalStream}>
          Stop stream
        </button>
        <video autoPlay ref={localStreamRef}></video>
      </div>
    </div>
  );
}

export default App;
