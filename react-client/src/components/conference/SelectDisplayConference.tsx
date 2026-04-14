import { useEffect, useState } from "react";
import { iDisplayConference } from "../../interfaces";
import { DisplayConference } from "../Conference";
import { PanelTopBottomDashed, PanelBottomOpen } from "lucide-react";

export function SelectDisplayConference({
  displayConference,
  setDisplayConference,
}: iDisplayConference) {
  return (
    <div className="fixed z-[99] bottom-[3%] left-[2%]">
      <div className="flex items-center gap-2 rounded-2xl bg-muted p-1 shadow-sm">
        <ToggleButton
          active={displayConference === DisplayConference.Panel}
          onClick={() => setDisplayConference(DisplayConference.Panel)}
        >
          <PanelTopBottomDashed className="h-5 w-5" />
        </ToggleButton>

        <ToggleButton
          active={displayConference === DisplayConference.Drawer}
          onClick={() => setDisplayConference(DisplayConference.Drawer)}
        >
          <PanelBottomOpen className="h-5 w-5" />
        </ToggleButton>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors
${active ? "bg-white text-black shadow" : "text-gray-500 hover:text-white"}`}
    >
      {children}
    </button>
  );
}
