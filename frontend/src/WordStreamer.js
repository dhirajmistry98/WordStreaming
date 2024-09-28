import React, { useState } from 'react';
import axios from 'axios';
import './WordStreamer.css';

const WordStreamer = () => {
    const [inputText, setInputText] = useState('');
    const [displayedWords, setDisplayedWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [audioInstance, setAudioInstance] = useState(null); 

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const streamWords = async () => {
        if (!inputText.trim()) return; 

        setIsLoading(true); // Start loading
        const words = inputText.split(' ');
        setDisplayedWords(words); 

        
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true }); 

            
            if (audioInstance) {
                audioInstance.pause();
                audioInstance.currentTime = 0; 
            }

       
            const response = await axios.post("http://localhost:5008/api/speech", { text: inputText });
            const newAudioUrl = response.data.audioUrl;
            console.log("Generated Audio URL:", newAudioUrl); 

            const newAudioInstance = new Audio(newAudioUrl);
            setAudioInstance(newAudioInstance); 

            
            newAudioInstance.play().then(() => {
                console.log("Audio is playing"); 
            }).catch((error) => {
                console.error("Audio play error:", error); 
            });

           
            newAudioInstance.addEventListener('ended', () => {
                setAudioInstance(null); 
            });

            setIsLoading(false); 
        } catch (error) {
            console.error("Error accessing audio:", error);
            setIsLoading(false); 
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
        </div>
    );
};

export default WordStreamer;
