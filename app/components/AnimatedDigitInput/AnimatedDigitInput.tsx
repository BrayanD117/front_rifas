import { motion } from "framer-motion";
import React, { useEffect, useState, KeyboardEvent } from "react";

interface AnimatedDigitInputProps {
  value: string;
  onChange: (value: string, index: number) => void;
  isAnimating: boolean;
  finalDigit: string;
  index: number;
  focusNext: (currentIndex: number) => void;
  focusPrev: (currentIndex: number) => void;
}

const AnimatedDigitInput = React.forwardRef<HTMLInputElement, AnimatedDigitInputProps>((props, ref) => {
  const { value, onChange, isAnimating, finalDigit, index, focusNext, focusPrev, ...rest } = props;

  const digitHeight = 60;
  const digitList = Array.from({ length: 10 }, (_, i) => i.toString());

  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d$/.test(newValue)) {
      setInputValue(newValue);
      onChange(newValue, index);
      focusNext(index);
    } else if (newValue === "") {
      setInputValue("");
      onChange("", index);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault();
      focusPrev(index);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "60px",
        height: `${digitHeight}px`,
        overflow: "hidden",
        borderRadius: "4px",
        border: "1px solid #ccc",
        marginRight: "5px",
      }}
    >
      <input
        ref={ref}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength={1}
        style={{
          width: "100%",
          height: "100%",
          textAlign: "center",
          fontSize: "2rem",
          background: "transparent",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          color: isAnimating ? 'transparent' : '#000',
          caretColor: isAnimating ? 'transparent' : '#000',
        }}
        {...rest}
      />
      {isAnimating && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <motion.div
            animate={{
              y: [0, -digitHeight * 10],
            }}
            transition={{
              y: {
                duration: 1,
                ease: "linear",
                repeat: Infinity,
              },
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: '100%',
            }}
          >
            {digitList.map((digit, idx) => (
              <div
                key={idx}
                style={{
                  width: '100%',
                  height: `${digitHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: "2rem",
                  color: "#000",
                }}
              >
                {digit}
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
});

export default AnimatedDigitInput;
