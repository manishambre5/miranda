import { useState, useEffect } from 'react';

import notebookIcon from '../assets/undraw_notebook_jy1h.svg';
import cellsIcon from '../assets/undraw_notes_dyq8.svg';
import guideIcon from '../assets/undraw_work-in-progress_m95a.svg';

const SLIDES = [
  { src: notebookIcon, tagline: 'Capture your thoughts in a miranda notebook.' },
  { src: cellsIcon, tagline: 'Organize with dynamic cells.' },
  { src: guideIcon, tagline: 'Check out the Quick Start Guide to get started!' },
];

const FeatureSpotlight = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center select-none">
      <div className="relative w-full h-96 flex items-center justify-center">
        {SLIDES.map((slide, i) => (
            <div key={slide.src} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${i === index ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <img src={slide.src} alt={slide.tagline} className="w-full h-full mb-6 drop-shadow-sm transition-transform duration-700" />
                <p className="text-balance text-xl font-medium tracking-tight text-slate-600">
                    {slide.tagline}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSpotlight;