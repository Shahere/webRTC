import { Mic, MicOff } from "lucide-react";
import { iConferenceContext, ConferenceContext } from "../../App";
import { useContext } from "react";

export interface AudioButtonParams {
  muted: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function MicToggleButton({ muted, onClick }: AudioButtonParams) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  function disableAudio(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (muted) {
      stream?.unmuteAudio();
    } else {
      stream?.muteAudio();
    }
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
        disableAudio(e);
      }}
    >
      {muted ? <MicOff size={40} /> : <Mic size={40} />}
    </button>
  );
}
