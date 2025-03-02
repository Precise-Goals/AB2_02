import React from "react";
import { Navbar } from "./Navbar";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="fwrap">
      <h1>UNIFUSION</h1>
      <p>
        UNIFUSION: The best UI editor with AI-driven suggestions, featuring a
        variety of libraries to explore and a user-centric UI with an AI
        chatbot.
      </p>
      <ul className="ls">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/unifusion-documentation">Documentation</Link>
        </li>
        <li>
          <Link to="/unifusion-team">Our Team</Link>
        </li>
        <li>
          <Link to="/unifusion-space">Libraries</Link>
        </li>
        <li>
          <Link to="/unifusion-ui-builder">Get Started</Link>
        </li>
      </ul>
      <p>F_Falcons AlphaByte 2025</p>
    </div>
  );
};
