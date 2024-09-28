import React, { useState } from 'react';
import axios from 'axios';
import './WordStreamer.css';

const WordStreamer = () => {
    const [inputText, setInputText] = useState('');
    const [displayedWords, setDisplayedWords] = useState([]);
    const [audioUrl, setAudioUrl] = useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const streamWords = async () => {
        const words = inputText.split(' ');
        setDisplayedWords([]);

        try {
            
            const response = await axios.post('https://word-streaming-4955ijhnp-dhirajs-projects-11ea79ba.vercel.app/', { text: inputText });
            setAudioUrl(response.data.audioUrl);

         
            const audio = new Audio(response.data.audioUrl);
            audio.play();

        
            for (const word of words) {
                setDisplayedWords(prev => [...prev, word]);
                await new Promise(resolve => setTimeout(resolve, 300)); 
            }
        } catch (error) {
            console.error("Error fetching audio:", error);
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
            <button onClick={streamWords}>Start Streaming</button>

            <div style={{ marginTop: '20px', fontSize: '24px' }}>
                {displayedWords.map((word, index) => (
                    <span key={index}>{word} </span>
                ))}
            </div>

            {audioUrl && (
                <div>
                    <h3>Audio is playing...</h3>
                </div>
            )}
        </div>
    );
};

export default WordStreamer;
