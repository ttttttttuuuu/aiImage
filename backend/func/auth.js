import jwt from "jsonwebtoken";

export default async function authUser(req, res, next) {
  let authHeader = null;
  try {
    authHeader = req.body.headers.Authorization;
  } catch (error) {
    authHeader = req.headers.authorization;
  }

  let token = authHeader.split(" ");
  token = token[token.length - 1];

  if (token === "null") return res.status(200).json({ success: false });
  if (token) {
    const decoded = jwt.verify(token, "jwtSecret");
    req.decoded = decoded;

    next();
  } else {
    return res
      .status(200)
      .json({ success: false, message: "You need to Sign In !" });
  }
}
