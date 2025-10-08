import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface AnimatedParagraphProps {
  text: string;
  delay?: number;
}

const AnimatedParagraph: React.FC<AnimatedParagraphProps> = ({
  text,
  delay = 0.3,
}) => {
  const words = text.replaceAll("\n", " newline ").split(" ");
  console.log("words ===>>>", words);

  return (
    <p className="flex flex-wrap gap-2">
      {words.map((word, index) => {
        if (!word) return null;
        if (word.trim() === "") return null;
        if (word === "newline")
          return <div key={index} className="inline-block" />;
        if (word.trim() === "undefined") return null;

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * delay, stiffness: 0 }}
            className="inline-block text-lg text-foreground text-pretty leading-tight"
          >
            {/* <ReactMarkdown>{word}</ReactMarkdown> */}
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

export default AnimatedParagraph;
