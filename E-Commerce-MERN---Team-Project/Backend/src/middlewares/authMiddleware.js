const jwt = require("jsonwebtoken");
 
const verifyToken = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token or incorrect token format");
      return res.status(401).json({ msg: "No token found" });
    }
  
    let token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
    if (!token) return res.status(401).json({ msg: "Token missing, auth denied" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      //console.log("Decoded user:", req.user);
      next();
    } catch (error) {
      console.error("Error in token verification:", error);
      return res.status(400).json({ msg: "Invalid token" });
    }
  };
  

module.exports = verifyToken;
