import { createContext, useContext, useState, type ReactNode } from "react";
import type { Movie } from "../types/movie";

interface PreviewContextValue {
  previewMovie: Movie | null;
  openPreview: (movie: Movie) => void;
  closePreview: () => void;
}

const PreviewContext = createContext<PreviewContextValue | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const openPreview = (movie: Movie) => {
    setPreviewMovie(movie);
  };

  const closePreview = () => {
    setPreviewMovie(null);
  };

  return (
    <PreviewContext.Provider value={{ previewMovie, openPreview, closePreview }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview(): PreviewContextValue {
  const ctx = useContext(PreviewContext);
  if (!ctx) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return ctx;
}
