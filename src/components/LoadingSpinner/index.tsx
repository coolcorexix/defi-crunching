import React, { useEffect, useState } from "react";

const frame1 = "◡◡ ⊙⊙ ◠◠";
const frames = frame1.split(" ");
export function LoadingSpinner(props: any) {
  const [loadingCharIndex, setLoadingCharIndex] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setLoadingCharIndex(loadingCharIndex + 1);
    }, 500);
  }, [loadingCharIndex]);

  return <span {...props}>{frames[loadingCharIndex % frames.length]}</span>;
}
