import React from "react";

const TypingArea = ({ paragraph, charIndex, mistakes, correctChars }) => {
  return (
    <div className="typing-area">
      <p className="paragraph-text">
        {paragraph.split("").map((char, index) => {
          let className = "";
          if (index < charIndex) {
            className = correctChars[index] ? "correct" : "incorrect";
          } else if (index === charIndex) {
            className = "active";
          }
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default TypingArea;
