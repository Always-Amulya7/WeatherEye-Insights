"use client";
import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { CorrelationResult } from "@/lib/types";
import type { ChartConfig } from "@/components/ui/chart";
interface HourlyForecastChartProps {
  data: CorrelationResult["hourlyData"];
}
const chartConfig = {
  temp: {
    label: "Temperature",
    color: "hsl(var(--primary))",
  },
  precipitationChance: {
    label: "Precipitation",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
export default function HourlyForecastChart({
  data,
}: HourlyForecastChartProps) {
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <ChartContainer config={chartConfig} className="w-full h-[250px]">
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="var(--color-temp)"
          tickFormatter={(value) => `${value}°C`}
          fontSize={12}
          domain={["dataMin - 2", "dataMax + 2"]}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="var(--color-precipitationChance)"
          tickFormatter={(value) => `${value}%`}
          fontSize={12}
          domain={[0, 100]}
        />
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent indicator="line" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="precipitationChance"
          name="Precipitation"
          yAxisId="right"
          fill="var(--color-precipitationChance)"
          radius={4}
        />
        <Line
          dataKey="temp"
          name="Temperature"
          yAxisId="left"
          type="monotone"
          stroke="var(--color-temp)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-temp)",
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
