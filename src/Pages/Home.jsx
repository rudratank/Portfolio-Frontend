import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import Typewriter from "typewriter-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "./Header";
import { FETCH_RESUME, HOST, USER_HOME_DATA } from "@/lib/constant";

// Lazy-loaded components
const About = lazy(() => import("./About"));
const Skills = lazy(() => import("./Skills"));
const Education = lazy(() => import("./Education"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));

/**
 * ParticlesBackground component with tech-themed particles
 */
const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    //console.log("Particles container loaded", container);
  }, []);

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
    <div className="absolute inset-0 -z-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "transparent" } },
          fullScreen: { enable: false, zIndex: 0 },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#3b82f6" }, // Blue-500
            links: {
              color: "#8b5cf6", // Purple-500
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 40,
            },
            opacity: { value: 0.8, random: true },
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
              random: { enable: true, minimumValue: 12 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

/**
 * SocialIcon component with smooth hover effects
 */
const SocialIcon = ({ href, icon, hoverColor, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      className={`text-gray-600 hover:${hoverColor} transition-colors`}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        animate={{ y: isHovered ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        <FontAwesomeIcon icon={icon} size="lg" />
      </motion.div>
    </motion.a>
  );
};

/**
 * LoadingSpinner component with 3D rotation effect
 */
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50">
    <motion.div
      animate={{ rotateY: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center"
    >
      <div className="w-12 h-12 bg-white rounded-sm" />
    </motion.div>
  </div>
);

/**
 * FloatingBlobs component for background decoration
 */
const FloatingBlobs = () => (
  <>
    <motion.div
      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-10 pointer-events-none"
    />
    <motion.div
      animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-10 pointer-events-none"
    />
  </>
);

/**
 * Main Home component with improved UI
 */
const Home = () => {
  const [homeData, setHomeData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      github: "",
    },
  });
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Animation hooks
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        const [homeResponse, resumeResponse] = await Promise.all([
          fetch(USER_HOME_DATA, { signal }),
          fetch(FETCH_RESUME, { signal }),
        ]);

        if (!homeResponse.ok) throw new Error("Failed to fetch home data");
        if (!resumeResponse.ok) throw new Error("Failed to fetch resume");

        const [homeJsonData, resumeBlob] = await Promise.all([
          homeResponse.json(),
          resumeResponse.blob(),
        ]);

        const objectURL = URL.createObjectURL(resumeBlob);
        setHomeData(homeJsonData);
        setResumeUrl(objectURL);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, []);

  const downloadResume = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(FETCH_RESUME);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download resume. Please try again later.");
    }
  }, []);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "/placeholder-image.jpg";
    const timestamp = Date.now();

    if (imagePath.startsWith("http")) {
      return `${imagePath}?t=${timestamp}`;
    }

    return `${HOST}${imagePath}?t=${timestamp}`;
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-2xl border border-red-200"
        >
          <Badge variant="destructive" className="mb-4">
            Error
          </Badge>
          <p className="text-red-600">Error: {error}</p>
        </motion.div>
      </div>
    );
  }

  const { name, title, description, image, socialLinks } = homeData;

  return (
    <>
      <Header />
      <main
        id="home"
        className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden relative"
      >
        <FloatingBlobs />
        <ParticlesBackground />

        <div className="relative z-10">
          <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
              {/* Desktop Social Icons */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:flex flex-col items-center space-y-8 pr-8"
              >
                <div className="w-px h-24 bg-gradient-to-b from-blue-400 to-purple-400" />
                {Object.entries({
                  facebook: { icon: faFacebook, color: "text-blue-500" },
                  twitter: { icon: faTwitter, color: "text-cyan-400" },
                  linkedin: { icon: faLinkedin, color: "text-blue-400" },
                  github: { icon: faGithub, color: "text-gray-500" },
                }).map(
                  ([key, { icon, color }]) =>
                    socialLinks[key] && (
                      <SocialIcon
                        key={key}
                        href={socialLinks[key]}
                        icon={icon}
                        hoverColor={color}
                        label={`${key.charAt(0).toUpperCase()}${key.slice(1)}`}
                      />
                    )
                )}
                <div className="w-px h-24 bg-gradient-to-b from-purple-400 to-blue-400" />
              </motion.div>

              {/* Main Content */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 flex-grow">
                <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className="text-center md:text-left space-y-6 max-w-xl"
                >
                  <Badge variant="outline" className="mb-4 ">
                    Welcome
                  </Badge>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                      {name.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="inline-block mr-2"
                        >
                          {word}
                        </motion.span>
                      ))}
                      <motion.span
                        className="inline-block ml-2"
                        animate={{ rotate: [0, 15, 0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        👋
                      </motion.span>
                    </h1>

                    <div className="text-xl md:text-2xl text-blue-600 font-medium h-10">
                      <Typewriter
                        options={{
                          strings: [title],
                          autoStart: true,
                          loop: true,
                          cursor: "_",
                          delay: 50,
                          deleteSpeed: 30,
                        }}
                      />
                    </div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg text-gray-600 leading-relaxed"
                  >
                    {description}
                  </motion.p>

                  {/* Improved Typewriter Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg md:text-xl font-medium text-purple-600 h-12"
                  >
                    <Typewriter
                      options={{
                        strings: [
                          "Crafting elegant digital experiences",
                          "Transforming ideas into reality",
                          "Building future-proof solutions",
                          "Optimizing user experiences",
                          "Solving complex problems with code",
                          "Engineering scalable architectures",
                        ],
                        autoStart: true,
                        loop: true,
                        cursor: "|",
                        delay: 50,
                        deleteSpeed: 30,
                      }}
                    />
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                    >
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="#contact"
                      >
                        Hire Me
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </motion.a>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={downloadResume}
                      className="group border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Download CV
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="ml-2 group-hover:translate-y-1 transition-transform"
                        />
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Profile Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                  <motion.div
                    whileHover={{ rotate: 3 }}
                    className="relative w-56 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl"
                  >
                    <picture>
                      <source srcSet={getImageUrl(image)} type="image/webp" />
                      <motion.img
                        src={getImageUrl(image)}
                        alt={name}
                        loading="lazy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isImageLoaded ? 1 : 0 }}
                        onLoad={() => setIsImageLoaded(true)}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        }}
                      />
                    </picture>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>

                  {/* Floating tech badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-4 -left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10"
                  >
                    React
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="absolute -top-4 -right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10"
                  >
                    Node.js
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Lazy-loaded sections */}
          <AnimatePresence>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                  />
                </div>
              }
            >
              <About />
              <Skills />
              <Education />
              <Projects />
              <Contact />
              <Footer />
            </Suspense>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default Home;
