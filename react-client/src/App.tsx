import { useState } from "react";
import "./App.css";
import { PreviewScreen } from "./components/PreviewScreen";

enum States {
  Configuration,
  Conference,
  End,
}

function App() {
  const [currentState, setCurrentState] = useState(States.Configuration);

  function showStates() {
    switch (currentState) {
      case States.Configuration:
        return <PreviewScreen></PreviewScreen>;
        break;
      case States.Conference:
        break;
      case States.End:
        break;
      default:
        break;
    }
  }
  return showStates();
}

export default App;
