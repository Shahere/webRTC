import { createContext, JSX, useState } from "react";
import "./App.css";
import { PreviewScreen } from "./components/PreviewScreen";
import { InConference } from "./components/Conference";
import { Stream } from "meetmesavinien";

enum States {
  Configuration,
  Conference,
  End,
}

// Un moyen pour mettre stream sans undefined ?
export interface iConferenceContext {
  stream: Stream | undefined;
  setStream: React.Dispatch<React.SetStateAction<Stream | undefined>>;
}

export const ConferenceContext = createContext<iConferenceContext>({
  stream: undefined,
  setStream: () => {},
});

function App() {
  const [currentState, setCurrentState] = useState<States>(
    States.Configuration
  );
  const [stream, setStream] = useState<Stream>();
  const value: iConferenceContext = { stream, setStream };

  function joinConference() {
    setCurrentState(States.Conference);
  }

  function showStates(): JSX.Element {
    switch (currentState) {
      case States.Configuration:
        return <PreviewScreen joinConference={joinConference}></PreviewScreen>;
      case States.Conference:
        return <InConference></InConference>;
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
