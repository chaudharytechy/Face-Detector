
import React, { useState } from "react";
import ChatApp from "./ChatApp";
import VoicetoText from "./VoiceToText";
import FaceDetection from "./FaceDetection";
import JokeComponent from "./JokeComponent";
const Main=()=>{

  const [mood, setMood] = useState(""); // State to hold the detected mood

  // This function updates the mood when face-api.js detects it
  const handleMoodDetection = (detectedMood) => {
    setMood(detectedMood);
  };

    return(<>
    
    <div className="container-fluid bg-danger ">
            <div className="row  px-2 py-2">
              <div className="col-md-8 border-3 border-end">
                <ChatApp/>
              </div>
              <div className="col-md-4">
                {/* Face Detection Component */}
                <div className="">
                  <FaceDetection setMood={handleMoodDetection} />
                </div>
    
                {/* JokeComponent appears only when a mood is detected */}
                {mood && (
                  <div className="">
                    <JokeComponent mood={mood} />
                  </div>
                )}
              </div>
            </div>
     </div>
    </>)
}
export default Main