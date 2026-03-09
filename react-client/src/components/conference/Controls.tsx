import { useState } from "react";
import MicToggleButton from "../buttons/mic";
import VideoToggleButton from "../buttons/video";
import ParametersButton from "../buttons/cog";
import HangupButton from "../buttons/hangup";
import ShareScreen from "../buttons/shareScreen";
import { iControls } from "../../interfaces";
import { Parameters } from "./Parameters";
import { Stream } from "mitmi";

export function Controls({ leaveConference, publishScreenShare }: iControls) {
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [openParameters, setOpenParameters] = useState(false);

  function videoClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setVideoMuted((prev) => !prev);
  }

  function audioClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAudioMuted((prev) => !prev);
  }

  function parameters(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setOpenParameters((prev) => !prev);
  }

  async function shareScreenClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    try {
      const newScreenShare = await Stream.getScreen();
      publishScreenShare(newScreenShare);
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
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
          <ShareScreen onClick={shareScreenClick}></ShareScreen>
          <ParametersButton onClick={parameters}></ParametersButton>
          <HangupButton leaveConference={leaveConference}></HangupButton>
        </div>
      </div>
      <div className="relative w-screen">
        <Parameters openParameters={openParameters}></Parameters>
      </div>
    </div>
  );
}
