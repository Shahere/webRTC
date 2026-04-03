import { Video, VideoOff } from "lucide-react";
import { ConferenceContext } from "../../App";
import React, { useContext, useState } from "react";
import { iConferenceContext } from "../../interfaces";

export default function VideoToggleButton() {
  const [muted, setVideoMuted] = useState(false);
  const { stream }: iConferenceContext = useContext(ConferenceContext);

  function disableVideo(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (muted) {
      stream?.globalUnmuteVideo();
    } else {
      stream?.globalMuteVideo();
    }

    setVideoMuted((prev) => !prev);
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
      onClick={(e) => {
        disableVideo(e);
      }}
    >
      {muted ? <VideoOff size={40} /> : <Video size={40} />}
    </button>
  );
}
