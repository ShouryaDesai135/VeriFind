import express from "express";
import cors from "cors";
import { db } from "./firebase.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VeriFind Backend Running");
});

/**
 * CREATE ITEM
 */
app.post("/api/items", async (req, res) => {
  try {
    const item = req.body;

    const finalItem = {
      ...item,
      status: "available",
      createdAt: new Date().toISOString(),
      claimedBy: null,
      claimedAt: null,
      resolvedAt: null,
    };

    const docRef = await db.collection("items").add(finalItem);

    // respond immediately
    res.json({ success: true, id: docRef.id });

    // DO NOT BLOCK — run AI matching async
    runMatching(docRef.id, finalItem);

  } catch (err) {
    console.error("Post error:", err);
    res.status(500).json({ error: "Failed to post item" });
  }
});

async function runMatching(itemId, item) {
  try {
    const opposite = item.type === "lost" ? "found" : "lost";

    const snap = await db
      .collection("items")
      .where("type", "==", opposite)
      .where("status", "==", "available")
      .get();

    for (const doc of snap.docs) {
      const other = doc.data();

      const score = similarity(item.title, other.title) +
                    similarity(item.description || "", other.description || "");

      if (score > 0.6) {
        await db.collection("matches").add({
          lost: item.type === "lost" ? itemId : doc.id,
          found: item.type === "found" ? itemId : doc.id,
          score,
          createdAt: new Date().toISOString()
        });
      }
    }

  } catch (e) {
    console.log("AI match skipped:", e.message);
  }
}

app.listen(4000, () => {
  console.log("🔥 VeriFind backend running on port 4000");
});
