import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
    res.json({
        ok: true,
        aiEnabled: Boolean(process.env.GEMINI_API_KEY),
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash"
    });
});

app.post("/api/commentary", async (req, res) => {
    const { expression, intensity, confidence, style = "Random", context = "" } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
            ok: false,
            error: "GEMINI_API_KEY is not configured. Local comedy mode is still available."
        });
    }

    if (!expression) {
        return res.status(400).json({ ok: false, error: "expression is required" });
    }

    const prompt = `
You are the hilarious fictional narrator of MindReader.exe.
You CANNOT read thoughts. You are generating playful, witty fictional commentary in ENGLISH based only on a facial-expression signal.
Write exactly ONE short sentence, maximum 20 words.
Tone: witty observational comedy, lighthearted teasing, sarcastic friend banter.
Style: ${style}.
Expression: ${expression}.
Intensity: ${Math.round((intensity || 0) * 100)}%.
Confidence: ${Math.round((confidence || 0) * 100)}%.
Context: ${context || "real-time webcam demo"}.
Examples:
- Happy: "That smile contains classified information, and I'm determined to find out what."
- Laughing: "Someone is having way too much fun for someone with unfinished work."
- Concentration: "Looks like someone is solving NASA-level quantum physics over there."
- Fear: "Did you just drop the production database, or did an unexpected meeting appear?"
- Confused: "Brain.exe has stopped responding. Would you like to restart the human?"
- Surprised: "Plot twist detected! The eyebrows have officially entered low Earth orbit."
- Thinking: "Deep internal contemplation detected. The mental gears are turning at 5000 RPM."
Keep it funny, playful, non-hateful, non-threatening, and suitable for a college hackathon demo.
Do not claim to know the person's actual thoughts.
`;

    try {
        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 1.05,
                    maxOutputTokens: 80
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                ok: false,
                error: data?.error?.message || "AI provider request failed"
            });
        }

        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ").trim();

        if (!text) {
            return res.status(502).json({ ok: false, error: "AI provider returned no text" });
        }

        res.json({ ok: true, text });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message || "AI request failed" });
    }
});

app.listen(port, () => {
    console.log(`MindReader backend listening on http://localhost:${port}`);
});
