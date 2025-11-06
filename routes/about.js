const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about", {
    title: "Piano Recorder - About"
  });
});

module.exports = router;