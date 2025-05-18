// import React,{useEffect} from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// const VoicetoText = ({ onTranscriptChange }) => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }
//   useEffect(() => {
//     if (onTranscriptChange) {
//       onTranscriptChange(transcript);
//     }
//   }, [transcript, onTranscriptChange]);
//   return (
//     <div className=''>
//       <p className='text-white fw-light'>🎙️: {listening ? 'on' : 'off'}</p>
//       {/* <button onClick={SpeechRecognition.startListening} className='border btn me-2 text-white py-1 px-4'>🎙️</button>
//       <button onClick={SpeechRecognition.stopListening} className=' border btn me-2 text-white py-1 px-4'>Stop</button> */}
//         <button
//         onClick={() => (listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening())}
//         className='border btn me-2 text-white py-1 px-4'>
//         🎙️ {listening ? 'Stop' : 'Start'}
//       </button>
//       <button onClick={resetTranscript} className='btn border text-white py-1 px-4'>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };
// export default VoicetoText;

import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechRecognitionContext } from './SpeechRecognitionContext';

const VoicetoText = ({ text }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { setTranscript } = useSpeechRecognitionContext();

  // Ensure useEffect is always called by placing it outside the conditional block
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      // Update the context whenever the transcript changes
      setTranscript(transcript);
    }
  }, [transcript, setTranscript, browserSupportsSpeechRecognition]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className='d-flex col-md-12'>
      <p className='mx-3 my-3'>🎙️{listening ? <small className='text-white'>On</small>  : <small className='text-white'>Off</small> }</p>
      <button
        onClick={() => (listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening())}
        className='mx-3 btn '>
        🎙️ {listening ? <small className='text-white'>Stop</small> : <small className='text-white'>Start</small> }
      </button>
      <button onClick={resetTranscript} className='btn mx-3'>🎙️<small className='text-white'>Reset</small> </button>
    </div>
  );
};

export default VoicetoText;
