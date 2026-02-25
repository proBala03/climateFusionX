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
        "glass-panel rounded-2xl relative overflow-hidden group",
        hoverable && "glass-panel-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Subtle top glow line */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-[1px] opacity-50",
        glowColor === "primary" ? "bg-gradient-to-r from-transparent via-primary to-transparent" : "",
        glowColor === "secondary" ? "bg-gradient-to-r from-transparent via-secondary to-transparent" : "",
      )} />
      
      {children}
    </motion.div>
  );
}
