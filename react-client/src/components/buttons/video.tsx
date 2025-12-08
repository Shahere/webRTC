import { Video, VideoOff } from "lucide-react";
import { ConferenceContext, iConferenceContext } from "../../App";
import { useContext } from "react";

export default function VideoToggleButton({ muted = false }) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  function disableVideo() {
    stream?.muteVideo();
  }

  return (
    <button
      className={`
        p-3 rounded-full shadow 
        transition-all duration-200
        ${
          muted
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gray-800 hover:bg-gray-700"
        }
        text-white
      `}
      onClick={disableVideo}
    >
      {muted ? <VideoOff size={40} /> : <Video size={40} />}
    </button>
  );
}
