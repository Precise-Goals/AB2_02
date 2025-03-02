import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Index from "./containers/Indes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLand } from "./components/MainLand";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainLand />} />
          <Route path="/unifusion-ui-editor" element={<Index />} />
        </Routes>
        <Footer />
      </DndProvider>
    </BrowserRouter>
  );
};

export default App;
