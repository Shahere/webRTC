import { useContext } from "react";
import { iConferenceContext, ConferenceContext } from "../../App";
import MicToggleButton from "../buttons/mic";
import VideoToggleButton from "../buttons/video";

export function Controls() {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);
  let buttonSize = 60;

  return (
    <div className="absolute z-[99] top-0 left-0 w-screen p-[2%]">
      <div className="flex justify-center gap-10">
        <MicToggleButton muted={true}></MicToggleButton>
        <VideoToggleButton muted={true}></VideoToggleButton>
      </div>
    </div>
  );
}
