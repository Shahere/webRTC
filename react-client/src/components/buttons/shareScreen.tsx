import { iScreenShareButton } from "../../interfaces";
import { MonitorUp } from "lucide-react";

export default function ShareScreen({ onClick, active }: iScreenShareButton) {
  return (
    <button
      className={`
        p-3 rounded-full shadow 
        transition-all duration-200
        ${
          active
            ? "bg-blue-500 hover:bg-red-600"
            : "bg-gray-800 hover:bg-gray-700"
        }
        `}
      onClick={(e) => {
        onClick();
      }}
    >
      <MonitorUp size={40} />
    </button>
  );
}
