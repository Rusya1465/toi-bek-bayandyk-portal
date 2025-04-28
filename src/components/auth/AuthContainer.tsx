
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthContainer = ({
  title,
  description,
  children,
  footer,
}: AuthContainerProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-65px)] max-w-md mx-auto w-full px-4 pt-4 pb-safe overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex-1">
          {children}
        </div>
        {footer && <div className="mt-6 flex justify-center">{footer}</div>}
      </div>
    );
  }

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && <CardFooter className="flex justify-center">{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthContainer;
