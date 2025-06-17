import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowRight, Eye, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HOST, USER_PROJECTS_DATA } from "@/lib/constant";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(USER_PROJECTS_DATA);
        setProjects(response.data);
      } catch (error) {
        setError("Failed to fetch projects");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            <Code className="w-4 h-4 mr-2" />
            My Work
          </Badge>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Crafted With Precision
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Each project represents a unique challenge solved with clean code
            and thoughtful architecture.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mt-6" />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse h-full">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 text-center">
              <Badge variant="destructive" className="mb-4">
                Error
              </Badge>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card className="h-full group overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-purple-900/20">
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      loading="lazy"
                      src={`${project.image}`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/600/400";
                      }}
                    />
                    <AnimatePresence>
                      {hoveredProject === project._id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-6"
                        >
                          <div className="flex gap-3">
                            <Button
                              asChild
                              variant="secondary"
                              className="rounded-full"
                              size="sm"
                            >
                              <Link to={`/projects/${project._id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Details
                              </Link>
                            </Button>
                            {project.liveLink && (
                              <Button
                                asChild
                                size="sm"
                                className="rounded-full"
                              >
                                <a
                                  href={project.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Live Demo
                                </a>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.codeLink && (
                        <a
                          href={project.codeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.techStack?.slice(0, 4).map((tech, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack?.length > 4 && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-800"
                        >
                          +{project.techStack.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Button variant="outline" asChild>
            <Link to="/projects" className="group">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
