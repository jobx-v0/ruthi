import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

const QuestionDisplay = ({ question, currentQuestionIndex, skipAnimate }) => {
  // Function to handle text-to-speech
  const speakQuestion = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel(); // Stop any ongoing speech
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set language as needed
    synth.speak(utterance);
  };

  // useEffect to trigger TTS when question changes
  useEffect(() => {
    if (question) {
      speakQuestion(question);
    }
  }, [question]);

  return (
    <div
      className="mb-3 bg-white border-gray-100 text-sm md:text-2xl px-2 rounded-lg text-slate-600"
      style={{ minHeight: "80px" }}
    >
      {question &&
        (skipAnimate ? (
          <span>{question}</span>
        ) : (
          <TypeAnimation
            key={currentQuestionIndex}
            sequence={[question]}
            wrapper="span"
            speed={60}
            style={{ display: "inline-block" }}
            repeat={0}
          />
        ))}
    </div>
  );
};

export default QuestionDisplay;
