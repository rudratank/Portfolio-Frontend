import React, { useState, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DownloadCloud,
  ChevronRight,
  Code2Icon,
  AwardIcon,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { FETCH_RESUME, HOST, USER_ABOUT_DATA } from "@/lib/constant";

// Enhanced Description Component with animated bullet points
const DescriptionText = ({ text }) => {
  const paragraphs = text.split("\n").filter((para) => para.trim() !== "");

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15, duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex items-start"
        >
          <div className="flex-shrink-0 mt-1.5">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"
            />
          </div>
          <p className="ml-4 text-gray-700 text-lg leading-relaxed">
            {paragraph}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// Animated Stat Card Component
const StatCard = memo(({ icon: Icon, title, value, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 400 }}
  >
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center
            transform group-hover:scale-110 transition-all duration-300 shadow-sm`}
          >
            <Icon className="w-6 h-6 text-gray-800" />
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-blue-600 font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));
StatCard.displayName = "StatCard";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <section className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Skeleton */}
        <div className="lg:w-1/2 relative">
          <Skeleton className="h-[500px] rounded-3xl" />
        </div>

        {/* Content Skeleton */}
        <div className="lg:w-1/2 space-y-8">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>

          {/* Description Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-4 w-4 rounded-full mt-2 mr-3" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Error Display Component
const ErrorDisplay = ({ error }) => (
  <section className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-lg mx-auto"
    >
      <Card className="border-red-200 bg-white">
        <CardContent className="flex flex-col items-center p-6">
          <Badge variant="destructive" className="mb-4">
            Error
          </Badge>
          <p className="text-red-600 text-center">{error}</p>
          <Button
            variant="outline"
            className="mt-4 border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  </section>
);

function About() {
  const [aboutData, setAboutData] = useState({
    image: "",
    description: "",
    projectsCompleted: 0,
    experience: 0,
    support: "",
    resume: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadResume = async () => {
    try {
      const response = await fetch(FETCH_RESUME);
      if (!response.ok) {
        throw new Error(`Error fetching resume: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Failed to download resume. Please try again later.");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchAboutData = async () => {
      try {
        const response = await fetch(USER_ABOUT_DATA, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch about data");

        const result = await response.json();
        if (result.success) {
          setAboutData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();

    return () => controller.abort();
  }, []);

  const stats = [
    {
      icon: AwardIcon,
      title: "Certificates",
      value: `${aboutData.experience}+`,
      color: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      title: "Projects",
      value: `${aboutData.projectsCompleted}+`,
      color: "bg-purple-100",
    },
    {
      icon: Code2Icon,
      title: "Skills",
      value: `${aboutData.support}+`,
      color: "bg-green-100",
    },
  ];

  const scrollToSkills = () => {
    document.querySelector("#skills")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <section
      id="about"
      className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            About Me
          </Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Professional Profile
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500 -z-10" />
            <div className="relative rounded-3xl overflow-hidden shadow-xl transform group-hover:scale-[1.02] transition-all duration-500 border-4 border-white/20">
              <img
                loading="lazy"
                src={
                  aboutData.image
                    ? `${aboutData.image}`
                    : "/placeholder-image.jpg"
                }
                alt="Profile"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          </motion.div>

          {/* Stats and Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-8"
          >
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Description Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <h3 className="text-xl font-semibold text-gray-800">
                  My Development Journey
                </h3>
              </div>

              <DescriptionText text={aboutData.description} />

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 pt-8"
              >
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all"
                  onClick={scrollToSkills}
                >
                  <span className="mr-2">Explore Skills</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={downloadResume}
                  className="group border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <span className="mr-2">Download CV</span>
                  <DownloadCloud className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
