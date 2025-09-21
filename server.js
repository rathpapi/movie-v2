import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// ===== DB connect =====
mongoose.connect("mongodb://127.0.0.1:27017/moviesite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ===== Schema =====
const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  video: String,
  category: String,
  rating: String,
  episodes: [
    {
      title: String,
      video: String
    }
  ],
  ads: [
    {
      type: String, // e.g. "montage", "banner", "video"
      url: String,  // ad video/image url
      position: String // e.g. "pre", "mid", "post", "banner"
    }
  ]
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String, // hashed
});

const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

// ===== Create default admin =====
async function createDefaultAdmin() {
  const existing = await User.findOne({ username: "admin" });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ username: "admin", password: hashed });
    console.log("✅ Default admin created: username=admin, password=admin123");
  } else {
    console.log("ℹ️ Admin already exists");
  }
}
createDefaultAdmin();

// ===== Middleware: Auth =====
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, "SECRET_KEY");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ===== Auth Routes =====
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashed });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Wrong password" });
  const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token });
});

// ===== Movie Routes =====
app.get("/api/movies", async (req, res) => {
  res.json(await Movie.find());
});

app.post("/api/movies", auth, async (req, res) => {
  const m = new Movie(req.body);
  await m.save();
  res.json(m);
});

app.put("/api/movies/:id", auth, async (req, res) => {
  const m = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(m);
});

app.delete("/api/movies/:id", auth, async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ===== Serve static files =====
app.use(express.static(__dirname)); // Serves static files

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ===== Start =====
app.listen(4000, () => console.log("API running at http://localhost:4000"));
