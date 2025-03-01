import React from "react";

export const EditorPanel = ({ selectedElement, updateElement }) => {
  if (!selectedElement)
    return (
      <div className="editor-panel">
        <div className="panel-header">Properties</div>
        <div className="panel-content">
          <p className="no-selection">No element selected</p>
        </div>
      </div>
    );

  const handleChange = (property, value) => {
    updateElement(selectedElement.id, { [property]: value });
  };

  return (
    <div className="editor-panel">
      <div className="panel-header">Properties</div>
      <div className="panel-content">
        <div className="property-group">
          <h3>Dimensions</h3>
          <div className="property-row">
            <label>Width:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) =>
                  handleChange("width", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
          <div className="property-row">
            <label>Height:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) =>
                  handleChange("height", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
        </div>

        <div className="property-group">
          <h3>Position</h3>
          <div className="property-row">
            <label>X:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) =>
                  handleChange("x", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
          <div className="property-row">
            <label>Y:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) =>
                  handleChange("y", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
        </div>

        <div className="property-group">
          <h3>Styling</h3>
          <div className="property-row">
            <label>Background:</label>
            <input
              type="color"
              value={selectedElement.backgroundColor || "#ffffff"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
            />
          </div>
          {selectedElement.type === "text" && (
            <div className="property-row">
              <label>Text Color:</label>
              <input
                type="color"
                value={selectedElement.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
              />
            </div>
          )}
          <div className="property-row">
            <label>Border Color:</label>
            <input
              type="color"
              value={selectedElement.borderColor || "#000000"}
              onChange={(e) => handleChange("borderColor", e.target.value)}
            />
          </div>
          <div className="property-row">
            <label>Border Width:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.borderWidth || 0}
                onChange={(e) =>
                  handleChange("borderWidth", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
          <div className="property-row">
            <label>Border Radius:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.borderRadius || 0}
                onChange={(e) =>
                  handleChange("borderRadius", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
        </div>

        <div className="property-group">
          <h3>Spacing</h3>
          <div className="property-row">
            <label>Padding:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.padding || 0}
                onChange={(e) =>
                  handleChange("padding", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
          <div className="property-row">
            <label>Margin:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={selectedElement.margin || 0}
                onChange={(e) =>
                  handleChange("margin", parseInt(e.target.value) || 0)
                }
              />
              <span>px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
