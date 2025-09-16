import React, { useEffect, useState } from "react";
import { FolderTree } from "lucide-react";
import { fetchProjectFlow } from "../utils/api"; // fetch all files

export default function Sidebar({ onSelectFile }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchProjectFlow()
      .then((data) => {
        const fileNodes = (data.nodes || []).filter(n => n.type === "fileNode");
        setFiles(fileNodes);
      })
      .catch((err) => {
        console.error("Error loading project files:", err);
      });
  }, []);

  return (
    <aside className="sidebar" style={{ width: "250px", color: "#fff", height: "100vh", overflowY: "auto" }}>
      <div className="sidebar-header" style={{ display: "flex", alignItems: "center", padding: "8px" }}>
        <FolderTree size={20} />
        <span style={{ marginLeft: "8px", fontWeight: "bold" }}>Project</span>
      </div>
      <div className="sidebar-body" style={{ padding: "2px" }}>
        {files.length === 0 ? (
          <p style={{ color: "#aaa" }}>No files available.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {files.map((file) => {
              const label = file.data?.label || file.id.split("/").pop();
              const rel = file.data?.rel || file.id.split("/").pop();

              return (
                <div key={file.id} onClick={() => onSelectFile(file)}
                  style={{
                    padding: "8px 1px",
                    cursor: "pointer",
                  }}>
                  <li>
                    {label}

                  </li>
                  {/* <p style={{
                    fontSize:"6px",
                    color:"GrayText"
                  }}>{rel}</p> */}
                </div>

              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
