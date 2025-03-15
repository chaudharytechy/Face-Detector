import React, { useState, useEffect } from 'react';

const JokeComponent = ({ mood }) => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    const fetchJoke = async () => {
      if (mood) {
        const response = await fetch('http://localhost:5000/getJoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood }),
        });
        const data = await response.json();
        setJoke(data.joke);
      }
    };

    fetchJoke();
  }, [mood]);

  return (
    <div>
      <h1>Your Mood: {mood}</h1>
      <p>Here's a joke for you: {joke}</p>
    </div>
  );
};

export default JokeComponent;
