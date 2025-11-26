import { JSX, useState } from "react";
import "./App.css";
import { PreviewScreen } from "./components/PreviewScreen";

enum States {
  Configuration,
  Conference,
  End,
}

function App() {
  const [currentState, setCurrentState] = useState(States.Configuration);

  function showStates(): JSX.Element {
    switch (currentState) {
      case States.Configuration:
        return <PreviewScreen></PreviewScreen>;
        break;
      case States.Conference:
        <div>todo</div>;
        break;
      case States.End:
        <div>todo</div>;
        break;
      default:
        return <div>404</div>;
        break;
    }
    return <div>404</div>;
  }
  return showStates();
}

export default App;
