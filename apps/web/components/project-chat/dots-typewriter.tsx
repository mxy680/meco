import { useEffect, useState } from "react";

interface DotsTypewriterProps {
  interval?: number; // ms per dot
  className?: string;
}

export default function DotsTypewriter({ interval = 400, className = "" }: DotsTypewriterProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % 4;
      setDots(".".repeat(i));
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return <span className={className}>{dots}</span>;
}
