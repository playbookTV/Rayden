import type { Meta, StoryObj } from "@storybook/react";
import { RaydenChart, chartColors, hexToRgba } from "./Chart";

const meta: Meta<typeof RaydenChart> = {
  title: "Components/Chart",
  component: RaydenChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RaydenChart>;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const LineChart: Story = {
  args: {
    type: "line",
    height: 300,
    data: {
      labels: months,
      datasets: [
        {
          label: "Revenue",
          data: [30, 45, 38, 55, 48, 60, 72, 65, 80, 75, 90, 88],
          borderColor: chartColors.semantic[0],
          backgroundColor: hexToRgba(chartColors.semantic[0], 0.1),
          fill: true,
        },
        {
          label: "Expenses",
          data: [20, 30, 25, 35, 30, 40, 45, 42, 50, 48, 55, 52],
          borderColor: chartColors.semantic[2],
          backgroundColor: hexToRgba(chartColors.semantic[2], 0.1),
          fill: true,
        },
      ],
    },
  },
};

export const BarChart: Story = {
  args: {
    type: "bar",
    height: 300,
    data: {
      labels: months.slice(0, 7),
      datasets: [
        {
          label: "Sales",
          data: [120, 190, 130, 150, 220, 180, 250],
          backgroundColor: chartColors.primary[0],
        },
        {
          label: "Returns",
          data: [20, 30, 15, 25, 35, 20, 30],
          backgroundColor: chartColors.primary[2],
        },
      ],
    },
  },
};

export const PieChart: Story = {
  args: {
    type: "pie",
    height: 300,
    data: {
      labels: ["Direct", "Organic", "Referral", "Social", "Email"],
      datasets: [
        {
          data: [35, 25, 20, 12, 8],
          backgroundColor: chartColors.semantic,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
  },
};

export const DoughnutChart: Story = {
  args: {
    type: "doughnut",
    height: 300,
    data: {
      labels: ["Completed", "In Progress", "Pending", "Cancelled"],
      datasets: [
        {
          data: [45, 25, 20, 10],
          backgroundColor: [
            chartColors.semantic[0],
            chartColors.semantic[1],
            chartColors.semantic[3],
            chartColors.grey[300],
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      cutout: "65%",
    },
  },
};

export const RadarChart: Story = {
  args: {
    type: "radar",
    height: 350,
    data: {
      labels: ["Speed", "Reliability", "Comfort", "Safety", "Efficiency", "Design"],
      datasets: [
        {
          label: "Model A",
          data: [85, 90, 70, 95, 80, 75],
          borderColor: chartColors.semantic[0],
          backgroundColor: hexToRgba(chartColors.semantic[0], 0.15),
          pointBackgroundColor: chartColors.semantic[0],
        },
        {
          label: "Model B",
          data: [70, 80, 90, 75, 85, 90],
          borderColor: chartColors.semantic[2],
          backgroundColor: hexToRgba(chartColors.semantic[2], 0.15),
          pointBackgroundColor: chartColors.semantic[2],
        },
      ],
    },
  },
};

export const ScatterChart: Story = {
  args: {
    type: "scatter",
    height: 300,
    data: {
      datasets: [
        {
          label: "Dataset A",
          data: Array.from({ length: 30 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
          })),
          backgroundColor: hexToRgba(chartColors.semantic[0], 0.6),
          pointRadius: 5,
        },
        {
          label: "Dataset B",
          data: Array.from({ length: 30 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
          })),
          backgroundColor: hexToRgba(chartColors.semantic[2], 0.6),
          pointRadius: 5,
        },
      ],
    },
  },
};

export const PolarAreaChart: Story = {
  args: {
    type: "polar-area",
    height: 300,
    data: {
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
      datasets: [
        {
          data: [11, 16, 7, 14, 10],
          backgroundColor: chartColors.semantic.map((c) => hexToRgba(c, 0.6)),
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
  },
};

export const StackedBar: Story = {
  args: {
    type: "bar",
    height: 300,
    data: {
      labels: months.slice(0, 6),
      datasets: [
        {
          label: "Product A",
          data: [40, 55, 45, 60, 50, 70],
          backgroundColor: chartColors.semantic[0],
        },
        {
          label: "Product B",
          data: [30, 40, 35, 45, 40, 50],
          backgroundColor: chartColors.semantic[1],
        },
        {
          label: "Product C",
          data: [20, 25, 20, 30, 25, 35],
          backgroundColor: chartColors.semantic[2],
        },
      ],
    },
    options: {
      scales: {
        x: { stacked: true },
        y: { stacked: true },
      },
    },
  },
};

export const HorizontalBar: Story = {
  args: {
    type: "bar",
    height: 300,
    data: {
      labels: ["Marketing", "Sales", "Engineering", "Design", "Support"],
      datasets: [
        {
          label: "Budget",
          data: [85, 72, 95, 60, 45],
          backgroundColor: chartColors.primary[0],
        },
      ],
    },
    options: {
      indexAxis: "y" as const,
    },
  },
};
