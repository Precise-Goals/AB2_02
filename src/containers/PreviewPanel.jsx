import React, { useRef } from "react";
import DraggableElement from "./DraggableElement";
import "../styles/editor.css";

const PreviewPanel = ({ elements, setSelectedElement, updateElement, addElement }) => {
  const previewRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType");
    
    if (elementType) {
      // Calculate position relative to the preview panel
      const rect = previewRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create a new element with default properties
      const newElement = {
        id: `element-${Date.now()}`,
        type: elementType,
        content: getDefaultContent(elementType),
        style: {
          width: elementType === 'container' ? '300px' : '100px',
          height: elementType === 'container' ? '200px' : '40px',
          backgroundColor: elementType === 'container' ? '#f8f8f8' : '#ffffff',
          color: '#333333',
          fontSize: '16px',
          fontWeight: 'normal',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#dddddd',
          borderRadius: '4px',
          padding: '8px',
          margin: '4px',
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: 1
        }
      };
      
      // Add the new element to the elements array
      addElement(newElement);
    }
  };

  // Helper function to get default content based on element type
  const getDefaultContent = (type) => {
    switch(type) {
      case 'text': return 'New Text';
      case 'button': return 'Button';
      case 'input': return '';
      case 'image': return '';
      case 'container': return '';
      default: return '';
    }
  };

  return (
    <div 
      className="preview-panel"
      ref={previewRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="preview-header">
        <h2>Preview</h2>
      </div>
      <div className="preview-content">
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            setSelectedElement={setSelectedElement}
            updateElement={updateElement}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewPanel;