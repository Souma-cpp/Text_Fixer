import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function fixText(text) {
  if (!text || typeof text !== "string") return "";

  let cleaned = text.toLowerCase();

  const replacements = {
    u: "you",
    r: "are",
    ur: "your",
    tmrw: "tomorrow",
    l8r: "later",
    cya: "see you",
    bro: "brother",
    asap: "as soon as possible",
    idk: "I don't know",
    btw: "by the way",
    lol: "laughing out loud",
    omg: "oh my god",
    wtf: "what the heck",
    bcuz: "because",
    bcz: "because",
    dont: "don't",
    doesnt: "doesn't",
    didnt: "didn't",
    wasnt: "wasn't",
    wont: "won't",
    cant: "can't",
    couldnt: "couldn't",
    wouldnt: "wouldn't",
    havent: "haven't",
    isnt: "isn't",
    its: "it's",
    im: "i'm",
    ive: "i've",
    ill: "i'll",
    "ain't": "is not",
    lemme: "let me",
    gonna: "going to",
    wanna: "want to",
    gotta: "got to",
    shoulda: "should have",
    coulda: "could have",
    woulda: "would have",
  };

  for (let key in replacements) {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    cleaned = cleaned.replace(regex, replacements[key]);
  }

  cleaned = cleaned.replace(/(^\s*\w|[.!?]\s*\w)/g, function (c) {
    return c.toUpperCase();
  });

  cleaned = cleaned
    .replace(/\s+/g, " ") 
    .replace(/\s([?.!])/g, "$1") 
    .replace(/([?.!])(?=[^\s])/g, "$1 ") 
    .trim();

  cleaned = cleaned.replace(/\b([A-Z][a-z]+)(is|are|was|am|were)\b/g, "$1 $2");

  return cleaned;
}

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/result", (req, res) => {
  const input = req.body.rawText;
  const fixed = fixText(input);
  res.render("result", { fixedText: fixed });
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
