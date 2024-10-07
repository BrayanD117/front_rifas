import { motion, useMotionValue, animate } from "framer-motion";
import React, { useEffect, useState, KeyboardEvent } from "react";

interface AnimatedDigitInputProps {
  value: string;
  onChange: (value: string, index: number) => void;
  isAnimating: boolean;
  index: number;
  focusNext: (currentIndex: number) => void;
  focusPrev: (currentIndex: number) => void;
}

const AnimatedDigitInput = React.forwardRef<HTMLInputElement, AnimatedDigitInputProps>((props, ref) => {
  const { value, onChange, isAnimating, index, focusNext, focusPrev, ...rest } = props;

  const digitHeight = 60;
  const digitList = Array.from({ length: 10 }, (_, i) => i.toString());

  const y = useMotionValue(0);

  useEffect(() => {
    if (isAnimating) {
      const animation = animate(y, -digitHeight * 10, {
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      });
      return () => animation.stop();
    } else {
      const targetY = -digitHeight * parseInt(value || '0');
      animate(y, targetY, {
        duration: 0.5,
        ease: "easeOut",
      });
    }
  }, [isAnimating, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d$/.test(newValue)) {
      onChange(newValue, index);
      focusNext(index);
    } else if (newValue === "") {
      onChange("0", index);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value === "" || value === "0") {
        e.preventDefault();
        onChange("0", index);
        focusPrev(index);
      } else {
        onChange("0", index);
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "60px",
        height: `${digitHeight}px`,
        overflow: "hidden",
        borderRadius: "25px",
        border: "1px solid #ccc",
        marginRight: "5px",
      }}
    >
      <input
        ref={ref}
        value={value !== "0" ? value : ""}
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
          color: 'transparent',
          caretColor: '#000',
          outline: 'none',
        }}
        {...rest}
      />
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
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: '100%',
            y: y,
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
    </div>
  );
});

export default AnimatedDigitInput;
