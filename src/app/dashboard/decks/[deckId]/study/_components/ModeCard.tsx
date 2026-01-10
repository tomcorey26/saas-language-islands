"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Headphones } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap = {
  BookOpen,
  MessageCircle,
  Headphones,
} as const;

interface ModeCardProps {
  href: string;
  iconName: keyof typeof iconMap;
  title: string;
  description: string;
  colorClass: string;
  index: number;
}

export function ModeCard({
  href,
  iconName,
  title,
  description,
  colorClass,
  index,
}: ModeCardProps) {
  const Icon = iconMap[iconName];
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="h-full"
      >
        <Card className="relative h-full cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/20">
          <CardHeader className="space-y-4 p-8">
            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br",
                colorClass
              )}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </Link>
  );
}
