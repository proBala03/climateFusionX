import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glowColor?: "primary" | "secondary" | "none";
}

export function GlassCard({ 
  children, 
  className, 
  hoverable = false,
  glowColor = "none",
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "neo-surface neo-shadow rounded-md relative overflow-hidden",
        hoverable && "neo-hover neo-press cursor-pointer",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-2",
          glowColor === "primary" && "bg-primary",
          glowColor === "secondary" && "bg-secondary",
          glowColor === "none" && "bg-transparent",
        )}
        aria-hidden="true"
      />
      
      {children}
    </motion.div>
  );
}
