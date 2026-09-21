// Charts live behind their own subpath so that `chart.js` and `react-chartjs-2`
// — declared optional in peerDependenciesMeta — are only evaluated by consumers
// that actually import a chart. Re-exporting these from the package root made
// the optional peers mandatory for every Node/SSR import of `@raydenui/ui`.
export {
  RaydenChart,
  chartColors,
  chartFont,
  hexToRgba,
  createGradientFill,
} from "./components/Chart";
export type { RaydenChartProps, ChartType } from "./components/Chart";
