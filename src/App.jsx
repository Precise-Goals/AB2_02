import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import Index from "./containers/Index";
import Index from "./containers/Indes";
import Robo from "./containers/Robo";
// import Index from "./components/Indes";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Index />
    </DndProvider>
  );
};

export default App;
