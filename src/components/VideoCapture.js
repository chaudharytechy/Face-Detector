import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const VideoCapture = ({ setMood }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    const startVideo = () => {
      navigator.getUserMedia(
        { video: {} },
        stream => {
          videoRef.current.srcObject = stream;
        },
        err => console.error('Error accessing webcam', err)
      );
    };

    const detectFaces = async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceExpressions();
      if (detections.length > 0) {
        const mood = getMood(detections[0].expressions);
        setMood(mood);
      }
    };

    loadModels().then(() => {
      startVideo();
      setInterval(detectFaces, 100); // Detect every 100ms
    });
  }, []);

  const getMood = (expressions) => {
    const maxExpression = Object.keys(expressions).reduce((max, key) => (expressions[key] > expressions[max] ? key : max), 'neutral');
    return maxExpression;
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default VideoCapture;
