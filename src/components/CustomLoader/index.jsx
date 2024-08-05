import React from "react";
import "./loader.css";

const CustomLoader = () => {
  const text = "Wellbeing";
  return (
    <div className="custom-loader">
      {text.split("").map((letter, index) => (
        <span key={index} className="custom-loader-letter">
          {letter}
        </span>
      ))}
    </div>
  );
};

export default CustomLoader;
