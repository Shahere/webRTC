import { Stream, DeviceManager } from "mitmi";

export interface iPreviewScreen {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  joinConference: Function;
}

export interface iInConference {
  name: string;
}

export interface iConferenceContext {
  stream?: Stream;
  setStream: React.Dispatch<React.SetStateAction<Stream | undefined>>;
  deviceManager?: DeviceManager;
  setDeviceManager: React.Dispatch<
    React.SetStateAction<DeviceManager | undefined>
  >;
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
