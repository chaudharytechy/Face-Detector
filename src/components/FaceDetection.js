// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";

// const FaceDetection = () => {
//   const videoRef = useRef(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [mood, setMood] = useState("");
//   const [joke, setJoke] = useState("");
//   const [detecting, setDetecting] = useState(true);

//   const loadModels = async () => {
//     try {
//       await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//       await faceapi.nets.faceExpressionNet.loadFromUri("/models");
//       setModelsLoaded(true);
//     } catch (error) {
//       console.error("Error loading models:", error);
//     }
//   };

//   const startVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: {} })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       })
//       .catch((err) => console.error("Error accessing webcam:", err));
//   };

//   const detectMood = async () => {
//     if (videoRef.current && detecting) {
//       const detections = await faceapi
//         .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceExpressions();

//       if (detections && detections.expressions) {
//         const expressions = detections.expressions;
//         const maxExpression = Object.keys(expressions).reduce((a, b) =>
//           expressions[a] > expressions[b] ? a : b
//         );
//         setMood(maxExpression);
//         generateJoke();
//         setDetecting(false);
//       }
//     }
//   };

//   const generateJoke = async () => {
//     try {
//       const response = await fetch(`https://v2.jokeapi.dev/joke/Any?type=single`);
//       const data = await response.json();
//       setJoke(data.joke || "Couldn't fetch a joke.");
//     } catch (error) {
//       console.error("Error fetching joke:", error);
//     }
//   };

//   useEffect(() => {
//     loadModels();
//     startVideo();
//   }, []);

//   useEffect(() => {
//     if (modelsLoaded && detecting) {
//       const interval = setInterval(detectMood, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [modelsLoaded, detecting]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
//       <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">
//         Mood-Based Joke Generator
//       </h2>
      
//       <div className="relative">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           width="500"
//           height="400"
//           className="rounded-lg shadow-lg border-4 border-blue-500"
//         />
//       </div>

//       <div className="bg-gray-800 p-4 rounded-lg shadow-md w-96 mt-4">
//         <p className="text-lg font-semibold">
//           <span className="text-yellow-400">Detected Mood:</span> {mood || "Waiting..."}
//         </p>
//         <p className="text-lg mt-2">
//           <span className="text-green-400 font-semibold">Joke:</span> {joke || "No joke yet"}
//         </p>
//       </div>

//       {!detecting && (
//         <button
//           onClick={() => setDetecting(true)}
//           className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
//         >
//           🔄 Detect Again
//         </button>
//       )}
//     </div>
//   );
// };

// export default FaceDetection;


import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceDetection = () => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [mood, setMood] = useState("Waiting...");
  const [joke, setJoke] = useState("No joke yet");
  const [detecting, setDetecting] = useState(false);

  const loadModels = async () => {
    try {
      const modelPath = window.location.origin + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
      await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const startVideo = async () => {
    try {
      const constraints = {
        video: { facingMode: "user" },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Please allow camera access and refresh the page.");
    }
  };

  const detectMood = async () => {
    if (!videoRef.current || !detecting) return;
    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const expressions = detections.expressions;
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setMood(maxExpression);
        fetchJoke();
      }
    } catch (error) {
      console.error("Error detecting face:", error);
    }
  };

  const fetchJoke = async () => {
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
      const data = await response.json();
      setJoke(data.joke || "Couldn't fetch a joke.");
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Error fetching joke");
    }
  };

  useEffect(() => {
    loadModels();
    startVideo();
  }, []);

  useEffect(() => {
    if (modelsLoaded && detecting) {
      const interval = setInterval(detectMood, 3000);
      return () => clearInterval(interval);
    }
  }, [modelsLoaded, detecting]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">
        Mood-Based Joke Generator
      </h2>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="500"
          height="400"
          className="rounded-lg shadow-lg border-4 border-blue-500"
        />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md w-96 mt-4">
        <p className="text-lg font-semibold">
          <span className="text-yellow-400">Detected Mood:</span> {mood}
        </p>
        <p className="text-lg mt-2">
          <span className="text-green-400 font-semibold">Joke:</span> {joke}
        </p>
      </div>

      <button
        onClick={() => setDetecting((prev) => !prev)}
        className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
      >
        {detecting ? "⏹ Stop Detection" : "🔄 Start Detection"}
      </button>
    </div>
  );
};

export default FaceDetection;
