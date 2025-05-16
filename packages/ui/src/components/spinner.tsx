import { motion } from "motion/react";
import React from "react";

export interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "#9ca3af", // Tailwind gray-400
  className = "",
}) => {
  return (
    <>
      <motion.svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ display: "inline-block" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{
            strokeDasharray: "1, 150",
            strokeDashoffset: 0,
          }}
          animate={{
            strokeDasharray: ["1, 150", "90, 150", "90, 150"],
            strokeDashoffset: [0, -35, -124],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </>
  );
};

export default Spinner;
