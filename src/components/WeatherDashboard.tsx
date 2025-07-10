"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Upload,
  Wind,
  Droplets,
  Cloud,
  Gauge,
  Eye,
  Thermometer,
  List,
  Loader2,
  Sparkles,
  Sun,
  Cloudy,
  CloudRain,
  Zap,
  Tornado,
  MapPin,
  Clock,
  Download,
  Map as MapIcon,
} from "lucide-react";
import { useLoadScript } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import WeatherCard from "./WeatherCard";
import DynamicWeatherDisplay from "./DynamicWeatherDisplay";
import Map from "./Map";
import LiveWeatherMap from "./LiveWeatherMap";
import HourlyForecastChart from "./HourlyForecastChart";
import LocationSearch from "./LocationSearch";
import { defaultLocation } from "@/lib/mock-data";
import type {
  ClusterAnalysisResult,
  SatelliteSummaryResult,
  WeatherData,
  CorrelationResult,
  LocationPin,
} from "@/lib/types";
import {
  analyzeCloudImage,
  getSatelliteSummary,
  getForecastForLocation,
  getCloudCorrelation,
} from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
const iconMap: { [key: string]: React.ElementType } = {
  Sun,
  Cloudy,
  Cloud,
  CloudRain,
  Zap,
  Tornado,
};
const libraries: "places"[] = ["places"];
function InfoWidget({
  icon: Icon,
  title,
  value,
  unit,
  children,
}: {
  icon: React.ElementType;
  title: string;
  value?: string | number;
  unit?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="bg-background/50 flex-1 p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        {value !== undefined && (
          <div className="text-2xl font-bold">
            {value}
            {unit && (
              <span className="text-xs text-muted-foreground ml-1">{unit}</span>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
export default function WeatherDashboard() {
  const [location, setLocation] = useState(defaultLocation);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<ClusterAnalysisResult | null>(null);
  const [summaryResult, setSummaryResult] =
    useState<SatelliteSummaryResult | null>(null);
  const [correlationResult, setCorrelationResult] =
    useState<CorrelationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isCorrelating, setIsCorrelating] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLocationsPopupOpen, setIsLocationsPopupOpen] = useState(false);
  const [isLiveMapOpen, setIsLiveMapOpen] = useState(false);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [isFetchingForecast, setIsFetchingForecast] = useState(true);
  const { toast } = useToast();
  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  const microForecastAverages = useMemo(() => {
    if (!correlationResult?.hourlyData?.length) return null;
    const total = correlationResult.hourlyData.length;
    if (total === 0) return null;
    const temp =
      correlationResult.hourlyData.reduce((acc, d) => acc + (d.temp || 0), 0) /
      total;
    const humidity =
      correlationResult.hourlyData.reduce(
        (acc, d) => acc + (d.humidity || 0),
        0
      ) / total;
    const precipitation =
      correlationResult.hourlyData.reduce(
        (acc, d) => acc + d.precipitationChance,
        0
      ) / total;
    return {
      temp: Math.round(temp),
      humidity: Math.round(humidity),
      precipitation: Math.round(precipitation),
    };
  }, [correlationResult]);
  const handleLocationSearch = useCallback(
    async (query: string) => {
      if (query) {
        setLocation(query);
        setIsFetchingForecast(true);
        const result = await getForecastForLocation(query);
        if ("error" in result) {
          toast({
            variant: "destructive",
            title: "Forecast Failed",
            description: result.error,
          });
        } else {
          const newForecast = result.forecast.map((day: any) => ({
            ...day,
            icon: iconMap[day.icon as keyof typeof iconMap] || Cloud,
          }));
          setForecast(newForecast);
        }
        setIsFetchingForecast(false);
      }
    },
    [toast]
  );
  useEffect(() => {
    handleLocationSearch(defaultLocation);
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
      setSummaryResult(null);
      setCorrelationResult(null);
      handleImageAnalysis(file);
    }
  };
  const handleImageAnalysis = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);
      setIsPopupOpen(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const result = await analyzeCloudImage(base64data);
        if ("error" in result) {
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: result.error,
          });
          setIsPopupOpen(false);
        } else {
          setAnalysisResult(result);
        }
        setIsAnalyzing(false);
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not read file.",
        });
        setIsAnalyzing(false);
        setIsPopupOpen(false);
      };
    },
    [toast]
  );
  const handleSummaryRequest = async () => {
    if (!analysisResult) return;
    setIsSummarizing(true);
    const satelliteData = `Identified cloud cluster: ${
      analysisResult.clusterType
    }. Observed patterns: ${
      analysisResult.patterns
    }. Confidence of identification: ${Math.round(
      analysisResult.confidence * 100
    )}%.`;
    const result = await getSatelliteSummary(satelliteData);
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: result.error,
      });
    } else {
      setSummaryResult(result);
    }
    setIsSummarizing(false);
  };
  const handleCorrelationRequest = async () => {
    if (!analysisResult || !uploadedImage) return;
    setIsCorrelating(true);
    setCorrelationResult(null);
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      const analysisText = `Cluster Type: ${analysisResult.clusterType}, Patterns: ${analysisResult.patterns}`;
      const result = await getCloudCorrelation(base64data, analysisText);
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: "Correlation Failed",
          description: result.error,
        });
      } else {
        setCorrelationResult(result);
      }
      setIsCorrelating(false);
    };
  };
  const handleDownloadData = useCallback(() => {
    if (!analysisResult) {
      toast({
        variant: "destructive",
        title: "No Data to Download",
        description: "Please generate an analysis first.",
      });
      return;
    }
    let fileContent = `WeatherEye Insights - Analysis Report\n`;
    fileContent += `===================================\n\n`;
    fileContent += `Cloud Cluster Analysis:\n`;
    fileContent += `-----------------------\n`;
    fileContent += `Cluster Type: ${analysisResult.clusterType}\n`;
    fileContent += `Observed Patterns: ${analysisResult.patterns}\n`;
    fileContent += `Confidence: ${Math.round(
      analysisResult.confidence * 100
    )}%\n\n`;
    if (summaryResult) {
      fileContent += `Meteorologist Summary:\n`;
      fileContent += `------------------------\n`;
      fileContent += `Summary: ${summaryResult.summary}\n`;
      fileContent += `Key Decision Points:\n`;
      summaryResult.keyDecisionPoints.forEach((point) => {
        fileContent += `  - ${point}\n`;
      });
      fileContent += `\n`;
    }
    if (correlationResult) {
      fileContent += `Micro-Forecast & Location Data:\n`;
      fileContent += `---------------------------------\n`;
      if (
        correlationResult.locationPins &&
        correlationResult.locationPins.length > 0
      ) {
        fileContent += `Plausible Locations:\n`;
        correlationResult.locationPins.forEach((loc, i) => {
          fileContent += `  - Location ${i + 1}: Lat ${loc.lat.toFixed(
            4
          )}, Lng ${loc.lng.toFixed(4)}\n`;
          if (loc.description) {
            fileContent += `    Reason: ${loc.description}\n`;
          }
        });
        fileContent += `\n`;
      } else {
        fileContent += `Estimated Location: Not available\n\n`;
      }
      fileContent += `3-Hour Hourly Forecast:\n`;
      correlationResult.hourlyData.forEach((data) => {
        fileContent += `  - Time: ${data.time}\n`;
        fileContent += `    Condition: ${data.condition}\n`;
        fileContent += `    Cloud Cover: ${data.cloudCover}%\n`;
        fileContent += `    Precipitation Chance: ${data.precipitationChance}%\n`;
        fileContent += `    Temp: ${data.temp}°C\n`;
        fileContent += `    Humidity: ${data.humidity}%\n\n`;
      });
    }
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "weathereye_analysis.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [analysisResult, summaryResult, correlationResult, toast]);
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {isLoaded ? (
              <LocationSearch
                onLocationSelect={handleLocationSearch}
                isFetchingForecast={isFetchingForecast}
              />
            ) : (
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  type="text"
                  placeholder="Loading locations..."
                  className="w-full pl-10"
                  disabled
                />
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-2">
              <Button
                onClick={() => setIsLiveMapOpen(true)}
                variant="outline"
                className="w-full md:w-auto"
              >
                <MapIcon className="mr-2 h-4 w-4" /> View Live Map
              </Button>
              <Button asChild variant="outline" className="w-full md:w-auto">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center justify-center"
                >
                  <Upload className="mr-2 h-4 w-4" /> Analyze Cloud Image
                  <input
                    id="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold font-headline">
          Weather for {location}
        </h2>
        <p className="text-muted-foreground">
          Today's weather alerts and 7-day forecast.
        </p>
      </div>
      <DynamicWeatherDisplay forecast={forecast} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {isFetchingForecast && forecast.length === 0
          ? Array.from({ length: 7 }).map((_, index) => (
              <Card
                key={index}
                className="w-full p-6 flex flex-col items-center justify-center gap-3"
              >
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-16 rounded-full mt-2" />
                <Skeleton className="h-10 w-16 mt-2" />
                <Skeleton className="h-5 w-24" />
              </Card>
            ))
          : forecast.map((data, index) => (
              <WeatherCard
                key={index}
                data={data}
                isToday={data.date === "Today"}
              />
            ))}
      </div>
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Cloud Cluster Analysis
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis and forecasting based on the uploaded
              satellite image.
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 overflow-y-auto p-1 flex-1 items-start">
            {}
            <div className="space-y-4">
              <Card>
                {previewUrl && (
                  <Image
                    data-ai-hint="satellite cloud"
                    src={previewUrl}
                    alt="Uploaded cloud"
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover w-full aspect-video"
                  />
                )}
              </Card>

              {isAnalyzing && !analysisResult && (
                <Card className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4 text-muted-foreground">
                    Analyzing image...
                  </p>
                </Card>
              )}
              {analysisResult && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />{" "}
                        Micro-Forecast
                      </CardTitle>
                      <CardDescription className="text-xs">
                        A 3-hour outlook based on cloud patterns.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isCorrelating ? (
                        <div className="flex items-center justify-center h-[250px]">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="ml-4 text-muted-foreground">
                            Correlating data...
                          </p>
                        </div>
                      ) : correlationResult ? (
                        <div className="-mx-6 -mb-6">
                          <HourlyForecastChart
                            data={correlationResult.hourlyData}
                          />
                        </div>
                      ) : (
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-3">
                            Generate an hourly micro-forecast for this specific
                            cloud formation.
                          </p>
                          <Button
                            onClick={handleCorrelationRequest}
                            disabled={isCorrelating}
                          >
                            <Clock className="mr-2 h-4 w-4" /> Correlate Data
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {correlationResult && microForecastAverages && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Gauge className="w-5 h-5 text-primary" /> 3-Hour
                          Averages
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Average conditions for the next 3 hours.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-3 gap-4 !pt-2">
                        <InfoWidget
                          icon={Thermometer}
                          title="Avg Temp"
                          value={microForecastAverages.temp}
                          unit="°C"
                        />
                        <InfoWidget
                          icon={Droplets}
                          title="Avg Humidity"
                          value={microForecastAverages.humidity}
                          unit="%"
                        />
                        <InfoWidget
                          icon={CloudRain}
                          title="Avg Precip."
                          value={microForecastAverages.precipitation}
                          unit="%"
                        />
                      </CardContent>
                    </Card>
                  )}
                  {correlationResult?.locationPins &&
                    correlationResult.locationPins.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />{" "}
                            Plausible Locations
                          </CardTitle>
                          <CardDescription className="text-xs">
                            This cloud formation could be occurring in several
                            locations.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            onClick={() => setIsLocationsPopupOpen(true)}
                            className="w-full"
                          >
                            <MapPin className="mr-2 h-4 w-4" /> View on Map
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                </>
              )}
            </div>
            {}
            <div className="space-y-4">
              {analysisResult && (
                <>
                  <Card className="p-4">
                    <CardTitle className="mb-4 text-lg flex items-center gap-2">
                      <List className="w-5 h-5 text-primary" /> Analysis Details
                    </CardTitle>
                    <div className="space-y-4">
                      <InfoWidget
                        icon={Cloud}
                        title="Cluster Type"
                        value={analysisResult.clusterType}
                      />
                      <InfoWidget icon={Gauge} title="Confidence">
                        <Progress
                          value={analysisResult.confidence * 100}
                          className="w-full h-2 mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {Math.round(analysisResult.confidence * 100)}%
                        </p>
                      </InfoWidget>
                      <InfoWidget icon={Eye} title="Observed Patterns">
                        <div className="text-sm font-normal text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg border">
                          {analysisResult.patterns}
                        </div>
                      </InfoWidget>
                    </div>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />{" "}
                        Meteorologist Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isSummarizing ? (
                        <div className="flex items-center justify-center h-24">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="ml-4 text-muted-foreground">
                            Generating summary...
                          </p>
                        </div>
                      ) : summaryResult ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              Summary
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {summaryResult.summary}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              Key Decision Points
                            </h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {summaryResult.keyDecisionPoints.map(
                                (point, i) => (
                                  <li key={i}>{point}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-3">
                            Generate a detailed summary and key decision points
                            from a meteorologist's perspective.
                          </p>
                          <Button
                            onClick={handleSummaryRequest}
                            disabled={isSummarizing}
                          >
                            <Sparkles className="mr-2 h-4 w-4" /> Get Summary
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    {summaryResult && (
                      <CardFooter>
                        <Button onClick={handleDownloadData} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Full Report
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isLiveMapOpen} onOpenChange={setIsLiveMapOpen}>
        <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-primary" /> Live Weather Map
            </DialogTitle>
            <DialogDescription>
              Click anywhere on the map to get a 7-day forecast for that
              location.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <LiveWeatherMap isLoaded={isLoaded} loadError={loadError} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isLocationsPopupOpen}
        onOpenChange={setIsLocationsPopupOpen}
      >
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" /> Plausible Locations
            </DialogTitle>
            <DialogDescription>
              Based on the cloud patterns, the AI has identified these plausible
              locations.
            </DialogDescription>
          </DialogHeader>
          {correlationResult?.locationPins &&
            correlationResult.locationPins.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 pt-4 flex-1 min-h-0">
                <div className="h-full rounded-lg overflow-hidden border">
                  <Map
                    locations={correlationResult.locationPins}
                    isLoaded={isLoaded}
                    loadError={loadError}
                  />
                </div>
                <div className="relative h-full">
                  <ScrollArea className="absolute inset-0 pr-4">
                    <ul className="space-y-3 text-sm">
                      {correlationResult.locationPins.map((loc, i) => (
                        <li
                          key={i}
                          className="p-3 bg-card rounded-lg border transition-all hover:border-primary hover:shadow-md"
                        >
                          <p className="font-semibold text-base font-headline">
                            Location {i + 1}
                          </p>
                          <p className="text-muted-foreground text-xs mt-1 font-mono">
                            ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
                          </p>
                          {loc.description && (
                            <p className="text-muted-foreground text-sm italic mt-2 border-l-2 border-primary/50 pl-3">
                              {loc.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
