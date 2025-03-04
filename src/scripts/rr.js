import React, { useState, useEffect } from "react";

function RandomTextPrinter({ textArray, speed = 100 }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const randomText = textArray[Math.floor(Math.random() * textArray.length)];
    setText(randomText);
  }, [textArray]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (index < text.length) {
        setText(text.substring(0, index + 1));
        setIndex(index + 1);
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <div>{text}</div>;
}

export default RandomTextPrinter;
