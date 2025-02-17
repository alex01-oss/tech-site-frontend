import Image from "next/image";
import { useState, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import styles from "../styles/optimized-image.module.css";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  quality?: number;
  className?: string;
}

export default function CustomImage({
  src,
  alt,
  width,
  height,
  priority = false,
  objectFit = "contain",
  quality = 75,
  className,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (src && src.trim() !== "") {
      setIsLoading(true);
      setError(false);
      setImageSrc(src);
    } else {
      setImageSrc("/placeholder.svg");
    }
  }, [src]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setImageSrc("/placeholder.svg");
  };

  return (
    <Box
      className={`${styles.imageContainer} ${className || ""}`}
      sx={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
      }}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          animation="wave"
          className={styles.skeleton}
        />
      )}
      {imageSrc && !error && (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          onLoadingComplete={() => setIsLoading(false)}
          onError={handleError}
          className={styles.image}
          style={{
            objectFit,
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.2s ease-in-out",
          }}
          loading={priority ? "eager" : "lazy"}
          sizes={`(max-width: ${width}px) 100vw, ${width}px`}
        />
      )}
    </Box>
  );
}
