import React from "react";
import "../styles/editor.css";

const ElementProperties = ({ element, updateElement, deleteElement }) => {
  const handleStyleChange = (property, value) => {
    const updatedElement = {
      ...element,
      style: {
        ...element.style,
        [property]: value
      }
    };
    updateElement(updatedElement);
  };

  const handleContentChange = (event) => {
    const updatedElement = {
      ...element,
      content: event.target.value
    };
    updateElement(updatedElement);
  };

  return (
    <div className="properties-panel">
      <h2>Properties</h2>
      
      <div className="property-group">
        <h3>Element: {element.type}</h3>
        <button 
          className="delete-button"
          onClick={() => deleteElement(element.id)}
        >
          Delete Element
        </button>
      </div>

      {(element.type === 'text' || element.type === 'button') && (
        <div className="property-group">
          <h3>Content</h3>
          <div className="property-row">
            <input 
              type="text" 
              value={element.content || ''} 
              onChange={handleContentChange}
              className="full-width-input"
            />
          </div>
        </div>
      )}
      
      <div className="property-group">
        <h3>Dimensions</h3>
        <div className="property-row">
          <label>Width:</label>
          <input 
            type="text" 
            value={element.style.width} 
            onChange={(e) => handleStyleChange('width', e.target.value)}
          />
        </div>
        <div className="property-row">
          <label>Height:</label>
          <input 
            type="text" 
            value={element.style.height} 
            onChange={(e) => handleStyleChange('height', e.target.value)}
          />
        </div>
        <div className="property-row">
          <label>Z-Index:</label>
          <input 
            type="number" 
            value={element.style.zIndex || 1} 
            onChange={(e) => handleStyleChange('zIndex', e.target.value)}
          />
        </div>
      </div>
      
      <div className="property-group">
        <h3>Appearance</h3>
        <div className="property-row">
          <label>Background:</label>
          <input 
            type="color" 
            value={element.style.backgroundColor} 
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
        </div>
        <div className="property-row">
          <label>Text Color:</label>
          <input 
            type="color" 
            value={element.style.color} 
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </div>
        <div className="property-row">
          <label>Font Size:</label>
          <select 
            value={element.style.fontSize} 
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
          </select>
        </div>
        <div className="property-row">
          <label>Font Weight:</label>
          <select 
            value={element.style.fontWeight} 
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
          </select>
        </div>
      </div>
      
      <div className="property-group">
        <h3>Border</h3>
        <div className="property-row">
          <label>Width:</label>
          <select 
            value={element.style.borderWidth} 
            onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
          >
            <option value="0px">0px</option>
            <option value="1px">1px</option>
            <option value="2px">2px</option>
            <option value="3px">3px</option>
            <option value="4px">4px</option>
          </select>
        </div>
        <div className="property-row">
          <label>Style:</label>
          <select 
            value={element.style.borderStyle} 
            onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
        <div className="property-row">
          <label>Color:</label>
          <input 
            type="color" 
            value={element.style.borderColor} 
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
          />
        </div>
        <div className="property-row">
          <label>Radius:</label>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={parseInt(element.style.borderRadius)} 
            onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
          />
          <span>{element.style.borderRadius}</span>
        </div>
      </div>
      
      <div className="property-group">
        <h3>Spacing</h3>
        <div className="property-row">
          <label>Padding:</label>
          <input 
            type="text" 
            value={element.style.padding} 
            onChange={(e) => handleStyleChange('padding', e.target.value)}
          />
        </div>
        <div className="property-row">
          <label>Margin:</label>
          <input 
            type="text" 
            value={element.style.margin} 
            onChange={(e) => handleStyleChange('margin', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ElementProperties;