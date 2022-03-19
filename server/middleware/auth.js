import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) res.status(401).send({ error: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized action" });
  }
}

export default auth;
