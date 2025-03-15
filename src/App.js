import React, { useState } from "react";
import FaceDetection from "./components/FaceDetection"; // Import the FaceDetection component
import JokeComponent from "./components/JokeComponent"; // Import the JokeComponent

const App = () => {
  const [mood, setMood] = useState(""); // State to hold the detected mood

  // This function updates the mood when face-api.js detects it
  const handleMoodDetection = (detectedMood) => {
    setMood(detectedMood);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
        Mood-Based Joke Generator 🎭😂
      </h1>

      {/* Face Detection Component */}
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <FaceDetection setMood={handleMoodDetection} />
      </div>

      {/* JokeComponent appears only when a mood is detected */}
      {mood && (
        <div className="mt-6 w-full max-w-xl bg-gray-700 p-6 rounded-lg shadow-md animate-fade-in">
          <JokeComponent mood={mood} />
        </div>
      )}
    </div>
  );
};

export default App;
