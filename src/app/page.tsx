import Header from "@/components/Header";
import WeatherDashboard from "@/components/WeatherDashboard";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <WeatherDashboard />
      </main>
    </div>
  );
}
