import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Index from "./containers/Indes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLand } from "./components/MainLand";
import { Navbar } from "./components/Navbar";
import "./App.css";
import { Footer } from "./components/Footer";
import hero from "./assets/audio.mp3";
import { Docs } from "./components/Docs";
import { Team } from "./components/Team";
import { Library } from "./components/Library";
import Auth from "./containers/Login";
import { ChatBot } from "./containers/Robo";

const App = () => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const BackgroundSound = () => {
    const audioRef = React.useRef(null);

    useEffect(() => {
      // Handle mute/unmute when state changes
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        if (!isMuted) {
          audioRef.current
            .play()
            .catch((e) => console.log("Autoplay prevented:", e));
        }
      }
    }, [isMuted]);
    return (
      <>
        <audio ref={audioRef} src={hero} loop autoPlay muted={isMuted}>
          Your browser does not support the audio element.
        </audio>
        <button
          onClick={toggleMute}
          className="sound-toggle"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            padding: "8px",
            borderRadius: "50%",
            background: "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </>
    );
  };

  return (
    <>
      <BackgroundSound />
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <Navbar />
          <Routes>
            <Route path="/" element={<MainLand />} />
            <Route path="/unifusion-login" element={<Auth />} />
            <Route path="/unifusion-ui-builder" element={<Index />} />
            <Route path="/unifusion-team" element={<Team />} />
            <Route path="/unifusion-ai" element={<ChatBot />} />
            <Route path="/unifusion-space" element={<Library />} />
            <Route path="/unifusion-documentation" element={<Docs />} />
          </Routes>
          <Footer />
        </DndProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
