import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./editor.css";

const EditorHeader = ({ elements, designId = null }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 1280, height: 800 });
  const previewSizes = [
    { name: "Desktop", width: 1280, height: 800 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Mobile", width: 375, height: 667 },
  ];
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  const saveDesign = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to save your design");
      navigate("/login");
      return;
    }

    setIsSaving(true);
    setSaveStatus("Saving...");

    try {
      const design = {
        elements,
        name: projectName.trim() || "Untitled Project",
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        lastModified: serverTimestamp(),
      };

      if (designId) {
        await updateDoc(doc(db, "designs", designId), design);
        setSaveStatus("Design updated successfully!");
      } else {
        design.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, "designs"), design);
        window.history.replaceState(
          null,
          "",
          `/unifusion-ui-builder/${docRef.id}`
        );
        setSaveStatus("Design saved successfully!");
      }
    } catch (error) {
      console.error("Error saving design:", error);
      setSaveStatus("Error saving design!");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const downloadDesign = () => {
    const designData = {
      elements,
      exportedAt: new Date().toISOString(),
      name: projectName,
    };

    const dataStr = JSON.stringify(designData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUri;
    downloadLink.download = `unifusion_${projectName
      .replace(/\s+/g, "_")
      .toLowerCase()}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <header className="editor-header">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="project-name-input"
        placeholder="Untitled Project"
      />

      <div className="header-actions">
        <button
          onClick={() => {
            if (auth.currentUser) {
              navigate(`/unifusion-dashboard/${auth.currentUser.uid}`);
            } else {
              alert("Please sign in to access the dashboard");
              navigate("/login");
            }
          }}
          className="dashboard-btn"
        >
          Dashboard
        </button>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className={`preview-btn ${previewMode ? "active" : ""}`}
        >
          {previewMode ? "Exit Preview" : "Preview"}
        </button>
        <button
          onClick={saveDesign}
          disabled={isSaving}
          className={isSaving ? "saving-btn" : ""}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button onClick={downloadDesign}>Download</button>
      </div>

      {saveStatus && <span className="save-status">{saveStatus}</span>}

      {previewMode && (
        <div className="preview-container">
          <div className="preview-toolbar">
            {previewSizes.map((size) => (
              <button
                key={size.name}
                className={previewSize.width === size.width ? "active" : ""}
                onClick={() => setPreviewSize(size)}
              >
                {size.name}
              </button>
            ))}
          </div>
          <div
            className="preview-frame"
            style={{ width: previewSize.width, height: previewSize.height }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className="preview-element"
                style={{
                  position: "absolute",
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  ...element.style,
                }}
              >
                {element.type === "text" && (
                  <div className="text-content">{element.content}</div>
                )}
                {element.type === "image" && (
                  <img
                    src={element.content}
                    alt="Uploaded"
                    className="preview-img"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default EditorHeader;
