import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="nav" style={{ zIndex: "4" }}>
      <h1 className="logo">UNIFUSION</h1>
      <ul className="list">
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
          <Link to="/unifusion-login">Get Started</Link>
        </li>
        <li>
          <Link
            to="/unifusion-ai"
            className="aisa"
            style={{
              color: "transparent",
              fontWeight: "700",
            }}
          >
            Unifusion Ai
          </Link>
        </li>
      </ul>
    </nav>
  );
};
