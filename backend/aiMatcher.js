import fetch from "node-fetch";

const GEMINI_KEY = "AIzaSyCFeun7zKOU_EHC3zuEmfI6zwNeQm1hKhc";

export async function isMatch(itemA, itemB) {
  const prompt = `
Two campus lost & found reports:

ITEM 1:
Title: ${itemA.title}
Description: ${itemA.description}
Location: ${itemA.location}

ITEM 2:
Title: ${itemB.title}
Description: ${itemB.description}
Location: ${itemB.location}

Are these describing the SAME real-world object?
Return ONLY a number from 0 to 100 representing similarity.
No text.
`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await res.json();

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "0";
  const score = parseInt(raw.replace(/\D/g, "")) || 0;

  console.log("AI match score:", score);

  return score >= 70; // threshold
}
