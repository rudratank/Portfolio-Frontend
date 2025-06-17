import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  ArrowRight,
  Eye,
  Code,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOST, USER_PROJECTS_DATA } from "@/lib/constant";
import { cn } from "@/lib/utils";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedTech, setSelectedTech] = useState([]);
  const [allTechStack, setAllTechStack] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(USER_PROJECTS_DATA);
        setProjects(response.data);
        setFilteredProjects(response.data);

        // Extract all unique tech stack items
        const techStacks = response.data.flatMap(
          (project) => project.techStack || []
        );
        const uniqueTechStacks = [...new Set(techStacks)];
        setAllTechStack(uniqueTechStacks);
      } catch (error) {
        setError("Failed to fetch projects");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let results = [...projects];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tech stack filter
    if (selectedTech.length > 0) {
      results = results.filter((project) =>
        selectedTech.every((tech) => project.techStack?.includes(tech))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        results.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProjects(results);
  }, [projects, searchTerm, sortOption, selectedTech]);

  const toggleTechFilter = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTech([]);
    setSortOption("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Error loading projects
        </h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Project Archive
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {projects.length} projects crafted with passion
            </p>
          </motion.div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm ||
              selectedTech.length > 0 ||
              sortOption !== "newest") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-500"
              >
                <X className="w-4 h-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {allTechStack.slice(0, 12).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className={cn(
                  "cursor-pointer transition-all",
                  selectedTech.includes(tech)
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                )}
                onClick={() => toggleTechFilter(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  onMouseEnter={() => setHoveredProject(project._id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <Card className="h-full group overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-purple-900/20 border border-gray-100 dark:border-gray-700">
                    <div className="relative overflow-hidden aspect-video">
                      <motion.img
                        loading="lazy"
                        src={`${project.image}`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
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
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {project.techStack?.slice(0, 3).map((tech, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className={cn(
                                "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                                selectedTech.includes(tech) &&
                                  "ring-2 ring-blue-500"
                              )}
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack?.length > 3 && (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-800"
                            >
                              +{project.techStack.length - 3}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {projects.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Total Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {allTechStack.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Technologies Used
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {projects.filter((p) => p.liveLink).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Live Demos</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProjectsPage;
