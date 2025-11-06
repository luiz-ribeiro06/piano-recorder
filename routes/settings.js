const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.render("settings", {
    title: "Piano Recorder - Settings"
  });
});

module.exports = router;
