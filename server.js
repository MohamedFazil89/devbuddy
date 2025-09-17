// filename: server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { generateReactFlowData, generateFileFlowData } from "./utils/reactFlowGenerator.js";
import { saveSnapshot, undo } from "./utils/codeHistory.js"; 
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Serve React build (for production)
app.use(express.static(path.join(__dirname, "flowchart-ui/public")));

// ✅ Project-level flow
app.get("/api/flow/project", (req, res) => {
  try {
    const projectPath =
      req.query.path || path.resolve(process.cwd(), "sample/frontend");
    const flowData = generateReactFlowData(projectPath);
    res.json(flowData);
  } catch (err) {
    console.error("❌ Error generating project flow:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ File-level flow
app.get("/api/flow/file", (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath)
      return res.status(400).json({ error: "Missing ?path=..." });

    const flowData = generateFileFlowData(filePath);
    res.json(flowData);
  } catch (err) {
    console.error("❌ Error generating file flow:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ OpenAI init
console.log("🔑 OpenAI Key present?", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Explain code snippet
// app.post("/api/explain", async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) return res.status(400).json({ error: "Missing code snippet" });

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a code assistant. Explain code very briefly and clearly in 2-3 sentences max.",
//         },
//         {
//           role: "user",
//           content: `Explain this code snippet:\n\n${code}`,
//         },
//       ],
//     });

//     const explanation = response.choices[0].message.content.trim();
//     res.json({ explanation });
//   } catch (err) {
//     console.error("❌ Error in /api/explain:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to explain code" });
//   }
// });

// ✅ AI Suggestion (always return JSON object)
// app.post("/api/suggest", async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) return res.status(400).json({ error: "Missing code snippet" });

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a code reviewer. Respond ONLY in valid JSON like this:\n" +
//             '{"suggestion": "Current: Time O(?), Space O(?). Suggestion: <one-line improvement>"}\n' +
//             "No extra text, no markdown, only JSON.",
//         },
//         {
//           role: "user",
//           content: code,
//         },
//       ],
//       max_tokens: 100,
//     });

//     const text = response.choices[0].message.content.trim();

//     // Ensure valid JSON response
//     let suggestionObj;
//     try {
//       suggestionObj = JSON.parse(text);
//     } catch (e) {
//       console.error("⚠️ Could not parse AI response, fallback:", text);
//       suggestionObj = { suggestion: text };
//     }

//     console.log("✨ Final Suggestion Object:", suggestionObj);
//     res.json(suggestionObj);
//   } catch (err) {
//     console.error("❌ Error in /api/suggest:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to suggest improvements" });
//   }
// });

// ✅ AI Refactor API (analyzes + optimizes, returns only best code)
// ✅ AI Refactor API (analyzes + optimizes, returns only best code)
// app.post("/api/refactor", async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) return res.status(400).json({ error: "Missing code snippet" });

//     // Ask AI to analyze + refactor
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a strict code reviewer. First, analyze the given code for its time/space complexity. " +
//             "Then rewrite it in the most efficient way possible. " +
//             "Return ONLY the optimized code. Do not include explanations, markdown, or JSON wrapper.",
//         },
//         {
//           role: "user",
//           content: code,
//         },
//       ],
//       max_tokens: 500,
//     });

//     const optimizedCode = response.choices[0].message.content.trim();

//     // 🔍 Logs
//     console.log("🔎 Refactor Request Received");
//     console.log("📥 Original Code:\n", code);
//     console.log("✨ Optimized Code Generated:\n", optimizedCode);

//     res.json({ refactoredCode: optimizedCode });
//   } catch (err) {
//     console.error("❌ Error in /api/refactor:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to refactor code" });
//   }
// });




// ✅ Update code in file
app.post("/api/code/update", (req, res) => {
  try {
    const { filePath, newCode } = req.body;
    console.log("📝 Update request:", filePath); 
    if (!filePath || !newCode)
      return res.status(400).json({ error: "Missing filePath or newCode" });

    const result = saveSnapshot(filePath, newCode);
    console.log("✅ Saved file:", filePath);
    res.json(result);
  } catch (err) {
    console.error("❌ Error in /api/code/update:", err);
    res.status(500).json({ error: "Failed to update file" });
  }
});



app.post("/api/code/undo", (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath)
      return res.status(400).json({ error: "Missing filePath" });

    const result = undo(filePath);
    res.json(result);
  } catch (err) {
    console.error("❌ Error in /api/code/undo:", err);
    res.status(500).json({ error: "Failed to undo" });
  }
});


app.use((req, res) => {
  res.sendFile(path.join(__dirname, "flowchart-ui/public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});