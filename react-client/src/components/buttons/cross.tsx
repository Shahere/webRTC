import { X } from "lucide-react";
import { ConferenceContext } from "../../App";
import { useContext } from "react";
import { iConferenceContext } from "../../interfaces";

export interface ParametersButtonParams {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function CrossButton({ onClick }: ParametersButtonParams) {
  const { stream }: iConferenceContext = useContext(ConferenceContext);

  function onclick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onClick(e);
  }
  return (
    <button
      className={`
        p-3 rounded-full shadow 
        transition-all duration-200
        text-white
        bg-gray-800 hover:bg-gray-700
      `}
      onClick={(e) => {
        onclick(e);
      }}
    >
      <X size={40}></X>
    </button>
  );
}
