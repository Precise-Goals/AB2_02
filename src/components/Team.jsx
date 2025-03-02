import React from "react";
import u1 from "../assets/1.png";
import u2 from "../assets/2.png";
import u3 from "../assets/3.jpg";
import u4 from "../assets/4.png";

const yus = [
  {
    id: 1,
    name: "Sarthak Patil",
    role: "Core Developer",
    department: "CSE",
    email: "sarthakpatil.ug@gmail.com",
    img: u1,
  },
  {
    id: 2,
    name: "Damodhar Ojha",
    role: "Core Debugger",
    department: "CSE",
    email: "damodharojha72@gmail.com",
    img: u2,
  },
  {
    id: 3,
    name: "Anushka Singh",
    role: "Problem Researcher",
    department: "CSE",
    email: "singhanushkaofficial04@gmail.com",
    img: u3,
  },
  {
    id: 4,
    name: "Tejas Patil",
    role: "Presentation Handler",
    department: "CE",
    email: "tejpatil2006@gmail.com",
    img: u4,
  },
];

export const Team = () => {
  return (
    <div className="hil">
      <div className="lcon">
        <h1>Our Dedicated Team</h1>
        <p>Crafting Innovation with Combined Expertise.</p>
      </div>
      <div className="teams">
        {yus.map((o, ky) => (
          <div className="tmmate">
            <img src={o.img} alt={o.name} />
            <div className="con">
              <h1>{o.name}</h1>
              <p>{o.role}</p>
              <p>{o.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
