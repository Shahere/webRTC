import { useContext, useState } from "react";
import { iConferenceContext, ConferenceContext } from "../../App";
import MicToggleButton, { AudioButtonParams } from "../buttons/mic";
import VideoToggleButton, { VideoButtonParams } from "../buttons/video";

export function Controls() {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  function videoClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setVideoMuted((prev) => !prev);
  }

  function audioClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAudioMuted((prev) => !prev);
  }

  return (
    <div className="absolute z-[99] top-0 left-0 w-screen p-[2%]">
      <div className="flex justify-center gap-10">
        <MicToggleButton
          muted={audioMuted}
          onClick={audioClick}
        ></MicToggleButton>
        <VideoToggleButton
          muted={videoMuted}
          onClick={videoClick}
        ></VideoToggleButton>
      </div>
    </div>
  );
}
