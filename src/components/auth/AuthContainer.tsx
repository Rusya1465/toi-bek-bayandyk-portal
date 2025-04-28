
import { ReactNode } from "react";
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
