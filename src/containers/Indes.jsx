import React, { useState, useRef, useEffect } from "react";
import "./style.css";
// import { generateAiSuggestions } from "./AI";

// Main Editor Component
const FigmaLikeEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState("");
  const [clipboard, setClipboard] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const canvasRef = useRef(null);

  // Disable right-click context menu
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Copy - Ctrl+C
      if (e.ctrlKey && e.key === "c" && selectedElement !== null) {
        setClipboard({ ...elements[selectedElement] });
      }

      // Paste - Ctrl+V
      if (e.ctrlKey && e.key === "v" && clipboard) {
        const newElement = {
          ...clipboard,
          id: elements.length,
          position: {
            x: clipboard.position.x + 10,
            y: clipboard.position.y + 10,
          },
        };
        setElements([...elements, newElement]);
      }

      // Delete - Delete key
      if (e.key === "Delete" && selectedElement !== null) {
        setElements(elements.filter((_, index) => index !== selectedElement));
        setSelectedElement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedElement, clipboard]);

  // Handle element selection
  const handleElementSelect = (index, e) => {
    e.stopPropagation();
    setSelectedElement(index);

    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setResizeDirection(e.target.dataset.direction);
    } else {
      setIsDragging(true);
      const rect = e.target.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle mouse movement for dragging and resizing
  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    if (isDragging && selectedElement !== null) {
      const newElements = [...elements];
      newElements[selectedElement] = {
        ...newElements[selectedElement],
        position: {
          x: e.clientX - canvasRect.left - dragOffset.x,
          y: e.clientY - canvasRect.top - dragOffset.y,
        },
      };
      setElements(newElements);
    }

    if (isResizing && selectedElement !== null) {
      const newElements = [...elements];
      const element = { ...newElements[selectedElement] };

      switch (resizeDirection) {
        case "se":
          element.width = Math.max(
            30,
            e.clientX - canvasRect.left - element.position.x
          );
          element.height = Math.max(
            30,
            e.clientY - canvasRect.top - element.position.y
          );
          break;
        case "sw":
          const newWidth =
            element.position.x + element.width - (e.clientX - canvasRect.left);
          element.position.x = e.clientX - canvasRect.left;
          element.width = Math.max(30, newWidth);
          element.height = Math.max(
            30,
            e.clientY - canvasRect.top - element.position.y
          );
          break;
        case "ne":
          element.width = Math.max(
            30,
            e.clientX - canvasRect.left - element.position.x
          );
          const newHeight =
            element.position.y + element.height - (e.clientY - canvasRect.top);
          element.position.y = e.clientY - canvasRect.top;
          element.height = Math.max(30, newHeight);
          break;
        case "nw":
          const newWidthNW =
            element.position.x + element.width - (e.clientX - canvasRect.left);
          const newHeightNW =
            element.position.y + element.height - (e.clientY - canvasRect.top);
          element.position.x = e.clientX - canvasRect.left;
          element.position.y = e.clientY - canvasRect.top;
          element.width = Math.max(30, newWidthNW);
          element.height = Math.max(30, newHeightNW);
          break;
        default:
          break;
      }

      newElements[selectedElement] = element;
      setElements(newElements);
    }
  };

  // Handle mouse up to end dragging or resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Clear selection when clicking on canvas
  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  // Add a new element to the canvas
  const addElement = (type) => {
    const newElement = {
      id: elements.length,
      type,
      position: { x: 50, y: 50 },
      width: type === "text" ? 200 : 150,
      height: type === "text" ? 50 : 150,
      content: type === "text" ? "Edit text" : "",
      style: {
        backgroundColor: type === "text" ? "transparent" : "#f0f0f0",
        color: "#000000",
        borderColor: "#cccccc",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0px",
        padding: "8px",
        margin: "0px",
        fontSize: "16px",
        fontWeight: "normal",
        textAlign: "left",
      },
    };

    setElements([...elements, newElement]);
    setSelectedElement(elements.length);
  };

  // Handle image upload via drag and drop
  const handleImageDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.items) {
      const files = [...e.dataTransfer.items]
        .filter(
          (item) => item.kind === "file" && item.type.startsWith("image/")
        )
        .map((item) => item.getAsFile());

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: elements.length,
            type: "image",
            position: {
              x:
                e.clientX - canvasRef.current.getBoundingClientRect().left - 75,
              y: e.clientY - canvasRef.current.getBoundingClientRect().top - 75,
            },
            width: 150,
            height: 150,
            content: event.target.result,
            style: {
              borderColor: "#cccccc",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "0px",
              padding: "0px",
              margin: "0px",
            },
          };

          setElements([...elements, newImage]);
          setSelectedElement(elements.length);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Prevent default drag behavior
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Update element style
  const updateElementStyle = (property, value) => {
    if (selectedElement === null) return;

    const newElements = [...elements];
    newElements[selectedElement] = {
      ...newElements[selectedElement],
      style: {
        ...newElements[selectedElement].style,
        [property]: value,
      },
    };

    setElements(newElements);
  };

  // Update element content
  const updateElementContent = (value) => {
    if (selectedElement === null) return;

    const newElements = [...elements];
    newElements[selectedElement] = {
      ...newElements[selectedElement],
      content: value,
    };

    setElements(newElements);
  };
  const generateAiSuggestions = () => {
    const suggestions = [
      "Try adding more contrast between your text and background colors",
      "Consider aligning your elements to a grid for better visual flow",
      // "Your current spacing between elements could be more consistent",
      // "This layout would work better on mobile with a column arrangement",
      // "Consider using a complementary color for your call-to-action buttons",
    ];

    setAiSuggestions(suggestions);
    setShowSuggestions(true);
  };

  // Render element on canvas
  const renderElement = (element, index) => {
    const isSelected = selectedElement === index;

    const elementStyle = {
      position: "absolute",
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      ...element.style,
      outline: isSelected ? "2px solid #1a73e8" : "none",
    };

    return (
      <div
        key={element.id}
        className={`canvas-element ${element.type}-element`}
        style={elementStyle}
        onDoubleClick={(e) => handleElementSelect(index, e)}
        onMouseDown={(E) => handleElementSelect(index, E)}
      >
        {element.type === "text" && (
          <div
            contentEditable={isSelected}
            suppressContentEditableWarning={true}
            className="text-content"
            onBlur={(e) => updateElementContent(e.target.textContent)}
          >
            {element.content}
          </div>
        )}

        {element.type === "image" && (
          <img
            src={element.content}
            alt="User uploaded"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}

        {isSelected && (
          <>
            <div className="resize-handle se" data-direction="se"></div>
            <div className="resize-handle sw" data-direction="sw"></div>
            <div className="resize-handle ne" data-direction="ne"></div>
            <div className="resize-handle nw" data-direction="nw"></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="editor-container">
      <header className="editor-header">
        <div className="logo">UIFUSION</div>
        <div className="header-actions">
          <button onClick={() => window.alert("Preview mode would open here")}>
            Preview
          </button>
          <button onClick={() => window.alert("Design saved!")}>Save</button>
        </div>
      </header>

      <div className="editor-content">
        <div className="toolbar">
          <div>
            <h3>Elements</h3>
            <button onClick={() => addElement("text")}>Text</button>
            <button onClick={() => addElement("container")}>Container</button>
            <button onClick={() => addElement("button")}>Button</button>
            <button onClick={() => addElement("image")}>Image</button>
          </div>

          <div>
            <h3>Components</h3>
            <button onClick={() => addElement("card")}>Card</button>
            <button onClick={() => addElement("navbar")}>Navbar</button>
            <button onClick={() => addElement("form")}>Form</button>
          </div>

          <div>
            <h3>AI Assistant</h3>
            <button onClick={generateAiSuggestions}>
              Get Design Suggestions
            </button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="canvas"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDrop={handleImageDrop}
          onDragOver={handleDragOver}
        >
          {elements.map((element, index) => renderElement(element, index))}
        </div>

        <div className="properties-panel">
          <h3>Properties</h3>

          {selectedElement !== null ? (
            <div className="properties-form">
              <div className="mclr">
                <div className="property-group clr">
                  <label>Background</label>
                  <input
                    type="color"
                    value={
                      elements[selectedElement].style.backgroundColor ||
                      "#ffffff"
                    }
                    onChange={(e) =>
                      updateElementStyle("backgroundColor", e.target.value)
                    }
                  />
                </div>

                <div className="property-group clr">
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={elements[selectedElement].style.color || "#000000"}
                    onChange={(e) =>
                      updateElementStyle("color", e.target.value)
                    }
                  />
                </div>

                <div className="property-group clr">
                  <label>Border Color</label>
                  <input
                    type="color"
                    value={
                      elements[selectedElement].style.borderColor || "#cccccc"
                    }
                    onChange={(e) =>
                      updateElementStyle("borderColor", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mrng">
                <div className="property-group rng">
                  <label>Border Width</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={
                      parseInt(elements[selectedElement].style.borderWidth) || 0
                    }
                    onChange={(e) =>
                      updateElementStyle("borderWidth", `${e.target.value}px`)
                    }
                  />
                  <span>{elements[selectedElement].style.borderWidth}</span>
                </div>

                <div className="property-group rng">
                  <label>Border Radius</label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={
                      parseInt(elements[selectedElement].style.borderRadius) ||
                      0
                    }
                    onChange={(e) =>
                      updateElementStyle("borderRadius", `${e.target.value}px`)
                    }
                  />
                  <span>{elements[selectedElement].style.borderRadius}</span>
                </div>

                <div className="property-group rng">
                  <label>Padding</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={
                      parseInt(elements[selectedElement].style.padding) || 0
                    }
                    onChange={(e) =>
                      updateElementStyle("padding", `${e.target.value}px`)
                    }
                  />
                  <span>{elements[selectedElement].style.padding}</span>
                </div>

                <div className="property-group rng">
                  <label>Margin</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={
                      parseInt(elements[selectedElement].style.margin) || 0
                    }
                    onChange={(e) =>
                      updateElementStyle("margin", `${e.target.value}px`)
                    }
                  />
                  <span>{elements[selectedElement].style.margin}</span>
                </div>
              </div>

                    <div className="txt">
                      
                    </div>

              {elements[selectedElement].type === "text" && (
                <>
                  <div className="property-group rng">
                    <label>Font Size</label>
                    <input
                      type="range"
                      min="8"
                      max="108"
                      value={
                        parseInt(elements[selectedElement].style.fontSize) || 16
                      }
                      onChange={(e) =>
                        updateElementStyle("fontSize", `${e.target.value}px`)
                      }
                    />
                    <span>{elements[selectedElement].style.fontSize}</span>
                  </div>

                  <div className="property-group">
                    <label>Font Weight</label>
                    <select
                      value={
                        elements[selectedElement].style.fontWeight || "normal"
                      }
                      onChange={(e) =>
                        updateElementStyle("fontWeight", e.target.value)
                      }
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Lighter</option>
                    </select>
                  </div>

                  <div className="property-group">
                    <label>Text Align</label>
                    <select
                      value={
                        elements[selectedElement].style.textAlign || "left"
                      }
                      onChange={(e) =>
                        updateElementStyle("textAlign", e.target.value)
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </>
              )}

              <div className="property-group">
                <label>Position</label>
                <div className="position-inputs">
                  <div>
                    <span>X:</span>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].position.x)}
                      onChange={(e) => {
                        const newElements = [...elements];
                        newElements[selectedElement].position.x = parseInt(
                          e.target.value
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                  <div>
                    <span>Y:</span>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].position.y)}
                      onChange={(e) => {
                        const newElements = [...elements];
                        newElements[selectedElement].position.y = parseInt(
                          e.target.value
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="property-group">
                <label>Size</label>
                <div className="position-inputs">
                  <div>
                    <span>W:</span>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].width)}
                      onChange={(e) => {
                        const newElements = [...elements];
                        newElements[selectedElement].width = parseInt(
                          e.target.value
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                  <div>
                    <span>H:</span>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].height)}
                      onChange={(e) => {
                        const newElements = [...elements];
                        newElements[selectedElement].height = parseInt(
                          e.target.value
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-selection-message">
              Select an element to edit its properties
            </p>
          )}
        </div>
      </div>

      {showSuggestions && (
        <div className="ai-suggestions">
          <div className="suggestions-header">
            <h3>AI Design Suggestions</h3>
            <button onClick={() => setShowSuggestions(false)}>×</button>
          </div>
          <ul>
            {aiSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FigmaLikeEditor;
