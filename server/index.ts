import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = 3000;
const SECRET_KEY = "your-very-secret-key";

app.use(cors());
app.use(express.json());

// Mock user for testing
const MOCK_USER = {
  id: "1",
  email: "test@example.com",
  password: "password",
  name: "Test User"
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const token = jwt.sign({ id: MOCK_USER.id, email: MOCK_USER.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid email or password" });
});

app.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
    // In a real app, you'd find the user in the DB
    if (decoded.email === MOCK_USER.email) {
      const { password, ...userWithoutPassword } = MOCK_USER;
      return res.json(userWithoutPassword);
    }
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
