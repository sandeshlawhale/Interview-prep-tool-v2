import { useEffect, useState } from "react";

/**
 * Custom hook to animate text word-by-word.
 * @param text - The paragraph or sentence to animate.
 * @param speed - Delay (in milliseconds) between each word.
 * @returns The currently visible portion of the text.
 */
export const useWordAnimation = (text: string, speed: number = 300): string => {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    const words = text.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) =>
        prev ? `${prev} ${words[index]}` : words[index]
      );
      index++;

      if (index >= words.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
};
