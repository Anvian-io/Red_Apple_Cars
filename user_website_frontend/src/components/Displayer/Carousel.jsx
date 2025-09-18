// components/Carousel.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight, Circle } from "@mui/icons-material";

const Carousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Enhanced banner data with CTAs and product info
  const banners = [
    {
      id: 1,
      name: "Luxury Cars",
      title: "Premium Collection",
      description: "Discover our exclusive luxury vehicles with special financing options",
      cta: "Explore Now",
      discount: "15% OFF",
      image_url: "https://s3.caradvice.com.au/wp-content/uploads/2015/11/2016_mercedes-amg_sl65_06.jpg",
      image_url_mobile: "https://wallpapers.com/images/hd/mercedes-benz-phone-cjmqk71q9x7cuj1n.jpg",
      color: "#1a365d"
    },
    {
      id: 2,
      name: "Family Vehicles",
      title: "Family Specials",
      description: "Spacious and safe vehicles for your family adventures",
      cta: "Shop Family Cars",
      discount: "0% APR Financing",
      image_url: "https://media.torque.com.sg/public/2018/06/P90306641_highRes_the-all-new-bmw-8-se.jpg",
      image_url_mobile: "https://i.pinimg.com/originals/a7/26/68/a726684d84bf62f0f059206e27c97b8b.jpg",
      color: "#2d4c75"
    },
    {
      id: 3,
      name: "Sports Cars",
      title: "Performance Series",
      description: "Experience thrilling performance with our sports collection",
      cta: "View Models",
      discount: "Limited Edition",
      image_url: "https://assets.adac.de/image/upload/v1/Autodatenbank/Fahrzeugbilder/im05875-1-audi-a5.jpg",
      image_url_mobile: "https://wallpaperaccess.com/full/8236215.jpg",
      color: "#742323"
    }
  ];

  // Auto-play functionality (pauses when hovered)
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

    if (distance > minSwipeDistance) {
      // Swipe left - go to next slide
      goToNext();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - go to previous slide
      goToPrev();
    }
    
    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const currentBanner = banners[currentSlide];
  const imageUrl = isMobile && currentBanner.image_url_mobile 
    ? currentBanner.image_url_mobile 
    : currentBanner.image_url;

  return (
    <Box 
      sx={{ 
        position: "relative", 
        width: "100%", 
        overflow: "hidden",
        height: isMobile ? "450px" : "650px",
        touchAction: "pan-y" // Allow vertical scrolling but prevent horizontal
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Container with Fade Transition */}
      <Box sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}>
        {banners.map((banner, index) => (
          <Box
            key={banner.id}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              zIndex: currentSlide === index ? 1 : 0,
              backgroundImage: `url(${isMobile && banner.image_url_mobile ? banner.image_url_mobile : banner.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
              }
            }}
          >
            {/* Content Overlay */}
            <Box sx={{
              position: "relative",
              zIndex: 2,
              color: "white",
              px: 2,
              maxWidth: "600px",
              ml: isMobile ? 2 : 8,
              mt: isMobile ? 4 : 0
            }}>
              {banner.discount && (
                <Box sx={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  borderRadius: "4px",
                  mb: 2,
                  fontSize: isMobile ? "0.8rem" : "1rem",
                  fontWeight: "bold"
                }}>
                  {banner.discount}
                </Box>
              )}
              
              <Typography 
                variant={isMobile ? "h4" : "h2"} 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
                }}
              >
                {banner.title}
              </Typography>
              
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                sx={{ 
                  mb: 3, 
                  maxWidth: "500px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                }}
              >
                {banner.description}
              </Typography>
              
              <Button 
                variant="contained" 
                size="large"
                sx={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#b91c1c",
                    transform: "translateY(-2px)",
                    boxShadow: 3
                  },
                  transition: "all 0.3s ease"
                }}
              >
                {banner.cta}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10
        }}
      >
        {banners.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: currentSlide === index ? "primary.main" : "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: currentSlide === index ? "primary.dark" : "rgba(255, 255, 255, 0.8)",
                transform: "scale(1.2)"
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </Box>

      {/* Navigation Arrows - Hidden on Mobile */}
      {!isMobile && (
        <>
          <Box
            onClick={goToPrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: "20px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              color: "primary.main",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
                transform: "translateY(-50%) scale(1.1)"
              },
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft sx={{ fontSize: 32 }} />
          </Box>

          <Box
            onClick={goToNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: "20px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              color: "primary.main",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
                transform: "translateY(-50%) scale(1.1)"
              },
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
            aria-label="Next slide"
          >
            <ChevronRight sx={{ fontSize: 32 }} />
          </Box>
        </>
      )}

      
    </Box>
  );
};

export default Carousel;