// src/components/Glow.jsx
import React from "react";

const Glow = ({ children }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default Glow;
