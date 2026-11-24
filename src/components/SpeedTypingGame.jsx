import React, { useState, useEffect, useRef, useCallback } from "react";
import TypingArea from "./TypingArea";
import Stats from "./Stats";
import paragraphs from "../data/paragraphs";
import "./SpeedTypingGame.css";

const MAX_TIME = 60;

const SpeedTypingGame = () => {
  const [paragraph, setParagraph] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [correctChars, setCorrectChars] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Load a random paragraph
  const loadParagraph = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setParagraph(paragraphs[randomIndex]);
  }, []);

  // Initialize
  useEffect(() => {
    loadParagraph();
  }, [loadParagraph]);

  // Focus hidden input on mount and when reset
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [paragraph]);

  // Timer logic
  useEffect(() => {
    if (isTyping && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTyping(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTyping]);

  // Calculate WPM and CPM whenever charIndex or timeLeft changes
  useEffect(() => {
    if (charIndex > 0) {
      const timeElapsed = MAX_TIME - timeLeft;
      const minutes = timeElapsed / 60;

      if (minutes > 0) {
        const correctCount = Object.values(correctChars).filter(Boolean).length;
        const currentWpm = Math.round(correctCount / 5 / minutes);
        const currentCpm = Math.round(correctCount / minutes);

        setWpm(currentWpm > 0 ? currentWpm : 0);
        setCpm(currentCpm > 0 ? currentCpm : 0);
      }
    }
  }, [charIndex, timeLeft, correctChars]);

  const handleKeyDown = (e) => {
    if (isFinished || timeLeft <= 0) return;

    // Start typing on first keypress
    if (!isTyping && e.key.length === 1) {
      setIsTyping(true);
    }

    if (e.key === "Backspace") {
      if (charIndex > 0) {
        const newIndex = charIndex - 1;
        // If the char we're deleting was wrong, reduce mistakes
        if (correctChars[newIndex] === false) {
          setMistakes((prev) => prev - 1);
        }
        const newCorrectChars = { ...correctChars };
        delete newCorrectChars[newIndex];
        setCorrectChars(newCorrectChars);
        setCharIndex(newIndex);
      }
      return;
    }

    // Ignore non-character keys
    if (e.key.length !== 1) return;

    if (charIndex >= paragraph.length) {
      setIsFinished(true);
      setIsTyping(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentChar = paragraph[charIndex];
    const isCorrect = e.key === currentChar;

    if (!isCorrect) {
      setMistakes((prev) => prev + 1);
    }

    setCorrectChars((prev) => ({
      ...prev,
      [charIndex]: isCorrect,
    }));

    setCharIndex((prev) => prev + 1);

    // Check if paragraph completed
    if (charIndex + 1 >= paragraph.length) {
      setIsFinished(true);
      setIsTyping(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    setTimeLeft(MAX_TIME);
    setWpm(0);
    setCpm(0);
    setCorrectChars({});
    setIsFinished(false);
    loadParagraph();
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Accuracy calculation
  const totalTyped = charIndex;
  const correctCount = Object.values(correctChars).filter(Boolean).length;
  const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;

  return (
    <div className="game-container" onClick={handleContainerClick}>
      <h1 className="game-title">⌨️ Typing Speed Test</h1>
      <p className="game-subtitle">
        Test your typing speed and accuracy. Start typing to begin the timer!
      </p>

      {/* Hidden input to capture keyboard input */}
      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        onKeyDown={handleKeyDown}
        autoFocus
        aria-label="Type here"
      />

      <TypingArea
        paragraph={paragraph}
        charIndex={charIndex}
        mistakes={mistakes}
        correctChars={correctChars}
      />

      <Stats
        timeLeft={timeLeft}
        mistakes={mistakes}
        wpm={wpm}
        cpm={cpm}
      />

      {/* Accuracy bar */}
      <div className="accuracy-container">
        <div className="accuracy-header">
          <span>Accuracy</span>
          <span className="accuracy-value">{accuracy}%</span>
        </div>
        <div className="accuracy-bar-bg">
          <div
            className="accuracy-bar-fill"
            style={{ width: `${accuracy}%` }}
          ></div>
        </div>
      </div>

      {/* Result / Reset */}
      {isFinished && (
        <div className="result-overlay">
          <div className="result-card">
            <h2>🏁 Test Complete!</h2>
            <div className="result-stats">
              <div className="result-stat">
                <span className="result-number">{wpm}</span>
                <span className="result-label">WPM</span>
              </div>
              <div className="result-stat">
                <span className="result-number">{cpm}</span>
                <span className="result-label">CPM</span>
              </div>
              <div className="result-stat">
                <span className="result-number">{accuracy}%</span>
                <span className="result-label">Accuracy</span>
              </div>
              <div className="result-stat">
                <span className="result-number">{mistakes}</span>
                <span className="result-label">Mistakes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button className="reset-btn" onClick={handleReset}>
        🔄 Try Again
      </button>
    </div>
  );
};

export default SpeedTypingGame;
