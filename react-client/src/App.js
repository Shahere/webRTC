import "./App.css";
import { Stream } from "meetmesavinien";
import { useRef } from "react";

function App() {
  let localStreamRef = useRef();
  async function startLocalStream() {
    let localStream = await Stream.getCamera(true, true);
    localStream.attachToElement(localStreamRef.current);
  }
  return (
    <div className="App">
      <div className="content">
        <button id="startstream" onClick={startLocalStream}>
          Start stream
        </button>
        <video autoPlay ref={localStreamRef}></video>
      </div>
    </div>
  );
}

export default App;
