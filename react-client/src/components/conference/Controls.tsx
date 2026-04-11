import { useContext, useState } from "react";
import MicToggleButton from "../buttons/mic";
import VideoToggleButton from "../buttons/video";
import ParametersButton from "../buttons/cog";
import HangupButton from "../buttons/hangup";
import ShareScreen from "../buttons/shareScreen";
import { iConferenceContext, iControls } from "../../interfaces";
import { Parameters } from "./Parameters";
import { Stream } from "mitmi";
import { ConferenceContext } from "../../App";

export function Controls({
  leaveConference,
  publishScreenShare,
  unpublishScreenShare,
}: iControls) {
  const [openParameters, setOpenParameters] = useState(false);
  const [screenshareActive, setScreenshareActive] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<Stream | null>(
    null,
  );
  const { useWindowDimensions }: iConferenceContext =
    useContext(ConferenceContext);

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
      <div className="fixed z-[99] top-2 left-0 w-screen p-[2%]">
        <div
          className={`flex justify-center ${useWindowDimensions().width > 500 ? "gap-10" : "gap-5"}`}
        >
          <MicToggleButton />
          <VideoToggleButton />
          {useWindowDimensions().width > 500 && (
            <ShareScreen
              onClick={shareScreenClick}
              active={screenshareActive}
            ></ShareScreen>
          )}
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
