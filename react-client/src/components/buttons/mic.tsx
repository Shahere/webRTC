import { Mic, MicOff } from "lucide-react";

export default function MicToggleButton({ muted = false }) {
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
    >
      {muted ? <MicOff size={40} /> : <Mic size={40} />}
    </button>
  );
}
