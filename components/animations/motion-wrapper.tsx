"use client";

import { motion, HTMLMotionProps } from "motion/react";
import React from "react";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function MotionDiv({ children, ...props }: MotionDivProps) {
  return <motion.div {...props}>{children}</motion.div>;
}
