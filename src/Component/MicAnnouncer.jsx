// components/MicAnnouncer.js
import React, { useState, useRef } from "react";

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
    alert("Microphone not found or access denied. Please check your system and browser permissions.");
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
      style={{
        fontSize: "1.5rem",
        padding: "10px 20px",
        backgroundColor: isRecording ? "#f44336" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {isRecording ? "🛑 Stop Mic" : "🎤 Start Mic"}
    </button>
  );
};

export default MicAnnouncer;
