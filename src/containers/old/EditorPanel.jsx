import React from "react";
import "../styles/editor.css";

const EditorPanel = ({ addElement }) => {
  const elementTypes = [
    { type: "text", label: "Text", icon: "T" },
    { type: "button", label: "Button", icon: "B" },
    { type: "input", label: "Input Field", icon: "In" },
    { type: "image", label: "Image", icon: "Img" },
    { type: "container", label: "Container", icon: "[]" },
  ];

  const handleDragStart = (e, elementType) => {
    e.dataTransfer.setData("elementType", elementType);
    e.dataTransfer.effectAllowed = "copy";

    // Create a custom drag image
    const dragPreview = document.createElement("div");
    dragPreview.className = "drag-preview";
    dragPreview.textContent = elementType;
    dragPreview.style.padding = "8px";
    dragPreview.style.backgroundColor = "#2196F3";
    dragPreview.style.color = "white";
    dragPreview.style.borderRadius = "4px";
    dragPreview.style.position = "absolute";
    dragPreview.style.zIndex = "9999";
    dragPreview.style.opacity = "0.8";

    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 20, 20);

    // Clean up after dragging is complete
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };

  return (
    <div className="editor-panel">
      <h2>Components</h2>
      <div className="element-list">
        {elementTypes.map((element) => (
          <div
            key={element.type}
            className="element-item"
            onClick={() => addElement(element.type)}
            draggable
            onDragStart={(e) => handleDragStart(e, element.type)}
          >
            <span className="element-icon">{element.icon}</span>
            <span>{element.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorPanel;
