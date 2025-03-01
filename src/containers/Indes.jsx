import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import EditorHeader from "./EditorHeader";
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

  const handleImageUpload = (imageData) => {
    // Get canvas center or default position if no canvas ref
    let positionX = 100;
    let positionY = 100;

    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      positionX = canvasRect.width / 2 - 75;
      positionY = canvasRect.height / 2 - 75;
    }

    const newImage = {
      id: elements.length,
      type: "image",
      position: {
        x: positionX,
        y: positionY,
      },
      width: 150,
      height: 150,
      content: imageData,
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

  const ImageUploadProperty = ({ onImageUpload }) => {
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            onImageUpload(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    };

    const handleUploadClick = () => {
      fileInputRef.current.click();
    };

    return (
      <div
        className="image-upload-property"
        style={{
          margin: "1.25rem 0 0 0",
          padding: "1.25rem 0 0 0 ",
          borderBottom: "none",
        }}
      >
        <h3>Image Frame</h3>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button onClick={handleUploadClick} className="upload-button">
          Upload Image
        </button>
      </div>
    );
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
  // const generateAiSuggestions = () => {
  //   const suggestions = [
  //     "Try adding more contrast between your text and background colors",
  //     "Consider aligning your elements to a grid for better visual flow",
  //   ];

  //   setAiSuggestions(suggestions);
  //   setShowSuggestions(true);
  // };
  const generateAiSuggestions = async () => {
    try {
      const apiKey = import.meta.env.VITE_TOGETHER_API;

      if (!apiKey) {
        throw new Error("API key is missing. Please set your API key.");
      }

      const response = await fetch("https://api.together.xyz/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          prompt:
            "Generate exactly 2 helpful UI/UX design suggestions.Length of each suggestion should be  10-12 words only. Each suggestion should be a single sentence with similar length. Format as a JSON array of strings.",
          max_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();

      // Parse the response to extract the suggestions
      let suggestions;
      try {
        // Try to parse the response as JSON directly
        const responseText = data.choices[0].text.trim();

        // Clean up responseText to ensure it’s valid JSON
        const cleanedText = responseText.replace(/\\n/g, "").replace(/'/g, '"');

        suggestions = JSON.parse(cleanedText);
      } catch (e) {
        // If direct parsing fails, try to extract JSON from text
        const responseText = data.choices[0].text.trim();
        const jsonMatch = responseText.match(/\[.*\]/s);

        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: split by newlines and take first two lines
          suggestions = responseText
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .slice(0, 2)
            .map((line) => line.replace(/^["'\d\s-.*•]+/, "").trim());
        }
      }

      // Ensure we have exactly 2 suggestions
      suggestions = suggestions.slice(0, 2);
      if (suggestions.length < 2) {
        suggestions.push(
          "Ensure your design maintains consistency across all pages and elements."
        );
      }

      setAiSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      // Fallback suggestions in case of API failure
      setAiSuggestions([
        "Try adding more contrast between your text and background colors",
        "Consider aligning your elements to a grid for better visual flow",
      ]);
      setShowSuggestions(true);
    }
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
            alt="Canvas element"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none", // Prevents the image from capturing mouse events
            }}
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
      <EditorHeader elements={elements} />
      <div className="editor-content">
        <div className="toolbar">
          <div>
            <h3>Elements</h3>
            <div
              className="tbhor"
              style={{
                display: "flex",
                padding: "0.25rem 0",
                margin: "0.5rem 0",
                textAlign: "center",
                gap: "1em",
              }}
            >
              <button onClick={() => addElement("text")}>Text</button>
              <button onClick={() => addElement("button")}>Button</button>
            </div>
            <button onClick={() => addElement("container")}>Container</button>
            <ImageUploadProperty onImageUpload={handleImageUpload} />
          </div>

          <div>
            <h3>Components</h3>
            <button
              onClick={() => {
                window.alert(
                  "Component is under the development. however you may proceed with ai and basic features."
                );
                addElement("card");
              }}
            >
              Card
            </button>
            <button
              onClick={() => {
                window.alert(
                  "Component is under the development. however you may proceed with ai and basic features."
                );
                addElement("navbar");
              }}
            >
              Navbar
            </button>
            <button
              onClick={() => {
                window.alert(
                  "Component is under the development. however you may proceed with ai and basic features."
                );
                addElement("form");
              }}
            >
              Form
            </button>
          </div>

          <div
            style={{
              border: "none",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button className="aisas" onClick={generateAiSuggestions}>
              AI Assistant
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
          // onDrop={handleImageDrop}
          onDragOver={handleDragOver}
        >
          {elements.map((element, index) => renderElement(element, index))}
        </div>

        <div className="properties-panel">
          <h3>Properties</h3>

          {selectedElement !== null ? (
            <div className="properties-form">
              <div className="mlay">
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
                  <div className="rngs">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={
                        parseInt(elements[selectedElement].style.borderWidth) ||
                        0
                      }
                      onChange={(e) =>
                        updateElementStyle("borderWidth", `${e.target.value}px`)
                      }
                    />
                    <span>{elements[selectedElement].style.borderWidth}</span>
                  </div>
                </div>

                <div className="property-group rng">
                  <label>Border Radius</label>
                  <div className="rngs">
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={
                        parseInt(
                          elements[selectedElement].style.borderRadius
                        ) || 0
                      }
                      onChange={(e) =>
                        updateElementStyle(
                          "borderRadius",
                          `${e.target.value}px`
                        )
                      }
                    />
                    <span>{elements[selectedElement].style.borderRadius}</span>
                  </div>
                </div>

                <div className="property-group rng">
                  <label>Padding</label>
                  <div className="rngs">
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
                </div>

                <div className="property-group rng">
                  <label>Margin</label>
                  <div className="rngs">
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
              </div>

              <div className="mtxt">
                {elements[selectedElement].type === "text" && (
                  <>
                    <div className="property-group rng">
                      <label>Font Size</label>
                      <div className="rngs">
                        <input
                          type="range"
                          min="8"
                          max="108"
                          value={
                            parseInt(
                              elements[selectedElement].style.fontSize
                            ) || 16
                          }
                          onChange={(e) =>
                            updateElementStyle(
                              "fontSize",
                              `${e.target.value}px`
                            )
                          }
                        />
                        <span>{elements[selectedElement].style.fontSize}</span>
                      </div>
                    </div>

                    <div className="property-group ts">
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

                    <div className="property-group ts">
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
              </div>
              {/* <ImageUploadProperty onImageUpload={handleImageUpload} /> */}
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
