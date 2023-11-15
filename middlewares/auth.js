const jwt = require("jsonwebtoken");

exports.validateSingin = (req, res, next) => {
  try {
    if (req.body.token) {
      const token = req.body.token;
      if (!token) {
        res.status(404).json({ success: false, data: "Cookie not found" });
      } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
          if (!user) {
            res.status(400).json({ success: false, data: "Invalid token" });
          }
          if (err) {
            res.status(400).json({ success: false, data: "Invalid token" });
          }
          req.id = user?.user;
        });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
  next();
};
