import React, { useState } from 'react';
import axios from 'axios';
import './WordStreamer.css';

const WordStreamer = () => {
    const [inputText, setInputText] = useState('');
    const [displayedWords, setDisplayedWords] = useState([]);
    const [audioUrl, setAudioUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioInstance, setAudioInstance] = useState(null); 

    const handleInputChange = (event) => {
        setInputText(event.target.value);
        setDisplayedWords(event.target.value.split(' ')); 
    };

    const stopCurrentAudio = () => {
        if (audioInstance) {
            audioInstance.pause(); 
            audioInstance.currentTime = 0; 
        }
    };

    const streamWords = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true); 

  
        stopCurrentAudio();

        try {
            
            const response = await axios.post("http://localhost:5008/api/speech", { text: inputText });

            
            const newAudioUrl = `${response.data.audioUrl}?timestamp=${new Date().getTime()}`;
            setAudioUrl(newAudioUrl);

            const newAudioInstance = new Audio(newAudioUrl);
            setAudioInstance(newAudioInstance); 
            
            newAudioInstance.addEventListener('canplaythrough', async () => {
                newAudioInstance.play(); 

                
                const words = inputText.split(' ');
                let newDisplayedWords = [];
                for (const word of words) {
                    newDisplayedWords = [...newDisplayedWords, word];
                    setDisplayedWords([...newDisplayedWords]);
                    await new Promise(resolve => setTimeout(resolve, 300)); 
                }
                setIsLoading(false); 
            });

           
            newAudioInstance.addEventListener('ended', () => {
                setAudioInstance(null); 
            });
        } catch (error) {
            console.error("Error generating or playing audio:", error);
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
            {audioUrl && (
                <div>
                    <p>Audio URL: <a href={audioUrl} target="_blank" rel="noreferrer">Listen</a></p>
                </div>
            )}
        </div>
    );
};

export default WordStreamer;
