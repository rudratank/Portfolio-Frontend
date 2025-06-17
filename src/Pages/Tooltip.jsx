// src/components/Tooltip.jsx
import React from "react";

const Tooltip = ({ children, text }) => {
  return (
    <div className="relative group cursor-pointer">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded px-2 py-1 z-10 whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
