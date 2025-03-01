import React from "react";

export const CanvasElement = ({
  element,
  isSelected,
  onClick,
  onMoveElement,
  onResizeElement,
  onStartDrag,
}) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    onClick();

    if (e.target.classList.contains("resize-handle")) {
      const direction = e.target.dataset.direction;
      onStartDrag(e, "resize", direction);
    } else {
      onStartDrag(e, "move");
    }
  };

  const getElementStyles = () => {
    const styles = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      backgroundColor: element.backgroundColor,
      color: element.color,
      borderWidth: element.borderWidth ? `${element.borderWidth}px` : undefined,
      borderStyle: element.borderWidth ? "solid" : undefined,
      borderColor: element.borderColor,
      borderRadius: element.borderRadius
        ? `${element.borderRadius}px`
        : undefined,
      padding: element.padding ? `${element.padding}px` : undefined,
      margin: element.margin ? `${element.margin}px` : undefined,
      boxShadow: element.boxShadow,
    };

    return styles;
  };

  const renderElementContent = () => {
    switch (element.type) {
      case "text":
        return <div>{element.content}</div>;
      case "button":
        return (
          <button style={{ width: "100%", height: "100%" }}>
            {element.content}
          </button>
        );
      case "input":
        return (
          <input
            style={{ width: "100%", height: "100%" }}
            placeholder={element.placeholder}
          />
        );
      case "image":
        return (
          <img
            src={element.src}
            alt={element.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        );
      case "card":
        return <div className="card-content">Card Content</div>;
      case "navbar":
        return (
          <div
            className="navbar-content"
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <div style={{ marginRight: "20px", fontWeight: "bold" }}>Logo</div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>Home</div>
              <div>About</div>
              <div>Contact</div>
            </div>
          </div>
        );
      case "checkbox":
        return (
          <label
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <input type="checkbox" defaultChecked={element.checked} />
            <span style={{ marginLeft: "8px" }}>{element.label}</span>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`canvas-element ${isSelected ? "selected" : ""}`}
      style={getElementStyles()}
      onMouseDown={handleMouseDown}
    >
      {renderElementContent()}

      {isSelected && (
        <>
          <div
            className="resize-handle top-left"
            data-direction="top-left"
          ></div>
          <div
            className="resize-handle top-right"
            data-direction="top-right"
          ></div>
          <div
            className="resize-handle bottom-left"
            data-direction="bottom-left"
          ></div>
          <div
            className="resize-handle bottom-right"
            data-direction="bottom-right"
          ></div>
          <div className="resize-handle top" data-direction="top"></div>
          <div className="resize-handle right" data-direction="right"></div>
          <div className="resize-handle bottom" data-direction="bottom"></div>
          <div className="resize-handle left" data-direction="left"></div>
        </>
      )}
    </div>
  );
};
