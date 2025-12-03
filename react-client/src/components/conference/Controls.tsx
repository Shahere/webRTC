import { useContext } from "react";
import { iConferenceContext, ConferenceContext } from "../../App";
import MicToggleButton from "../buttons/mic";

export function Controls() {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);
  let buttonSize = 60;

  return (
    <div className="absolute z-[99] top-0 left-0 w-screen p-[2%]">
      <div className="flex justify-center">
        <MicToggleButton muted={true}></MicToggleButton>
      </div>
    </div>
  );
}
