// filename: components/FileDetailsPanel.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/fileDetails.css";
import { fetchExplanation, fetchSuggestion, fetchRefactor } from "../utils/api";

export default function FileDetailsPanel({
  symbol,
  fileNode,
  onClose,
  onEdit, // opens CodeEditorDrawer with path + code
}) {
  const [explanation, setExplanation] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [loadingRefactor, setLoadingRefactor] = useState(false);

const data = symbol ? symbol.data : fileNode?.data;
const filePath = fileNode?.data?.relPath || fileNode?.data?.absPath || "unknown";

  useEffect(() => {
    if (data) {
      handleExplain();
      handleSuggest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, fileNode]);

  const handleExplain = async () => {
    if (!data?.code && !data?.snippet) return;
    setLoadingExplain(true);
    try {
      const result = await fetchExplanation(data.code || data.snippet);
      setExplanation(result.explanation);
    } catch (err) {
      console.error("❌ Explanation fetch error:", err);
      setExplanation("❌ Failed to fetch explanation.");
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleSuggest = async () => {
    if (!data?.code && !data?.snippet) return;
    setLoadingSuggest(true);
    try {
      const result = await fetchSuggestion(data.code || data.snippet);
      setSuggestion(result.suggestion);
    } catch (err) {
      console.error("❌ Suggestion fetch error:", err);
      setSuggestion("❌ Failed to fetch suggestion.");
    } finally {
      setLoadingSuggest(false);
    }
  };

  // ✅ Apply refactor → calls backend and opens editor with optimized code
  const handleRefactor = async () => {
    if (!data?.code && !data?.snippet) return;
    setLoadingRefactor(true);
    try {
      const result = await fetchRefactor(data.code || data.snippet);
      onEdit(data?.absPath || data?.relPath, result.refactoredCode);
      await handleExplain();
      await handleSuggest();
    } catch (err) {
      console.error("❌ Refactor fetch error:", err);
      alert("❌ Failed to refactor code.");
    } finally {
      setLoadingRefactor(false);
    }
  };

  const renderSuggestion = (text) => {
    if (!text) return "No suggestion available.";
    const currentMatch = text.match(/Current:([^.]*)/i);
    const betterMatch = text.match(/Better:([^.]*)/i);
    const suggestMatch = text.match(/Suggestion:(.*)/i);

    return (
      <div>
        {currentMatch && (
          <p>
            <strong>Current:</strong> {currentMatch[1].trim()}
          </p>
        )}
        {betterMatch && (
          <p>
            <strong>Better:</strong> {betterMatch[1].trim()}
          </p>
        )}
        {suggestMatch && (
          <p>
            <strong>Suggestion:</strong> {suggestMatch[1].trim()}
          </p>
        )}
        {!currentMatch && !suggestMatch && <p>{text}</p>}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {data && (
        <motion.aside
          className="details-panel"
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: "spring" }}
        >
          {/* Header */}
          <div className="panel-header">
            <div>
              <h3>{data?.label || data?.name || "File"}</h3>
              <div className="muted">
                {filePath}
              </div>
            </div>
            <button onClick={onClose} className="close-btn">
              ✖
            </button>
          </div>

          {/* Code Preview */}
          <div className="card">
            <h4 className="card-title">Code</h4>
            <pre>
              <code className="language-js">
                {data?.code || data?.snippet}
              </code>
            </pre>
            <button
              className="edit-btn"
              onClick={() =>
                onEdit(
                  data?.absPath || data?.relPath,
                  data?.code || data?.snippet
                )
              }
            >
              ✏️ Edit Code
            </button>
          </div>

          {/* Explanation */}
          <div className="card">
            <h4 className="card-title">Explanation</h4>
            {loadingExplain ? (
              <p>⏳ Generating explanation...</p>
            ) : (
              <p>{explanation || "No explanation available."}</p>
            )}
          </div>

          {/* Suggestion + Apply Button */}
          <div
            className="card suggestion-card"
            style={{ borderRadius: "8px", padding: "12px" }}
          >
            <h4 className="card-title">AI Suggestion</h4>
            {loadingSuggest ? (
              <p>⏳ Analyzing complexity...</p>
            ) : (
              renderSuggestion(suggestion)
            )}
            <button
              className="apply-btn"
              onClick={handleRefactor}
              disabled={loadingRefactor}
              style={{
                marginTop: "10px",
                backgroundColor: "#16a34a", // ✅ green
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px", // ✅ curved
                cursor: "pointer",
              }}
            >
              {loadingRefactor ? "⏳ Applying..." : "</>  Apply "}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}