import React from "react";
import { useInView } from "react-intersection-observer";

const FadeInSection = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // triggers animation when 20% of section is in view
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-in-out transform ${
        inView
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-95"
      }`}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
