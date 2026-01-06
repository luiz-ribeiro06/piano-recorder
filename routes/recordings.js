const express = require('express');
const router = express.Router();
const Recording = require('../models/recording');

// Listar gravações
router.get('/', async (req, res) => {
  try {
    const recordings = await Recording.find().sort({ date: -1 });
    res.render('recordings', { title: 'Piano Recorder - My Recordings', recordings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading recordings');
  }
});

router.get('/:id/events', async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) {
      return res.status(404).json({ error: 'Recording not found' });
    }
    res.json({ events: recording.events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// Deletar
router.delete('/:id', async (req, res) => {
  try {
    await Recording.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recording deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting recording' });
  }
});

// Editar
router.put('/:id', async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    await Recording.findByIdAndUpdate(req.params.id, { title, artist });
    res.status(200).json({ message: 'Recording updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating recording' });
  }
});

router.post('/', async (req, res) => {
    try {
        const { title, artist, events } = req.body;
        
        if (!events || events.length === 0) {
            return res.status(400).json({ error: "No data to save" });
        }

        const newRecording = new Recording({ 
            title: title || "New Recording", 
            artist: artist || "", 
            events 
        });
        await newRecording.save();

        res.status(201).json({ message: "Saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while saving" });
    }
});

module.exports = router;