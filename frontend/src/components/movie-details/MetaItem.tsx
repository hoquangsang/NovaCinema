import React from "react";

export interface MetaItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export default function MetaItem({ icon: Icon, children, className = "" }: MetaItemProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="inline-flex items-center">
        <Icon className="w-[1em] h-[1em] text-yellow-400" />
      </span>
      <span>{children}</span>
    </div>
  );
}
