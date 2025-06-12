// components/MicAnnouncer.js
import React, { useState, useRef } from "react";
import svg from "./common/svg";
import { toast } from "react-toastify";

const MicAnnouncer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);

  const startMic = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;

    source.connect(audioContext.destination);
    setIsRecording(true);
  } catch (err) {
    console.error("Mic start error:", err);
    // alert("Microphone not found or access denied. Please check your system and browser permissions.");
    toast.error("Microphone not found or access denied. Please check your system and browser permissions.");
  }
};


  const stopMic = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();

    setIsRecording(false);
  };

  const toggleMic = () => {
    if (isRecording) {
      stopMic();
    } else {
      startMic();
    }
  };

  return (
    <button
      onClick={toggleMic}
     className="ps_mic_btn_box"
    >
      {/* {isRecording ? " Stop Mic" : " Start Mic"} */}
      {isRecording ? <div className="ps_mic_on"><img src="../images/mic_animation.gif"></img></div> : <div className="ps_mic_off">{svg.app.mic_icon}</div> }
    </button>
  );
};

export default MicAnnouncer;
