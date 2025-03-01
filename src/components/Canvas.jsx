import React, { useRef, useEffect } from "react";

export const Canvas = ({
  elements,
  selectedElement,
  setSelectedElement,
  onMoveElement,
  onResizeElement,
  onStartDrag,
  onDrop,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData.items) {
        [...e.clipboardData.items].forEach((item) => {
          if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
              const newImage = {
                id: `element-${Date.now()}`,
                type: "image",
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                src: event.target.result,
                alt: "Pasted image",
              };
              onDrop(newImage);
            };
            reader.readAsDataURL(file);
          }
        });
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onDrop]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("component");

    if (componentData) {
      const component = JSON.parse(componentData);
      const canvasRect = canvasRef.current.getBoundingClientRect();

      const newElement = {
        ...component,
        id: `element-${Date.now()}`,
        x: e.clientX - canvasRect.left - component.width / 2,
        y: e.clientY - canvasRect.top - component.height / 2,
      };

      onDrop(newElement);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="editor-canvas"
      onDragOver={handleDragOver}
      onDrop={handleCanvasDrop}
    >
      {elements.map((element) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedElement && selectedElement.id === element.id}
          onClick={() => setSelectedElement(element)}
          onMoveElement={onMoveElement}
          onResizeElement={onResizeElement}
          onStartDrag={onStartDrag}
        />
      ))}
    </div>
  );
};
