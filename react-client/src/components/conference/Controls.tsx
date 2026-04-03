import { useState } from "react";
import MicToggleButton from "../buttons/mic";
import VideoToggleButton from "../buttons/video";
import ParametersButton from "../buttons/cog";
import HangupButton from "../buttons/hangup";
import ShareScreen from "../buttons/shareScreen";
import { iControls } from "../../interfaces";
import { Parameters } from "./Parameters";
import { Stream } from "mitmi";

export function Controls({
  leaveConference,
  publishScreenShare,
  unpublishScreenShare,
}: iControls) {
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [openParameters, setOpenParameters] = useState(false);
  const [screenshareActive, setScreenshareActive] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<Stream | null>(
    null,
  );

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
    if (screenshareActive) {
      unpublishScreenShare(screenShareStream);
      setScreenshareActive(false);
    } else {
      try {
        const newScreenShare = await Stream.getScreen();
        publishScreenShare(newScreenShare);
        setScreenshareActive(true);
        setScreenShareStream(newScreenShare);
      } catch (error) {
        alert(error);
      }
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
          <ShareScreen
            onClick={shareScreenClick}
            active={screenshareActive}
          ></ShareScreen>
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
