const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.render("recordings", {
    title: "Piano Recorder - Recordings"
  });
});

module.exports = router;
