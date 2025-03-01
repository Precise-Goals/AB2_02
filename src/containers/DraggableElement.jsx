import React, { useRef, useState } from "react";

const DraggableElement = ({ element, setSelectedElement, updateElement }) => {
  const elementRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setSelectedElement(element);

    if (elementRef.current) {
      setIsDragging(true);

      // Store initial positions for drag calculation
      const rect = elementRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const handleMouseMove = (moveEvent) => {
        if (
          isDragging &&
          elementRef.current &&
          elementRef.current.parentElement
        ) {
          const parentRect =
            elementRef.current.parentElement.getBoundingClientRect();
          const newLeft = moveEvent.clientX - parentRect.left - offsetX;
          const newTop = moveEvent.clientY - parentRect.top - offsetY;

          // Ensure element stays within parent bounds
          const boundedLeft = Math.max(
            0,
            Math.min(newLeft, parentRect.width - rect.width)
          );
          const boundedTop = Math.max(
            0,
            Math.min(newTop, parentRect.height - rect.height)
          );

          // Update element position
          updateElement({
            ...element,
            style: {
              ...element.style,
              left: `${boundedLeft}px`,
              top: `${boundedTop}px`,
            },
          });
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleDoubleClick = (e) => {
    if (element.type === "text" || element.type === "button") {
      const newContent = prompt("Edit content:", element.content);
      if (newContent !== null) {
        updateElement({
          ...element,
          content: newContent,
        });
      }
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <div className="element-content">{element.content}</div>;
      case "button":
        return <button className="element-button">{element.content}</button>;
      case "input":
        return (
          <input
            type="text"
            placeholder="Input text"
            className="element-input"
          />
        );
      case "image":
        return <div className="image-placeholder">Image Placeholder</div>;
      case "container":
        return <div className="container-element"></div>;
      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`draggable-element ${isDragging ? "dragging" : ""}`}
      style={element.style}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {renderElement()}
    </div>
  );
};

export default DraggableElement;
