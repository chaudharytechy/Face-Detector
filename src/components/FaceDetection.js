import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceDetection = () => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [mood, setMood] = useState("Waiting...");
  const [joke, setJoke] = useState("No joke yet");
  const [translatedJoke, setTranslatedJoke] = useState("");
  const [language, setLanguage] = useState("en");
  const [startFaceDetect, setStartFaceDetect] = useState(false);

  // Load face-api models
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

  // Start webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Please allow camera access and refresh the page.");
    }
  };

  // Stop webcam and reset state
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Reset UI and state
    setMood("Waiting...");
    setJoke("No joke yet");
    setTranslatedJoke("");
    setModelsLoaded(false);
  };

  // Detect facial expression
  const detectMood = async () => {
    if (!videoRef.current) return;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection?.expressions) {
        const expressions = detection.expressions;
        const detectedMood = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        setMood(detectedMood); // Always set mood
        fetchJoke(); // Always fetch new joke
      }
    } catch (error) {
      console.error("Error detecting mood:", error);
    }
  };

  // Fetch joke
  const fetchJoke = async () => {
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
      const data = await response.json();
      const jokeText = data.joke || "Couldn't fetch a joke.";
      setJoke(jokeText);
      translateJoke(jokeText);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Error fetching joke");
    }
  };

  // Translate joke
  const translateJoke = async (text) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${language}|${
          language === "en" ? "hi" : "en"
        }`
      );
      const data = await response.json();
      setTranslatedJoke(data.responseData.translatedText || "Translation error");
    } catch (error) {
      console.error("Error translating joke:", error);
      setTranslatedJoke("Translation error");
    }
  };

  // Load models and start camera when "Start" is clicked
  useEffect(() => {
    if (startFaceDetect) {
      loadModels();
      startVideo();
    } else {
      stopVideo();
    }
  }, [startFaceDetect]);

  // Detect once after models are loaded and face detection is started
  useEffect(() => {
    if (modelsLoaded && startFaceDetect) {
      detectMood();
    }
  }, [modelsLoaded, startFaceDetect]);

  return (
    <div className="">
      <h5 className="text-white fw-bolder">
        Mood-Based Joke Generator 🎭😂
        <small
          onClick={() => setStartFaceDetect((prev) => !prev)}
          className="cursor-pointer ms-2 text-decoration-underline"
        >
          {startFaceDetect ? "Stop" : "Start"}
        </small>
      </h5>

      {startFaceDetect && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="90%"
            height="45%"
            className="rounded-4 shadow-lg border-4 border-blue-500"
          />
        </div>
      )}

      <div className="d-flex my-3">
        <button onClick={detectMood} className="btn btn-sm btn-outline-light me-2">
          <small className="fw-bold">🔄 Detect</small>
        </button>
        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="btn btn-sm btn-outline-light"
        >
          <small className="fw-medium">
            {language === "en" ? "🇮🇳 Translate to Hindi" : "🇺🇸 Translate to English"}
          </small>
        </button>
      </div>

      <div>
        <p>
          <span className="fw-normal text-white">Detected Mood:</span>{" "}
          <small className="fw-light text-secondary">{mood}</small>
        </p>
        <p className="fw-normal text-white">
          <span className="fw-normal text-white">Joke:</span>{" "}
          <small className="fw-light text-white">{joke}</small>
        </p>
        <p>
          <span className="fw-normal text-white">Translated Joke:</span>{" "}
          <small className="fw-light text-white">{translatedJoke}</small>
        </p>
      </div>
    </div>
  );
};

export default FaceDetection;
