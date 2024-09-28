const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gtts = require('gtts'); // Google Text-to-Speech package

const app = express();
const PORT = process.env.PORT || 5007;

app.use(cors());
app.use(bodyParser.json());

// POST route to handle text-to-speech
app.post('/api/speech', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Text is required.");
  }

  try {
    const tts = new gtts(text, 'en');
    const audioFile = './audio.mp3'; // Saving audio locally
    tts.save(audioFile, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error generating audio.");
      }
      res.json({ audioUrl: `http://localhost:${PORT}/audio` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating speech audio.');
  }
});

// Serve the generated audio file
app.get('/audio', (req, res) => {
  res.sendFile(__dirname + '/audio.mp3');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
