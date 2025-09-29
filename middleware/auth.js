// // middleware/auth.js
// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const token = req.header("Authorization");

//   if (!token) return res.status(401).json({ error: "No token, access denied" });

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
//     req.user = decoded; // attach user info
//     next();
//   } catch (err) {
//     return res.status(400).json({ error: "Token is not valid" });
//   }
// };


// --- FILE: middleware/auth.js ---
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  // Support "Bearer <token>" or just "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ msg: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize so you can always use req.user.id
    req.user = {
      id: decoded.userId || decoded.id, // covers both payload styles
      ...decoded,
    };

    if (!req.user.id) {
      return res.status(401).json({ msg: "Invalid token payload: no user id" });
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ msg: "Token invalid or expired" });
  }
};
