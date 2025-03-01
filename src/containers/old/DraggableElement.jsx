import React, { useRef, useState } from "react";

const DraggableElement = ({
  element,
  setSelectedElement,
  selectedElement,
  updateElement,
}) => {
  const elementRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const initialPositions = useRef({
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
  });

  // Handles clicking an element to select it
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  // Dragging Functionality
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(element);

    if (elementRef.current) {
      setIsDragging(true);
      const rect = elementRef.current.getBoundingClientRect();
      initialPositions.current.offsetX = e.clientX - rect.left;
      initialPositions.current.offsetY = e.clientY - rect.top;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseMove = (e) => {
    if (!elementRef.current || !elementRef.current.parentElement) return;

    const parentRect = elementRef.current.parentElement.getBoundingClientRect();

    if (isDragging) {
      const newLeft =
        e.clientX - parentRect.left - initialPositions.current.offsetX;
      const newTop =
        e.clientY - parentRect.top - initialPositions.current.offsetY;

      // Keep within the canvas bounds
      const boundedLeft = Math.max(
        0,
        Math.min(newLeft, parentRect.width - elementRef.current.clientWidth)
      );
      const boundedTop = Math.max(
        0,
        Math.min(newTop, parentRect.height - elementRef.current.clientHeight)
      );

      updateElement({
        ...element,
        style: {
          ...element.style,
          left: `${boundedLeft}px`,
          top: `${boundedTop}px`,
        },
      });
    }

    if (isResizing) {
      const newWidth = Math.max(
        50,
        e.clientX - elementRef.current.getBoundingClientRect().left
      );
      const newHeight = Math.max(
        30,
        e.clientY - elementRef.current.getBoundingClientRect().top
      );

      updateElement({
        ...element,
        style: {
          ...element.style,
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        },
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Resize Handle
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Double-click to edit text
  const handleDoubleClick = () => {
    if (["text", "button"].includes(element.type)) {
      const newContent = prompt("Edit content:", element.content);
      if (newContent !== null) {
        updateElement({
          ...element,
          content: newContent,
        });
      }
    }
  };

  // Render UI Element
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
      className={`draggable-element ${isDragging ? "dragging" : ""} ${
        selectedElement?.id === element.id ? "selected" : ""
      }`}
      style={element.style}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {renderElement()}

      {/* Show the resize handle and blue dot only when selected */}
      {selectedElement?.id === element.id && (
        <>
          <div
            className="resize-handle"
            onMouseDown={handleResizeMouseDown}
          ></div>
          <div className="blue-dot"></div>
        </>
      )}
    </div>
  );
};

export default DraggableElement;
