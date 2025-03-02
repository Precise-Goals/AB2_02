import React from "react";
import { Link } from "react-router-dom";

const ds = [
  {
    id: 1,
    url: "https://react.dev/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    name: "React",
    description: "A JavaScript library for building user interfaces.",
  },
  {
    id: 2,
    url: "https://vuejs.org/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png",
    name: "Vue.js",
    description: "A progressive JavaScript framework for building UIs.",
  },
  {
    id: 3,
    url: "https://mui.com/",
    img: "https://mui.com/static/logo.png",
    name: "Material UI",
    description: "React components for faster and easier web development.",
  },
  {
    id: 4,
    url: "https://tailwindcss.com/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/600px-Tailwind_CSS_Logo.svg.png",
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for modern UI development.",
  },
  {
    id: 5,
    url: "https://getbootstrap.com/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/1200px-Bootstrap_logo.svg.png",
    name: "Bootstrap",
    description: "The world's most popular front-end open-source toolkit.",
  },
  {
    id: 6,
    url: "https://ant.design/",
    img: "https://camo.githubusercontent.com/bc6af282bbd78ae1c49608a917b1f5f601e7762cd3dd9db674df183becb7b458/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f77496a4d446e7372446f50506349562e706e67",
    name: "Ant Design",
    description: "A design system for enterprise-level products.",
  },
  {
    id: 7,
    url: "https://chakra-ui.com/",
    img: "https://avatars.githubusercontent.com/u/54212428?s=200&v=4",
    name: "Chakra UI",
    description:
      "A simple, modular, and accessible component library for React.",
  },
  {
    id: 8,
    url: "https://framer.com/",
    img: "data:image/png;base64,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",
    name: "Framer",
    description: "A powerful design and prototyping tool for UI/UX designers.",
  },
  {
    id: 9,
    url: "https://spline.design/",
    img: "data:image/jpeg;base64,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",
    name: "Spline",
    description: "A 3D design tool for the web with real-time collaboration.",
  },
  {
    id: 10,
    url: "https://figma.com/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1667px-Figma-logo.svg.png",
    name: "Figma",
    description: "A collaborative interface design tool.",
  },
  {
    id: 11,
    url: "https://developer.apple.com/design/human-interface-guidelines/",
    img: "https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png ",
    name: "Apple HIG",
    description: "Human Interface Guidelines for Apple platforms.",
  },
  {
    id: 12,
    url: "https://microsoft.com/design/fluent/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
    name: "Fluent Design",
    description:
      "Microsoft's design system for creating cross-platform experiences.",
  },
];

export const Library = () => {
  return (
    <>
      <div className="lcon">
        <h1>Most Used Libraries</h1>
        <p>More components are under the development.</p>
      </div>
      <div className="lcards">
        {ds.map((o, ky) => (
          <Link key={ky} to={o.url}>
            <div className="lcard">
              <img src={o.img} alt={o.name} />
              <h2>{o.name}</h2>
              <p>{o.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
