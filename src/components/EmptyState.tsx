
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionLink?: string;
  className?: string;
  iconClassName?: string;
}

const EmptyState = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionLink,
  className,
  iconClassName,
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && (
        <div className={cn("rounded-full bg-muted p-4 mb-4", iconClassName)}>
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-md">{description}</p>}
      {actionLabel && actionLink && (
        <Button asChild>
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
