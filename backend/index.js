const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gtts = require('gtts'); // Google Text-to-Speech package
const path = require('path'); // For handling file paths

const app = express();
const PORT = process.env.PORT || 5007;

app.use(cors({
  origin: 'https://word-streaming-zwb9.vercel.app' // Your frontend URL
}));
app.use(bodyParser.json());

// POST route to handle text-to-speech
app.post('/api/speech', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Text is required.");
  }

  try {
    const tts = new gtts(text, 'en');
    const audioFile = path.join(__dirname, 'audio.mp3'); // Define the path for the audio file
    tts.save(audioFile, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error generating audio.");
      }
      // Respond with the correct URL where the audio file can be accessed
      res.json({ audioUrl: `${req.protocol}://${req.get('host')}/audio` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating speech audio.');
  }
});

// Serve the generated audio file
app.get('/audio', (req, res) => {
  res.sendFile(path.join(__dirname, 'audio.mp3'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

