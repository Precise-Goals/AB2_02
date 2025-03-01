import React from "react";

export const ComponentLibrary = ({ onAddComponent }) => {
  const componentTypes = [
    {
      id: "rectangle",
      name: "Rectangle",
      icon: "⬜",
      defaultProps: {
        type: "rectangle",
        width: 150,
        height: 100,
        backgroundColor: "#f0f0f0",
        borderRadius: 0,
      },
    },
    {
      id: "text",
      name: "Text",
      icon: "T",
      defaultProps: {
        type: "text",
        width: 200,
        height: 40,
        content: "Text label",
        color: "#000000",
        fontSize: 16,
        fontFamily: "Arial",
      },
    },
    {
      id: "button",
      name: "Button",
      icon: "🔘",
      defaultProps: {
        type: "button",
        width: 120,
        height: 40,
        content: "Button",
        backgroundColor: "#4285f4",
        color: "#ffffff",
        borderRadius: 4,
        padding: 8,
      },
    },
    {
      id: "input",
      name: "Input Field",
      icon: "📝",
      defaultProps: {
        type: "input",
        width: 200,
        height: 40,
        placeholder: "Enter text...",
        backgroundColor: "#ffffff",
        borderColor: "#cccccc",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
      },
    },
    {
      id: "image",
      name: "Image",
      icon: "🖼️",
      defaultProps: {
        type: "image",
        width: 200,
        height: 150,
        src: "/api/placeholder/200/150",
        alt: "Image placeholder",
      },
    },
    {
      id: "card",
      name: "Card",
      icon: "🃏",
      defaultProps: {
        type: "card",
        width: 300,
        height: 200,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderColor: "#eeeeee",
        borderWidth: 1,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      },
    },
    {
      id: "navbar",
      name: "Navigation Bar",
      icon: "🧭",
      defaultProps: {
        type: "navbar",
        width: 800,
        height: 60,
        backgroundColor: "#333333",
        color: "#ffffff",
        padding: 16,
      },
    },
    {
      id: "checkbox",
      name: "Checkbox",
      icon: "☑️",
      defaultProps: {
        type: "checkbox",
        width: 200,
        height: 24,
        label: "Checkbox option",
        checked: false,
      },
    },
  ];

  return (
    <div className="component-library">
      <div className="library-header">
        <h3>Components</h3>
      </div>
      <div className="library-content">
        {componentTypes.map((component) => (
          <div
            key={component.id}
            className="component-item"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "component",
                JSON.stringify(component.defaultProps)
              );
            }}
            onClick={() => onAddComponent(component.defaultProps)}
          >
            <div className="component-icon">{component.icon}</div>
            <div className="component-name">{component.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
