import { useContext } from "react";
import { iConferenceContext, ConferenceContext } from "../../App";

export function Controls() {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  return (
    <div className="absolute">
      <div className="flex"></div>
    </div>
  );
}
