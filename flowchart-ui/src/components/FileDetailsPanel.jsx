// filename: components/FileDetailsPanel.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/fileDetails.css";
import { fetchExplanation, fetchSuggestion } from "../utils/api";

export default function FileDetailsPanel({
  symbol,
  fileNode,
  onClose,
  onEdit,
}) {
  const [explanation, setExplanation] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const data = symbol ? symbol.data : fileNode?.data;

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

  // Helper: format suggestion into multiple lines
  const renderSuggestion = (text) => {
    if (!text) return "No suggestion available.";
    const currentMatch = text.match(/Current:([^.]*)/i);
    const betterMatch = text.match(/Better:([^.]*)/i);
    const suggestMatch = text.match(/Suggestion:(.*)/i);

    return (
      <div>
        {currentMatch && <p><strong>Current:</strong> {currentMatch[1].trim()}</p>}
        {betterMatch && <p><strong>Better:</strong> {betterMatch[1].trim()}</p>}
        {suggestMatch && <p><strong>Suggestion:</strong> {suggestMatch[1].trim()}</p>}
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
                {data?.relPath || data?.absPath || "unknown"}
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

          {/* Suggestion */}
          <div className="card">
            <h4 className="card-title">AI Suggestion</h4>
            {loadingSuggest ? (
              <p>⏳ Analyzing complexity...</p>
            ) : (
              renderSuggestion(suggestion)
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
