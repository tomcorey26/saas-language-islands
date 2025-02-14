import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function AnimatedPalmTree() {
  const [isGiggling, setIsGiggling] = useState(false);
  const [giggleCount, setGiggleCount] = useState(0);

  const startGiggle = () => {
    setIsGiggling(true);
    setGiggleCount((prev) => prev + 1);
    setTimeout(() => setIsGiggling(false), 1000);
  };

  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-4 cursor-pointer focus:outline-none select-none relative"
      onClick={startGiggle}
      whileHover={{ scale: 1.05 }}
      animate={
        isGiggling
          ? {
              rotate: [-2, 2, -2, 2, -1, 1, -1, 0],
              transition: { duration: 1, ease: "easeInOut" },
            }
          : {}
      }
    >
      {/* Island base */}
      <motion.ellipse
        cx="60"
        cy="105"
        rx="40"
        ry="10"
        fill="#F4D03F"
        animate={{
          scaleX: [1, 1.05, 1],
          scaleY: [1, 0.95, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Trunk with bouncing animation */}
      <motion.path
        d="M50 100V60C50 50 65 45 65 45"
        stroke="#8B4513"
        strokeWidth="14"
        strokeLinecap="round"
        animate={
          isGiggling
            ? {
                x: [-3, 3, -3, 3, -2, 2, -1, 0],
                rotate: [-3, 3, -3, 3, -2, 2, -1, 0],
                transition: { duration: 1, ease: "easeInOut" },
              }
            : {
                x: [-3, 3, -3],
                rotate: [-3, 3, -3],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      />

      {/* Leaves with waving animation */}
      <motion.g
        animate={
          isGiggling
            ? {
                rotate: [-10, 10, -10, 10, -5, 5, -2, 0],
                transition: { duration: 1, ease: "easeInOut" },
              }
            : {
                rotate: [-10, 10, -10],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        style={{ transformOrigin: "65px 45px" }}
      >
        {/* Original leaves */}
        <motion.path
          d="M65 45C65 45 55 25 45 20C35 15 25 20 30 25C35 30 60 45 65 45Z"
          fill="#228B22"
        />
        <motion.path
          d="M65 45C65 45 75 25 85 20C95 15 105 20 100 25C95 30 70 45 65 45Z"
          fill="#228B22"
        />
        <motion.path
          d="M65 45C65 45 65 20 70 10C75 0 85 0 85 5C85 10 70 45 65 45Z"
          fill="#228B22"
        />

        {/* Additional leaves */}
        <motion.path
          d="M65 45C65 45 45 30 35 30C25 30 20 40 25 42C30 44 60 45 65 45Z"
          fill="#228B22"
        />
        <motion.path
          d="M65 45C65 45 85 30 95 30C105 30 110 40 105 42C100 44 70 45 65 45Z"
          fill="#228B22"
        />
        <motion.path
          d="M65 45C65 45 60 15 65 5C70 -5 80 -5 80 0C80 5 70 45 65 45Z"
          fill="#228B22"
        />
      </motion.g>

      {/* Happy face */}
      <motion.g
        animate={
          isGiggling
            ? {
                y: [-2, 2, -2, 2, -1, 1, -1, 0],
                transition: { duration: 1, ease: "easeInOut" },
              }
            : {
                y: [-1, 1, -1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        <motion.circle
          cx="57"
          cy="65"
          r="2.5"
          fill="black"
          animate={
            isGiggling
              ? {
                  scaleY: [1, 0.3, 1, 0.3, 1],
                  transition: { duration: 1, ease: "easeInOut" },
                }
              : {}
          }
        />
        <motion.circle
          cx="64"
          cy="65"
          r="2.5"
          fill="black"
          animate={
            isGiggling
              ? {
                  scaleY: [1, 0.3, 1, 0.3, 1],
                  transition: { duration: 1, ease: "easeInOut" },
                }
              : {}
          }
        />
        <motion.path
          d="M56 70C56 70 60.5 72 65 70"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          animate={
            isGiggling
              ? {
                  d: [
                    "M56 70C56 70 60.5 72 65 70",
                    "M56 70C56 70 60.5 74 65 70",
                    "M56 70C56 70 60.5 72 65 70",
                  ],
                  transition: { duration: 1, ease: "easeInOut" },
                }
              : {}
          }
        />{" "}
        {/* Smile */}
      </motion.g>

      {/* Floating hehe text */}
      <AnimatePresence mode="popLayout">
        {isGiggling && (
          <motion.text
            key={giggleCount}
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: [0, 1, 1, 0], y: [70, 60, 40, 20] }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            x="68"
            fontSize="12"
            fill="black"
            style={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            hehe
          </motion.text>
        )}
      </AnimatePresence>
    </motion.svg>
  );
}
