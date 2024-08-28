import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ChevronRight } from "lucide-react"; // Assuming you're using lucide-react for icons
import { Link } from "react-router-dom";

export default function QuickAccessCard({
  title,
  description,
  icon,
  linkTo,
  bgImage,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
  linkTo: string;
  bgImage?: string;
}) {
  return (
    <Link to={linkTo}>
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 group relative overflow-hidden flex">
        {bgImage && (
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div className="relative z-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex gap-1 text-lg font-medium items-center">
              {icon}
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">         
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </CardContent>
        </div>
        <div className="flex items-center px-2">
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}