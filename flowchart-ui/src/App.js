import React, { useState, useEffect } from "react";
import ProjectFlow from "./components/ProjectFlow";
import FileFlow from "./components/FileFlow";
import FileDetailsPanel from "./components/FileDetailsPanel";
import HeaderBar from "./components/HeaderBar";
import Sidebar from "./components/Sidebar";
import CodeEditorDrawer from "./components/CodeEditorDrawer";
import { updateCode, undoCode } from "./utils/api";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("project"); // "project" | "file"
  const [activeFile, setActiveFile] = useState(null);
  const [activeSymbol, setActiveSymbol] = useState(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [editorFilePath, setEditorFilePath] = useState("");

  // Open editor from sidebar panel
 const handleEdit = (filePath, code) => {
  if (!filePath && activeFile) {
    filePath = activeFile.data?.absPath || activeFile.data?.relPath;
  }
  setEditorFilePath(filePath);
  setEditorCode(code);
  setIsEditorOpen(true);
};


  const handleSave = async () => {
    await updateCode(editorFilePath, editorCode);
    alert("✅ File updated");
    setIsEditorOpen(false);
  };

  const handleUndo = async () => {
    const result = await undoCode(editorFilePath);
    if (result.success) {
      setEditorCode(result.code);
    }
  };

  const handleClose = () => {
    if (activeSymbol) {
      setActiveSymbol(null); // close function
    } else {
      setView("project");
      setActiveFile(null);
    }
  };

  return (
    <div className="app-root">
      <Sidebar
        view={view}
        activeFile={activeFile}
        onSelectFile={(file) => {
          setActiveFile(file);
          setView("file");
        }}
        onSelectSymbol={(sym) => setActiveSymbol(sym)}
        onBack={() => {
          setView("project");
          setActiveFile(null);
          setActiveSymbol(null);
        }}
      />

      <div className="main-column">
        <HeaderBar
          onBack={() => {
            setView("project");
            setActiveFile(null);
            setActiveSymbol(null);
          }}
          showBack={view === "file"} // ✅ only show in file-level
        />

        <div className="canvas-area">
          {view === "project" ? (
            <ProjectFlow
              onFileClick={(fileNode) => {
                setActiveFile(fileNode);
                setView("file");
              }}
            />
          ) : (
            <FileFlow fileNode={activeFile} onSelectSymbol={setActiveSymbol} />
          )}
        </div>

        {/* Sidebar file details */}
        <FileDetailsPanel
          symbol={activeSymbol}
          fileNode={activeFile}
          onClose={handleClose}
          onEdit={handleEdit}
        />

        {/* Bottom editor drawer */}
        <CodeEditorDrawer
          isOpen={isEditorOpen}
          code={editorCode}
          setCode={setEditorCode}
          onSave={handleSave}
          onUndo={handleUndo}
          onCancel={() => setIsEditorOpen(false)}
        />
      </div>
    </div>
  );
}
