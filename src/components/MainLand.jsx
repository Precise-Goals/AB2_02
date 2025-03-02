import React, { useEffect } from "react";
import Home from "../containers/Box";

export const MainLand = () => {
  

  return (
    <div className="wrappe" style={{ zIndex: "4" }}>
      <div className="bg">
        <div className="content">
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
      <div className="bt"></div>
    </div>
  );
};
