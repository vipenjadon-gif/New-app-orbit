import dynamicIconImports from "lucide-react/dynamicIconImports";
import * as LucideIcons from "lucide-react";
import { ComponentType } from "react";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Generic Lucide icon renderer by string name.
 */
export function Icon({ name, className, size = 20, strokeWidth = 2 }: IconProps) {
  const iconName = (name.charAt(0).toUpperCase() + name.slice(1)) as keyof typeof LucideIcons;
  const IconComp = (LucideIcons[iconName] ||
    LucideIcons.Circle) as ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  return <IconComp className={className} size={size} strokeWidth={strokeWidth} />;
}

// Suppress unused import warning
void dynamicIconImports;
