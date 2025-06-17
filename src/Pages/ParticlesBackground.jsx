import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles loaded", container);
  }, []);

  // Tech-related symbols and icons
  const techShapes = [
    "{}",
    "[]",
    "</>",
    "{}",
    "()",
    "=>",
    "⚛",
    "λ",
    "Φ",
    "{}",
    "∞",
    "π",
    "</>",
    "{}",
    "()",
    "=>",
    "⚙",
    "Σ",
    "Δ",
    "</>",
    "{}",
    "()",
    "Ω",
    "θ",
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent", // Make sure this is transparent
            },
          },
          fullScreen: {
            enable: false, // Disable full screen to contain within parent
            zIndex: 0,
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#38bdf8", // Sky blue color
            },
            links: {
              color: "#818cf8", // Indigo color
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 40, // Reduced number of particles
            },
            opacity: {
              value: 0.8,
              random: true,
            },
            shape: {
              type: "char",
              options: {
                char: {
                  value: techShapes,
                  font: "Courier New",
                  style: "",
                  weight: "bold",
                },
              },
            },
            size: {
              value: 16,
              random: {
                enable: true,
                minimumValue: 12,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
