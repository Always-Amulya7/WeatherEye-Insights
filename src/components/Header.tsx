import { CloudSun } from "lucide-react";
export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-card shadow-sm border-b">
      <div className="container mx-auto flex items-center gap-3">
        <CloudSun className="w-8 h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground tracking-tight">
          WeatherEye Insights
        </h1>
      </div>
    </header>
  );
}
