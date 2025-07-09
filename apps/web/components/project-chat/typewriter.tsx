import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
}

export default function Typewriter({ text, speed = 30, className = "" }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
}
