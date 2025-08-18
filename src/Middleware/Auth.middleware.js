import jwt from "jsonwebtoken"

export const verifyJWT = (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    console.log("Token decoded:", decoded);
         req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
