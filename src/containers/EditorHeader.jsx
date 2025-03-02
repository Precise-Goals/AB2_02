import React, { useState, useEffect } from 'react';
import "./editor.css"

const EditorHeader = ({ elements, designData, setDesignData }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 1280, height: 800 });
  const [previewSizes, setPreviewSizes] = useState([
    { name: 'Desktop', width: 1280, height: 800 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ]);

  // Save design data to local storage
  const saveDesign = () => {
    const design = {
      elements: elements,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('savedDesign', JSON.stringify(design));
    window.alert("Instance for save design into storage is created, however apology for inconvinience this feature is currently under development.");
  };

  // Download design as JSON file
  const downloadDesign = () => {
    const design = {
      elements: elements,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(design, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', 'unifusion_design_' + new Date().toISOString().split('T')[0] + '.json');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Render each element in the preview
  const renderPreviewElement = (element) => {
    const elementStyle = {
      position: 'absolute',
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      ...element.style
    };

    return (
      <div
        key={element.id}
        className={`preview-element ${element.type}-element`}
        style={elementStyle}
      >
        {element.type === 'text' && (
          <div className="text-content">
            {element.content}
          </div>
        )}

        {element.type === 'image' && (
          <img
            src={element.content}
            alt="User uploaded"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <header className="editor-header">
        <div className="header-actions">
          <button 
            className={`preview-btn ${previewMode ? 'active' : ''}`} 
            onClick={togglePreview}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          <button onClick={saveDesign}>Save</button>
          {/* <button onClick={downloadDesign}>Download</button> */}
        </div>
      </header>

      {previewMode && (
        <div className="preview-container">
          <div className="preview-toolbar">
            <div className="preview-size-selector">
              {previewSizes.map((size) => (
                <button 
                  key={size.name}
                  className={previewSize.width === size.width ? 'active' : ''}
                  onClick={() => setPreviewSize(size)}
                >
                  {size.name}
                </button>
              ))}
              <div className="preview-dimensions">
                {previewSize.width} × {previewSize.height}
              </div>
            </div>
          </div>
          <div className="preview-frame-container">
            <div 
              className="preview-frame" 
              style={{ 
                width: `${previewSize.width}px`,
                height: `${previewSize.height}px`,
                position: 'relative',
                overflow: 'auto',
                background: '#ffffff'
              }}
            >
              <div className="design-preview">
                {elements && elements.map((element) => renderPreviewElement(element))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorHeader;