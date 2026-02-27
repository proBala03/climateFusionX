"use client";

import { useEffect, useState } from "react";
import { type ClimateCondition, getClimateEmoji, getClimateColors } from "@/lib/climate-utils";

interface ClimateBackgroundProps {
  condition: ClimateCondition;
  isLoading?: boolean;
}

export function ClimateBackground({ condition, isLoading = false }: ClimateBackgroundProps) {
  const [displayCondition, setDisplayCondition] = useState<ClimateCondition>(condition);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (condition !== displayCondition) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayCondition(condition);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [condition, displayCondition]);

  const colors = getClimateColors(displayCondition);
  const emoji = getClimateEmoji(displayCondition);

  const renderWeatherElements = () => {
    switch (displayCondition) {
      case "Rainy":
        return <RainyBackground />;
      case "Sunny":
        return <SunnyBackground />;
      case "Cloudy":
        return <CloudyBackground />;
      case "Humid":
        return <HumidBackground />;
      case "Partly Cloudy":
        return <PartlyCloudyBackground />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} transition-all duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Weather elements */}
      {renderWeatherElements()}

      {/* Climate badge */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
        <div
          className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-500 ${
            isTransitioning
              ? "opacity-0 scale-95"
              : "opacity-100 scale-100"
          } ${colors.border} ${colors.accent}`}
        >
          <span className="text-3xl animate-bounce-gentle">{emoji}</span>
          <div className="text-center">
            <p className={`text-sm font-semibold ${colors.text}`}>{displayCondition}</p>
            {!isLoading && (
              <p className="text-xs text-muted-foreground">Current Climate</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Rainy background with animated falling water droplets
 */
function RainyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Rain droplets */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`raindrop-${i}`}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 + Math.random() * 20}%`,
            animation: `falling ${0.5 + Math.random() * 0.3}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Dark overlay for rainy atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-slate-900/5 to-transparent" />
    </div>
  );
}

/**
 * Sunny background with animated sun glow
 */
function SunnyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Animated sun glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-yellow-300 via-orange-300 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-slow"
        style={{
          animation: "sun-glow 4s ease-in-out infinite",
        }}
      />

      {/* Subtle light rays (optional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/10 via-transparent to-transparent" />
    </div>
  );
}

/**
 * Cloudy background with animated moving clouds
 */
function CloudyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated clouds */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute top-1/4 w-72 h-32 bg-slate-300 dark:bg-slate-600 rounded-full blur-3xl opacity-30"
          style={{
            left: `${-100 + i * 40}%`,
            animation: `cloud-drift ${8 + i * 2}s linear infinite`,
            animationDelay: `${i * -2}s`,
          }}
        />
      ))}

      {/* Cloud layer overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-400/10 via-slate-300/5 to-transparent" />
    </div>
  );
}

/**
 * Humid background with atmospheric moisture effect
 */
function HumidBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Mist/fog effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/15 via-blue-300/10 to-transparent animate-pulse-slow" />

      {/* Floating water particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`mist-${i}`}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Partly Cloudy background with subtle clouds
 */
function PartlyCloudyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Subtle clouds */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={`partial-cloud-${i}`}
          className="absolute top-1/3 w-96 h-24 bg-orange-200 dark:bg-orange-700 rounded-full blur-2xl opacity-20"
          style={{
            left: `${-80 + i * 50}%`,
            animation: `cloud-drift ${12 + i * 3}s linear infinite`,
            animationDelay: `${i * -3}s`,
          }}
        />
      ))}

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/10 via-yellow-100/5 to-transparent" />
    </div>
  );
}
