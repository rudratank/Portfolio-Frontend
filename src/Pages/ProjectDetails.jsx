import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HOST, USER_PROJECTS_DATA_BY_ID } from "@/lib/constant";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${USER_PROJECTS_DATA_BY_ID}/${id}`);
        console.log(response);

        setProject(response.data);
      } catch (error) {
        setError("Failed to fetch project details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Updated ProjectDetails component with improved UI
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-6xl mx-auto">
        <Button
          onClick={handleBack}
          variant="outline"
          className="mb-8 hover:bg-blue-50 dark:hover:bg-gray-800 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-xl dark:shadow-lg dark:shadow-purple-900/20">
            <div className="relative h-96 w-full">
              <img
                src={`${project.image}`}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/800/600";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <CardContent className="p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack?.map((tech, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {project.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                {project.description}
              </p>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  ✨ Key Features
                </h2>
                <ul className="space-y-3">
                  {project.features?.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                    >
                      <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      </span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </a>
                )}
                {project.codeLink && (
                  <a
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="ml-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProjectDetails;
