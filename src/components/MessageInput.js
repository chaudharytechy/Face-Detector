import React, { useEffect, useState } from 'react';
import VoicetoText from './VoiceToText';
import { useSpeechRecognitionContext } from './SpeechRecognitionContext';

const MessageInput = ({ sendMessage }) => {
  const { transcript, setTranscript } = useSpeechRecognitionContext();
  const [text, setText] = useState('');

  const handleSendMessage = () => {
    if (text.trim()) {
      sendMessage(text); // ✅ Send plain text only
      setText('');
      setTranscript('');
    }
  };

  useEffect(() => {
    if (transcript && !text) {
      setText(transcript);
    }
  }, [transcript, text]);

  return (
    <div className="container-fluid mx-2 d-flex align-items-center mt-2">
     <div className='row'>
   <div className='col-md-8'>
   <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="form-control mb-1 rounded-3"
      />
   </div>
    <div className='col-md-4 mb-5'>
    <button onClick={handleSendMessage} className="btn btn-primary rounded-3 ">
        Send
      </button>
      <VoicetoText />
    </div>

     </div>
    </div>
  );
};

export default MessageInput;
