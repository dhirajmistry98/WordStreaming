import React, { useState } from 'react';
import axios from 'axios';
import './WordStreamer.css';

const WordStreamer = () => {
    const [inputText, setInputText] = useState('');
    const [displayedWords, setDisplayedWords] = useState([]);
    const [audioUrl, setAudioUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioInstance, setAudioInstance] = useState(null); // Track the current audio instance

    const handleInputChange = (event) => {
        const newText = event.target.value;
        setInputText(newText);
        setDisplayedWords(newText.split(' ')); // Update displayed words as you type
    };

    const stopCurrentAudio = () => {
        if (audioInstance) {
            audioInstance.pause(); // Stop current audio
            audioInstance.currentTime = 0; // Reset audio to the beginning
        }
    };

    const streamWords = async () => {
        if (!inputText.trim()) return; // Do nothing if input is empty

        setIsLoading(true); // Start loading
        stopCurrentAudio(); // Stop any currently playing audio

        try {
            // Request new audio for the updated input text
            const response = await axios.post("http://localhost:5008/api/speech", { text: inputText });

            // Append timestamp to prevent browser cache issues
            const newAudioUrl = `${response.data.audioUrl}?timestamp=${new Date().getTime()}`;
            setAudioUrl(newAudioUrl);
            console.log("Generated Audio URL:", newAudioUrl); // Debug log

            // Create a new audio instance for the updated input
            const newAudioInstance = new Audio(newAudioUrl);
            setAudioInstance(newAudioInstance); // Update the state with the new audio instance

            // Wait for the audio to load before playing it
            newAudioInstance.addEventListener('canplaythrough', async () => {
                try {
                    await newAudioInstance.play(); // Play the new audio
                    console.log("Audio is playing"); // Debug log

                    // Stream the words one by one with a delay
                    const words = inputText.split(' ');
                    let newDisplayedWords = [];
                    for (const word of words) {
                        newDisplayedWords = [...newDisplayedWords, word];
                        setDisplayedWords([...newDisplayedWords]);
                        await new Promise(resolve => setTimeout(resolve, 300)); // 300 ms delay
                    }
                    setIsLoading(false); // Stop loading after the words are displayed
                } catch (playError) {
                    console.error("Audio play error:", playError); // Debug log
                }
            });

            // Clear the audio instance when it ends
            newAudioInstance.addEventListener('ended', () => {
                setAudioInstance(null); // Clear the audio instance
            });
        } catch (error) {
            console.error("Error generating or playing audio:", error);
            setIsLoading(false); // Stop loading if there's an error
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <textarea
                rows="5"
                cols="50"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter a paragraph..."
            />
            <br />
            <button onClick={streamWords} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Start Streaming'}
            </button>
            <div style={{ marginTop: '20px', fontSize: '24px' }}>
                {displayedWords.map((word, index) => (
                    <span key={index}>{word} </span>
                ))}
            </div>
            {audioUrl && (
                <div>
                    <p>Audio URL: <a href={audioUrl} target="_blank" rel="noreferrer">Listen</a></p>
                </div>
            )}
        </div>
    );
};

export default WordStreamer;
