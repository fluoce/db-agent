import type { ReactElement } from "react";

export function PageHeader({
  description,
  icon,
  title,
}: {
  icon: ReactElement;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted flex items-center justify-center rounded-md p-2">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="line-clamp-1 truncate text-sm font-medium">
          {title}
        </span>
        <span className="text-muted-foreground text-xs font-medium">
          {description}
        </span>
      </div>
    </div>
  );
}
