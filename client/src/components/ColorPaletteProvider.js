import React, { useState } from "react";

const colorPalettes = {
  default: {
    background: "#373A40",
    surface: "#2D2F35",
    primary: "#DC5F00",
    text: "#EEEEEE",
    accent: "#444750",
  },
  blue: {
    background: "#1A2B3C",
    surface: "#2C3E50",
    primary: "#3498DB",
    text: "#ECF0F1",
    accent: "#34495E",
  },
  green: {
    background: "#2C3E50",
    surface: "#34495E",
    primary: "#2ECC71",
    text: "#ECF0F1",
    accent: "#1ABC9C",
  },
  pastel: {
    background: "#FFE9D0",
    surface: "#B1AFFF",
    primary: "#BBE9FF",
    text: "#373A40",
    accent: "#FFFED3",
  },
  sunset: {
    background: "#FFF6E9",
    surface: "#FFE9D0",
    primary: "#FF7F3E",
    text: "#604CC3",
    accent: "#80C4E9",
  },
  bold: {
    background: "#FFF5E1",
    surface: "#FFEBEB",
    primary: "#FF6969",
    text: "#0C1844",
    accent: "#C80036",
  },
  lavender: {
    background: "#F0E6FF",
    surface: "#E1D4FF",
    primary: "#9B72FF",
    text: "#3A2E55",
    accent: "#C8B4FF",
  },
  mint: {
    background: "#E8FFF5",
    surface: "#D1FFE9",
    primary: "#4ECCA3",
    text: "#2D3E4E",
    accent: "#9CFFD9",
  },
  coral: {
    background: "#FFF0ED",
    surface: "#FFE0DB",
    primary: "#FF6F61",
    text: "#4A4A4A",
    accent: "#FFA399",
  },
  divakar: {
    background: "#FBF3E4",
    surface: "#DFD8CA",
    primary: "#B91646",
    text: "#105652",
    accent: "#B91646",
  },
  anuroop: {
    background: "#E8FFF5",
    surface: "#D1FFE9",
    primary: "#DC5F00",
    text: "#2D3E4E",
    accent: "#9CFFD9",
  },
  // Add more color palettes as needed
};

const ColorPaletteProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState("default");

  const applyColorPalette = (palette) => {
    const root = document.documentElement;
    Object.entries(colorPalettes[palette]).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const changePalette = (newPalette) => {
    setCurrentPalette(newPalette);
    applyColorPalette(newPalette);
  };

  // Apply the default palette on initial render
  React.useEffect(() => {
    applyColorPalette(currentPalette);
  }, []);

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <select
          value={currentPalette}
          onChange={(e) => changePalette(e.target.value)}
          className="bg-white text-gray-800 rounded px-2 py-1"
        >
          {Object.keys(colorPalettes).map((palette) => (
            <option key={palette} value={palette}>
              {palette}
            </option>
          ))}
        </select>
      </div>
      {children}
    </div>
  );
};

export default ColorPaletteProvider;
