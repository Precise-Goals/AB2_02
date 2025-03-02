import React, { useEffect } from "react";
import Home from "../containers/Box";
import { FaStudiovinari } from "react-icons/fa6";
import { GiCardPick } from "react-icons/gi";
import { LuBrainCircuit } from "react-icons/lu";
import { IoTimer } from "react-icons/io5";
import { BiSolidComponent } from "react-icons/bi";
import { FaTools } from "react-icons/fa";

export const MainLand = () => {
  return (
    <div className="wrappe" style={{ zIndex: "4" }}>
      <div className="bg">
        <div className="content">
          <p className="olo">click anywhere !</p>
          <h1>
            We are <br /> 
            <span>UniFusion</span>
          </h1>
          <p>
            We tend to provide the UI builder integrated with AI with most user
            centric UI you have came across we also have wide varieties of
            Libraries.
          </p>
        </div>
        <div className="img">
          <Home />
        </div>
      </div>
      <div className="bt">
        <h1>Motive of Unifusion</h1>
        <ul className="lsd">
          <li>
            <FaStudiovinari />
            Faster and higher quality UI development
          </li>
          <li>
            <GiCardPick />
            Intuitive drag-and-drop interface design
          </li>
          <li>
            <LuBrainCircuit /> Smart AI-driven design suggestions
          </li>
          <li>
            <IoTimer /> Real-time preview for instant feedback
          </li>
          <li>
            <BiSolidComponent />
            Comprehensive and extensive component library
          </li>
          <li>
            <FaTools />
            Superior customization for unique designs
          </li>
        </ul>
      </div>
    </div>
  );
};
