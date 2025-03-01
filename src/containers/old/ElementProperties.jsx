import React from "react";
import "../styles/editor.css";

const ElementProperties = ({ element, updateElement, deleteElement }) => {
  // Handles updating element styles dynamically
  const handleStyleChange = (property, value) => {
    updateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };

  // Handles updating element content (if applicable)
  const handleContentChange = (event) => {
    updateElement({ ...element, content: event.target.value });
  };

  return (
    <div className="properties-panel">
      <h2>Properties</h2>

      {/* Element Info & Delete */}
      <div className="property-group">
        <h3>Element: {element.type}</h3>
        <button
          className="delete-button"
          onClick={() => deleteElement(element.id)}
        >
          Delete Element
        </button>
      </div>

      {/* Content Editor (for text & buttons) */}
      {(element.type === "text" || element.type === "button") && (
        <div className="property-group">
          <h3>Content</h3>
          <input
            type="text"
            value={element.content || ""}
            onChange={handleContentChange}
            className="full-width-input"
          />
        </div>
      )}

      {/* Dimension Controls */}
      <div className="property-group">
        <h3>Dimensions</h3>
        {["width", "height", "zIndex"].map((prop) => (
          <div className="property-row" key={prop}>
            <label>{prop.charAt(0).toUpperCase() + prop.slice(1)}:</label>
            <input
              type={prop === "zIndex" ? "number" : "text"}
              value={element.style[prop] || ""}
              onChange={(e) => handleStyleChange(prop, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Appearance Controls */}
      <div className="property-group">
        <h3>Appearance</h3>
        {[
          { label: "Background", prop: "backgroundColor", type: "color" },
          { label: "Text Color", prop: "color", type: "color" },
          {
            label: "Font Size",
            prop: "fontSize",
            type: "select",
            options: [
              "12px",
              "14px",
              "16px",
              "18px",
              "20px",
              "24px",
              "28px",
              "32px",
            ],
          },
          {
            label: "Font Weight",
            prop: "fontWeight",
            type: "select",
            options: ["normal", "bold", "lighter"],
          },
        ].map(({ label, prop, type, options }) => (
          <div className="property-row" key={prop}>
            <label>{label}:</label>
            {type === "select" ? (
              <select
                value={element.style[prop]}
                onChange={(e) => handleStyleChange(prop, e.target.value)}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={element.style[prop] || ""}
                onChange={(e) => handleStyleChange(prop, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Border Settings */}
      <div className="property-group">
        <h3>Border</h3>
        {[
          {
            label: "Width",
            prop: "borderWidth",
            type: "select",
            options: ["0px", "1px", "2px", "3px", "4px"],
          },
          {
            label: "Style",
            prop: "borderStyle",
            type: "select",
            options: ["none", "solid", "dashed", "dotted"],
          },
          { label: "Color", prop: "borderColor", type: "color" },
          {
            label: "Radius",
            prop: "borderRadius",
            type: "range",
            min: 0,
            max: 50,
          },
        ].map(({ label, prop, type, options, min, max }) => (
          <div className="property-row" key={prop}>
            <label>{label}:</label>
            {type === "select" ? (
              <select
                value={element.style[prop]}
                onChange={(e) => handleStyleChange(prop, e.target.value)}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : type === "range" ? (
              <>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={parseInt(element.style[prop] || 0)}
                  onChange={(e) =>
                    handleStyleChange(prop, `${e.target.value}px`)
                  }
                />
                <span>{element.style[prop]}</span>
              </>
            ) : (
              <input
                type={type}
                value={element.style[prop] || ""}
                onChange={(e) => handleStyleChange(prop, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Spacing Settings */}
      <div className="property-group">
        <h3>Spacing</h3>
        {["padding", "margin"].map((prop) => (
          <div className="property-row" key={prop}>
            <label>{prop.charAt(0).toUpperCase() + prop.slice(1)}:</label>
            <input
              type="text"
              value={element.style[prop] || ""}
              onChange={(e) => handleStyleChange(prop, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElementProperties;
