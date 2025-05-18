import React, { createContext, useState, useContext } from 'react';

const SpeechRecognitionContext = createContext();

export const useSpeechRecognitionContext = () => {
  return useContext(SpeechRecognitionContext);
};

export const SpeechRecognitionProvider = ({ children }) => {
  const [transcript, setTranscript] = useState('');

  return (
    <SpeechRecognitionContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </SpeechRecognitionContext.Provider>
  );
};
