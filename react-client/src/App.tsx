import { createContext, JSX, useState, useEffect } from "react";
import "./App.css";
import { PreviewScreen } from "./components/PreviewScreen";
import { InConference } from "./components/Conference";
import { EndConference } from "./components/EndConference";
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
  useWindowDimensions: Function,
});

function App() {
  const [currentState, setCurrentState] = useState<States>(
    States.Configuration,
  );
  const [stream, setStream] = useState<Stream>();
  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
  const [name, setName] = useState<string>("");
  const value: iConferenceContext = {
    stream,
    setStream,
    deviceManager,
    setDeviceManager,
    useWindowDimensions,
  };

  useEffect(() => {
    document.title = "Mitmi website";
  }, []);

  function joinConference() {
    setCurrentState(States.Conference);
  }

  function leaveConference() {
    setCurrentState(States.End);
  }

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions(),
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
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
        return (
          <InConference
            name={name}
            leaveConference={leaveConference}
          ></InConference>
        );
      case States.End:
        return <EndConference></EndConference>;
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
