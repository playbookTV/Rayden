import { forwardRef, useMemo, type HTMLAttributes } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Bubble, PolarArea } from "react-chartjs-2";
import { cn } from "../../utils/cn";
import { chartColors, chartFont } from "./theme";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

/* ─── Types ────────────────────────────────────────────────────────────── */

export type ChartType =
  | "line"
  | "bar"
  | "pie"
  | "doughnut"
  | "radar"
  | "scatter"
  | "bubble"
  | "polar-area";

export interface RaydenChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Chart type */
  type: ChartType;
  /** Chart.js data object */
  data: ChartData<any>;
  /** Chart.js options (merged with Rayna defaults) */
  options?: ChartOptions<any>;
  /** Chart height */
  height?: number;
  /** Chart width */
  width?: number;
}

/* ─── Default Options ──────────────────────────────────────────────────── */

function getDefaultOptions(type: ChartType): ChartOptions<any> {
  const base: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          font: { ...chartFont, size: 12 },
          color: chartColors.grey[500],
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: chartColors.grey[900],
        titleFont: { ...chartFont, weight: "bold" as const, size: 13 },
        bodyFont: { ...chartFont, size: 12 },
        cornerRadius: 8,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
  };

  if (type === "line" || type === "bar" || type === "scatter" || type === "bubble") {
    base.scales = {
      x: {
        grid: { color: chartColors.grey[100], drawTicks: false },
        ticks: { font: chartFont, color: chartColors.grey[400], padding: 8 },
        border: { display: false },
      },
      y: {
        grid: { color: chartColors.grey[100], drawTicks: false },
        ticks: { font: chartFont, color: chartColors.grey[400], padding: 8 },
        border: { display: false },
      },
    };
  }

  if (type === "line") {
    base.elements = {
      line: { tension: 0.4, borderWidth: 2 },
      point: { radius: 0, hoverRadius: 5, hitRadius: 20 },
    };
  }

  if (type === "bar") {
    base.elements = {
      bar: { borderRadius: 4 },
    };
  }

  if (type === "radar") {
    base.scales = {
      r: {
        grid: { color: chartColors.grey[200] },
        angleLines: { color: chartColors.grey[200] },
        pointLabels: { font: { ...chartFont, size: 11 }, color: chartColors.grey[500] },
        ticks: { display: false },
      },
    };
  }

  if (type === "polar-area") {
    base.scales = {
      r: {
        grid: { color: chartColors.grey[200] },
        ticks: { display: false },
      },
    };
  }

  return base;
}

/* ─── Merge Options ────────────────────────────────────────────────────── */

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object"
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

/* ─── Chart Component ──────────────────────────────────────────────────── */

const chartComponentMap = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  scatter: Scatter,
  bubble: Bubble,
  "polar-area": PolarArea,
} as const;

export const RaydenChart = forwardRef<HTMLDivElement, RaydenChartProps>(
  ({ type, data, options, height = 300, width, className, ...rest }, ref) => {
    const mergedOptions = useMemo(
      () => deepMerge(getDefaultOptions(type), options ?? {}),
      [type, options]
    );

    const ChartComponent = chartComponentMap[type] as any;

    return (
      <div ref={ref} className={cn("relative", className)} style={{ height, width }} {...rest}>
        <ChartComponent data={data} options={mergedOptions} />
      </div>
    );
  }
);

RaydenChart.displayName = "RaydenChart";

/* ─── Re-export theme utilities ────────────────────────────────────────── */
export { chartColors, chartFont, hexToRgba, createGradientFill } from "./theme";
