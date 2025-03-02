import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Index from "./containers/Indes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLand } from "./components/MainLand";
import { Navbar } from "./components/Navbar";
import "./App.css";
import { Footer } from "./components/Footer";
import { Docs } from "./components/Docs";
import { Team } from "./components/Team";
import { Library } from "./components/Library";

const App = () => {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainLand />} />
          <Route path="/unifusion-ui-builder" element={<Index />} />
          <Route path="/unifusion-team" element={<Team />} />
          <Route path="/unifusion-space" element={<Library />} />
          <Route path="/unifusion-documentation" element={<Docs />} />
        </Routes>
        <Footer />
      </DndProvider>
    </BrowserRouter>
  );
};

export default App;
