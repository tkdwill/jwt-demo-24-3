const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "your-secret-key");
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};

const users = [
    {
        id: 1,
        username: "user1",
        password: "password1",
    },
    {
        id: 2,
        username: "user2",
        password: "password2",
    },
];

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { user: { id: user.id, username: user.username } },
        "your-secret-key",
        { expiresIn: "1h" }
    );

    res.json({ token });
});

app.get("/", (req, res) => {
    res.json({ message: "You've reached the root route" });
});

app.get("/protected-route", authenticateJWT, (req, res) => {
    res.json({ message: "This is a protected route" });
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
