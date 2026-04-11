import { Stream, DeviceManager } from "mitmi";
import { DisplayConference } from "./components/Conference";

export interface iPreviewScreen {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  joinConference: Function;
}

export interface iInConference {
  name: string;
  leaveConference: Function;
}

export interface iConferenceContext {
  stream?: Stream;
  setStream: React.Dispatch<React.SetStateAction<Stream | undefined>>;
  deviceManager?: DeviceManager;
  setDeviceManager: React.Dispatch<
    React.SetStateAction<DeviceManager | undefined>
  >;
  useWindowDimensions: Function;
}

export interface iStreamsDrawerProps {
  streams: Stream[];
  setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
}

export interface iMiniVideoProps {
  stream: Stream;
  changeMainStream: Function;
  key: Number;
}
export interface iMiniVideoPanelProps {
  stream: Stream;
  key: Number;
}

export interface iControls {
  leaveConference: Function;
  publishScreenShare: Function;
  unpublishScreenShare: Function;
}

export interface iLeaveConference {
  leaveConference: Function;
}

export interface iConferenceParameters {
  openParameters: boolean;
}

export interface iOnClick {
  onClick: Function;
}

export interface iScreenShareButton {
  onClick: Function;
  active: boolean;
}

export interface iDisplayConference {
  displayConference: DisplayConference;
  setDisplayConference: React.Dispatch<React.SetStateAction<DisplayConference>>;
}
