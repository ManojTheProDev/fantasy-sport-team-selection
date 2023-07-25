import React from "react";
import "./App.css";
import "h8k-components";

import TeamSelection from "./components/team-selection";

const title = "Team Selection";

const App = () => {
  return (
    <div className="App">
      <h8k-navbar header={title}></h8k-navbar>
      <TeamSelection />
    </div>
  );
};

export default App;
