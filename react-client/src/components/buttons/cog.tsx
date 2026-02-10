import { Cog } from "lucide-react";
import { ConferenceContext } from "../../App";
import { useContext } from "react";
import { iConferenceContext } from "../../interfaces";

export interface AudioButtonParams {
  muted: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function MicToggleButton({ muted, onClick }: AudioButtonParams) {
  const { stream }: iConferenceContext = useContext(ConferenceContext);

  function onclick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (muted) {
      stream?.globalUnmuteAudio();
    } else {
      stream?.globalMuteAudio();
    }
    onClick(e);
  }
  return (
    <button
      className={`
        p-3 rounded-full shadow 
        transition-all duration-200
        text-white
      `}
      onClick={(e) => {
        onclick(e);
      }}
    >
      <Cog size={40}></Cog>
    </button>
  );
}
