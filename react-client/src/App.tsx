import { createContext, JSX, useState, useEffect } from "react";
import "./App.css";
import { PreviewScreen } from "./components/PreviewScreen";
import { InConference } from "./components/Conference";
import { DeviceManager, Stream } from "mitmi";
import { iConferenceContext } from "./interfaces";

enum States {
  Configuration,
  Conference,
  End,
}

// Un moyen pour mettre stream sans undefined ?

export const ConferenceContext = createContext<iConferenceContext>({
  stream: undefined,
  setStream: () => {},
  deviceManager: undefined,
  setDeviceManager: () => {},
});

function App() {
  const [currentState, setCurrentState] = useState<States>(
    States.Configuration
  );
  const [stream, setStream] = useState<Stream>();
  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
  const [name, setName] = useState<string>("");
  const value: iConferenceContext = {
    stream,
    setStream,
    deviceManager,
    setDeviceManager,
  };

  useEffect(() => {
    document.title = "Mitmi website";
  }, []);

  function joinConference() {
    setCurrentState(States.Conference);
  }

  function showStates(): JSX.Element {
    switch (currentState) {
      case States.Configuration:
        return (
          <PreviewScreen
            name={name}
            setName={setName}
            joinConference={joinConference}
          ></PreviewScreen>
        );
      case States.Conference:
        return <InConference name={name}></InConference>;
      case States.End:
        return <div>end</div>;
      default:
        return <div>404</div>;
    }
  }

  return (
    <ConferenceContext.Provider value={value}>
      {showStates()}
    </ConferenceContext.Provider>
  );
}

export default App;
