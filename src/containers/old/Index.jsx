import { useState } from "react";
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";
import ElementProperties from "./ElementProperties";
import "../styles/editor.css";


const Index = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const addElement = (element) => {
    // Allow passing a complete element object or just the type
    if (typeof element === "string") {
      // Create a new element with default properties if only type is provided
      const newElement = createDefaultElement(element);
      setElements([...elements, newElement]);
    } else {
      // Use the provided complete element object
      setElements([...elements, element]);
    }
  };

  const createDefaultElement = (type) => {
    return {
      id: `element-${Date.now()}`,
      type,
      content: type === "text" ? "New Text" : type === "button" ? "Button" : "",
      style: {
        width: type === "container" ? "300px" : "100px",
        height: type === "container" ? "200px" : "40px",
        backgroundColor: type === "container" ? "#f8f8f8" : "#ffffff",
        color: "#333333",
        fontSize: "16px",
        fontWeight: "normal",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#dddddd",
        borderRadius: "4px",
        padding: "8px",
        margin: "4px",
        position: "relative",
        left: "0px",
        top: "0px",
        zIndex: 1,
      },
    };
  };

  const updateElement = (updatedElement) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );

    // Also update selected element if it's the one being modified
    if (selectedElement && selectedElement.id === updatedElement.id) {
      setSelectedElement(updatedElement);
    }
  };

  const deleteElement = (elementId) => {
    setElements(elements.filter((el) => el.id !== elementId));
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  return (
    <div className="editor-container">
      <header className="editor-header">
        <h1>UIFusion</h1>
      </header>

      <div className="editor-layout">
        <EditorPanel addElement={addElement} />

        <PreviewPanel
          elements={elements}
          setSelectedElement={setSelectedElement}
          updateElement={updateElement}
          addElement={addElement}
        />

        {selectedElement && (
          <ElementProperties
            element={selectedElement}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
