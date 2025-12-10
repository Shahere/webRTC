import { Video, VideoOff } from "lucide-react";
import { ConferenceContext, iConferenceContext } from "../../App";
import React, { useContext } from "react";
export interface VideoButtonParams {
  muted: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function VideoToggleButton({
  muted,
  onClick,
}: VideoButtonParams) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  function disableVideo(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    stream?.muteVideo();
    onClick(e);
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
