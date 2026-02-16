import { useState } from "react";
import MicToggleButton from "../buttons/mic";
import VideoToggleButton from "../buttons/video";
import ParametersButton from "../buttons/cog";
import HangupButton from "../buttons/hangup";
import { iControls } from "../../interfaces";

export function Controls({ leaveConference }: iControls) {
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  function videoClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setVideoMuted((prev) => !prev);
  }

  function audioClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAudioMuted((prev) => !prev);
  }

  function parameters(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    console.log("hihi");
  }

  return (
    <div className="fixed z-[99] top-0 left-0 w-screen p-[2%]">
      <div className="flex justify-center gap-10">
        <MicToggleButton
          muted={audioMuted}
          onClick={audioClick}
        ></MicToggleButton>
        <VideoToggleButton
          muted={videoMuted}
          onClick={videoClick}
        ></VideoToggleButton>
        <ParametersButton onClick={parameters}></ParametersButton>
        <HangupButton leaveConference={leaveConference}></HangupButton>
      </div>
    </div>
  );
}
