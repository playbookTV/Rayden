import { forwardRef, useId, useMemo, type HTMLAttributes } from "react";
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
  /** Accessible name for the chart. Without this the canvas is an unnamed role="img". */
  title?: string;
  /** Optional plain-language summary announced alongside the chart. */
  summary?: string;
  /**
   * Render a visually hidden data table equivalent to the chart. Defaults to true
   * so the underlying numbers are never canvas-only. Set false when an equivalent
   * table is already present elsewhere on the page.
   */
  dataTable?: boolean;
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

/** Render one dataset value as text for the accessible table. */
function formatCell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (typeof value === "object") {
    const point = value as { x?: unknown; y?: unknown; r?: unknown };
    if ("y" in point) {
      const xy = `${String(point.x ?? "")}, ${String(point.y ?? "")}`;
      return "r" in point ? `${xy}, ${String(point.r)}` : xy;
    }
  }
  return String(value);
}

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
  (
    {
      type,
      data,
      options,
      height = 300,
      width,
      className,
      title,
      summary,
      dataTable = true,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const mergedOptions = useMemo(
      () => deepMerge(getDefaultOptions(type), options ?? {}),
      [type, options]
    );

    const ChartComponent = chartComponentMap[type] as any;

    const generatedId = useId();
    const summaryId = summary ? `${generatedId}-summary` : undefined;
    const tableId = `${generatedId}-table`;

    // react-chartjs-2 hardcodes role="img" on the canvas. Without a name that is an
    // unlabelled image; without a tabular equivalent the values are canvas-only.
    const labels = (data?.labels ?? []) as unknown[];
    const datasets = (data?.datasets ?? []) as { label?: string; data?: unknown[] }[];
    // Scatter and bubble data carries no `labels` — its points are {x, y} / {x, y, r}
    // objects. Keying the table off labels alone left those charts with no alternative
    // at all, so fall back to one row per point index.
    const rowCount = labels.length || Math.max(0, ...datasets.map((d) => d.data?.length ?? 0));
    const pointBased = labels.length === 0;
    const showTable = dataTable && rowCount > 0 && datasets.length > 0;

    // Last-resort name so the canvas is never an unnamed role="img". Callers should
    // pass a meaningful `title`; this only keeps the default case from being nameless.
    const fallbackName = `${type.replace("-", " ")} chart`;
    const resolvedName = title ?? ariaLabel ?? fallbackName;

    const describedBy =
      [ariaDescribedBy, summaryId, showTable ? tableId : undefined].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div ref={ref} className={cn("relative", className)} style={{ height, width }} {...rest}>
        <ChartComponent
          data={data}
          options={mergedOptions}
          aria-label={ariaLabelledBy ? undefined : resolvedName}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          fallbackContent={<p>{resolvedName}</p>}
        />
        {summary && (
          <p id={summaryId} className="sr-only">
            {summary}
          </p>
        )}
        {showTable && (
          <table id={tableId} className="sr-only">
            <caption>{`${resolvedName} — data table`}</caption>
            <thead>
              <tr>
                <th scope="col">{pointBased ? "Point" : "Category"}</th>
                {datasets.map((set, i) => (
                  <th key={i} scope="col">
                    {set.label ?? `Series ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }, (_, row) => (
                <tr key={row}>
                  <th scope="row">{pointBased ? row + 1 : String(labels[row])}</th>
                  {datasets.map((set, i) => (
                    <td key={i}>{formatCell(set.data?.[row])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
);

RaydenChart.displayName = "RaydenChart";

/* ─── Re-export theme utilities ────────────────────────────────────────── */
export { chartColors, chartFont, hexToRgba, createGradientFill } from "./theme";
