import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Award,
  Calendar,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HOST, USER_EDUCATION_DATA } from "@/lib/constant";
import "./style.css";

const CustomArrow = ({ direction, onClick, disabled }) => (
  <Button
    onClick={onClick}
    variant="outline"
    size="icon"
    disabled={disabled}
    className={`absolute top-1/2 -translate-y-1/2 ${
      direction === "next" ? "-right-12" : "-left-12"
    } z-10 rounded-full bg-white/90 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {direction === "next" ? (
      <ChevronRight className="w-5 h-5" />
    ) : (
      <ChevronLeft className="w-5 h-5" />
    )}
  </Button>
);

const TimelineItem = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="relative pl-8 md:pl-12"
  >
    <div className="absolute left-0 mt-3 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg ring-4 ring-white" />
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <Badge className="mb-2" variant="outline">
          {item.period}
        </Badge>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
        <p className="text-blue-600 font-medium mb-3">{item.institution}</p>
        <p className="text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="relative pl-8 md:pl-12">
        <div className="absolute left-0 mt-3 h-4 w-4 rounded-full bg-gray-200" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
);

const Education = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [educationData, setEducationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await fetch(USER_EDUCATION_DATA);
        if (!response.ok) {
          throw new Error("Failed to fetch education data");
        }
        const data = await response.json();
        setEducationData(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    //console.log("Certificates data:", educationData?.certificates);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [educationData]);

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };
  const getSliderSettings = () => {
    const certCount = educationData?.certificates?.length || 0;

    return {
      dots: certCount > 1,
      infinite: certCount > 1,
      speed: 500,
      slidesToShow: Math.min(3, certCount),
      slidesToScroll: 1,
      autoplay: certCount > 1,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      centerMode: false,
      variableWidth: false,
      arrows: false,
      ref: sliderRef,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: Math.min(2, certCount),
            centerMode: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            centerMode: false,
          },
        },
      ],
      customPaging: () => (
        <div className="w-2 h-2 mx-1 rounded-full bg-blue-200 hover:bg-blue-400 transition-colors duration-300" />
      ),
    };
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <Card className="max-w-lg mx-auto">
          <CardContent className="flex flex-col items-center p-6">
            <Badge variant="destructive" className="mb-4">
              Error
            </Badge>
            <p className="text-red-600">
              Error loading education data: {error}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const resolveImageUrl = (imagePath) => {
    if (!imagePath) {
      console.warn("No image path provided, using placeholder");
      return "/placeholder.jpg";
    }

    //console.log("Resolving image path:", imagePath);

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      //console.log("Using external URL:", imagePath);
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      const fullUrl = `${HOST}${imagePath}`;
      //console.log("Constructed full URL:", fullUrl);
      return fullUrl;
    }

    const fullUrl = `${HOST}/${imagePath}`;
    //console.log("Constructed full URL with slash:", fullUrl);
    return fullUrl;
  };

  const handleImageError = (e, cert) => {
    console.error("Image failed to load:", cert.imageUrl);
    console.error("Resolved URL was:", resolveImageUrl(cert.imageUrl));

    const alternativeUrls = [
      cert.imageUrl,
      cert.image,
      `/uploads/images/${cert.imageUrl?.split("/").pop()}`,
      `${HOST}/uploads/images/${cert.imageUrl?.split("/").pop()}`,
    ].filter(Boolean);

    console.log("Alternative URLs to try:", alternativeUrls);

    e.target.src = "/placeholder.jpg";
    e.target.onerror = null;
  };

  const certCount = educationData?.certificates?.length || 0;

  return (
    <section
      id="education"
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Education Journey
          </Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Academic & Certifications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-pink-500">
          {educationData?.education?.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}

          {educationData?.certificates?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute left-0 mt-3 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg ring-4 ring-white" />
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Professional Certifications
                  </h3>

                  {/* Conditional rendering based on certificate count */}
                  {certCount === 1 ? (
                    // Single certificate - no slider needed
                    <div className="flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer max-w-sm"
                        onClick={() => {
                          setActiveCertificate(educationData.certificates[0]);
                          setIsModalOpen(true);
                        }}
                      >
                        <Card className="w-full">
                          <CardContent className="p-0 flex flex-col">
                            <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg bg-gray-100">
                              <img
                                loading="lazy"
                                src={resolveImageUrl(
                                  educationData.certificates[0].imageUrl
                                )}
                                alt={educationData.certificates[0].title}
                                className="w-full h-full object-contain bg-white hover:scale-105 transition-transform duration-300"
                                onError={(e) =>
                                  handleImageError(
                                    e,
                                    educationData.certificates[0]
                                  )
                                }
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                {educationData.certificates[0].title}
                              </h4>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  ) : (
                    // Multiple certificates - use slider with external arrows
                    <div className="relative">
                      <CustomArrow
                        direction="prev"
                        onClick={handlePrev}
                        disabled={false} // You can add logic to disable based on current slide
                      />
                      <div className="certificate-slider-container px-4">
                        <Slider {...getSliderSettings()}>
                          {educationData.certificates.map((cert) => (
                            <div key={cert.id} className="px-2">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="cursor-pointer"
                                onClick={() => {
                                  setActiveCertificate(cert);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Card className="w-full">
                                  <CardContent className="p-0 flex flex-col">
                                    <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg bg-gray-100">
                                      <img
                                        loading="lazy"
                                        src={resolveImageUrl(cert.imageUrl)}
                                        alt={cert.title}
                                        className="w-full h-full object-contain bg-white hover:scale-105 transition-transform duration-300"
                                        onError={(e) =>
                                          handleImageError(e, cert)
                                        }
                                      />
                                    </div>
                                    <div className="p-3">
                                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 text-center">
                                        {cert.title}
                                      </h4>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </div>
                          ))}
                        </Slider>
                      </div>
                      <CustomArrow
                        direction="next"
                        onClick={handleNext}
                        disabled={false} // You can add logic to disable based on current slide
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle className="text-center font-bold">
                {activeCertificate?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-gray-100 max-h-96">
                <img
                  src={resolveImageUrl(activeCertificate?.imageUrl)}
                  alt={activeCertificate?.title}
                  className="w-full h-full object-contain bg-white"
                  onError={(e) => handleImageError(e, activeCertificate)}
                />
              </div>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Platform:</span>
                  {activeCertificate?.platform}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Completed:</span>
                  {activeCertificate?.date}
                </div>
                {activeCertificate?.credentialId && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Credential ID:</span>
                    {activeCertificate.credentialId}
                  </div>
                )}
                {activeCertificate?.credentialUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(activeCertificate.credentialUrl, "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Credential
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Education;
