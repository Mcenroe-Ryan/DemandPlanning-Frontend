import React, { useMemo, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Checkbox,
  Box,
} from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import HelpOutline from "@mui/icons-material/HelpOutline";
import TrendingUp from "@mui/icons-material/TrendingUp";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Tune from "@mui/icons-material/Tune";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ReferenceLine,
  LabelList,
  Cell,
  ResponsiveContainer,
} from "recharts";

import NewRecommendationScreen from "./ScenarioSimulation";

/* ===== JSON: adjust the path to your file ===== */
import scenarioData from "../assets/supply_chain_data.json";

/* ===== Layout constants ===== */
const MAX_APP_WIDTH = 1600;
const SIDEBAR_W = "clamp(280px, 18vw, 320px)";
// const RIGHT_W = "clamp(340px, 24vw, 520px)";
const RIGHT_W = "clamp(460px, 28vw, 640px)";
const GRAPH_HEIGHT = 220;

/* ---- Mobile chart enhancer (drag/zoom + scrollbars) ---- */
const enhanceForMobileDrag = (opts, isSmall, graphHeight) => {
  if (!isSmall) return opts;
  return {
    ...opts,
    chart: {
      ...opts.chart,
      zoomType: "xy",
      zooming: { type: "xy", singleTouch: true, mouseWheel: true },
      panning: { enabled: true, type: "xy" },
      scrollablePlotArea: {
        minWidth: 900,
        minHeight: (graphHeight || GRAPH_HEIGHT) + 80,
      },
    },
    tooltip: { ...opts.tooltip, followTouchMove: true },
  };
};

/* ========= currency helpers ========= */
const getMoneyUnit = (symbol) =>
  symbol === "₹"
    ? { scale: 100000, axis: "₹ in Lakhs", suffix: "L" }
    : { scale: 1000, axis: `${symbol} in Thousands`, suffix: "K" };

const to1 = (n) => Math.round(n * 10) / 10;
const fmtInt = (n) => Number(n ?? 0).toLocaleString();
const fmtCurrency = (n, symbol) =>
  `${symbol} ${Number(n ?? 0).toLocaleString(
    symbol === "₹" ? "en-IN" : "en-US"
  )}`;

/* =====================  SIDEBAR  ===================== */

function SidebarBox({ scenarios, selectedScenario, setSelectedScenario }) {
  const getTypeChipColor = (typeColor) => {
    switch (typeColor) {
      case "info":
        return { backgroundColor: "#2196f3", color: "white" };
      case "error":
        return { backgroundColor: "#ff9800", color: "white" };
      case "success":
        return { backgroundColor: "#4caf50", color: "white" };
      case "primary":
        return { backgroundColor: "#9c27b0", color: "white" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#424242" };
    }
  };

  return (
    <Box
      sx={{
        width: { xs: 280, md: SIDEBAR_W },
        backgroundColor: "#fff",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        sx={{
          p: 1.5,
          backgroundColor: "#f8f9fa",
          borderBottom: 1,
          borderColor: "grey.300",
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <HelpOutline sx={{ fontSize: 14, color: "#666" }} />
            <Typography variant="body2" fontSize={13} fontWeight={600}>
              What-If Scenarios?
            </Typography>
          </Stack>
          <Typography variant="caption" color="#999" sx={{ fontSize: 11 }}>
            Select a scenario to analyze its impact on demand planning.
          </Typography>
        </Stack>
        <IconButton size="small">
          <MoreVert sx={{ fontSize: 16, color: "#1976d2" }} />
        </IconButton>
      </Stack>

      <Stack
        sx={{ p: 1, borderBottom: 1, borderColor: "grey.300" }}
        direction="row"
        alignItems="center"
      >
        <Search sx={{ fontSize: 16, color: "#999", mr: 1 }} />
        <TextField
          placeholder="Search scenarios"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
            "& input": { fontSize: 12 },
          }}
        />
      </Stack>

      <Stack sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {scenarios.map((s) => (
            <ListItem
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              sx={{
                cursor: "pointer",
                backgroundColor:
                  selectedScenario?.id === s.id ? "#e3f2fd" : "transparent",
                borderLeft:
                  selectedScenario?.id === s.id ? "3px solid #1976d2" : "none",
                "&:hover": { backgroundColor: "#f5f5f5" },
                borderBottom: "1px solid #f0f0f0",
                alignItems: "flex-start",
                p: 1,
              }}
            >
              <Stack sx={{ flex: 1 }} spacing={0.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <TrendingUp sx={{ fontSize: 12, color: "#666" }} />
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}
                      >
                        {s.name}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="#666"
                      sx={{ fontSize: 11, lineHeight: 1.2 }}
                    >
                      {s.description}
                    </Typography>
                  </Stack>
                  <IconButton size="small" sx={{ mt: -0.5 }}>
                    <MoreVert sx={{ fontSize: 14 }} />
                  </IconButton>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                  <Chip
                    label={s.type}
                    size="small"
                    sx={{
                      ...getTypeChipColor(s.typeColor),
                      fontSize: 9,
                      fontWeight: 500,
                      height: 18,
                    }}
                  />
                  <Chip
                    label={s.impact}
                    size="small"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      color: "#424242",
                      fontSize: 9,
                      fontWeight: 500,
                      height: 18,
                    }}
                  />
                  <Chip
                    label={s.duration}
                    size="small"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      color: "#424242",
                      fontSize: 9,
                      fontWeight: 500,
                      height: 18,
                    }}
                  />
                </Stack>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
}

/* =====================  SMALL HEADER (above forecast chart)  ===================== */

const legendItems = [
  {
    id: "actual",
    label: "Actual",
    indicator: <FiberManualRecord sx={{ fontSize: 10, color: "#0891b2" }} />,
  },
  {
    id: "forecast",
    label: "Forecast",
    indicator: <MoreHoriz sx={{ fontSize: 15, color: "#64748b" }} />,
  },
];

function ChartSectionHeader({
  header,
  selectedSkuId,
  skuOptions,
  onChangeSku,
}) {
  const labelSx = { fontWeight: 600, color: "#475569", fontSize: 12 };
  const valueSx = { color: "#475569", fontSize: 12, ml: 0.5 };

  return (
    <Stack spacing={1.25} sx={{ p: 1.25 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        flexWrap="nowrap"
        sx={{ overflowX: "auto", pb: 0.25 }}
      >
        {header.map((item, idx) => (
          <Stack
            key={idx}
            direction="row"
            alignItems="center"
            sx={{ whiteSpace: "nowrap" }}
          >
            {idx > 0 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, height: 16 }}
              />
            )}
            <Typography variant="body2" sx={labelSx}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={valueSx}>
              {item.value}
            </Typography>
          </Stack>
        ))}
        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16 }} />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" sx={labelSx}>
            SKU:
          </Typography>
          <FormControl size="small">
            <Select
              value={selectedSkuId}
              onChange={(e) => onChangeSku(e.target.value)}
              sx={{
                height: 24,
                width: 160,
                "& .MuiSelect-select": {
                  p: "2px 8px",
                  fontSize: 12,
                  color: "#2563eb",
                  textDecoration: "underline",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                  borderRadius: "3px",
                },
              }}
            >
              {skuOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.value} — {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {legendItems.map((item) => (
          <Chip
            key={item.id}
            icon={item.indicator}
            label={item.label}
            variant="outlined"
            sx={{
              backgroundColor: "#eff6ff",
              borderColor: "#cbd5e1",
              borderRadius: "5px",
              height: 26,
              "& .MuiChip-label": { fontSize: 12, color: "#475569" },
              "& .MuiChip-icon": { ml: "8px", "& svg": { fontSize: 12 } },
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

/* =====================  DISRUPTIONS  ===================== */

function DisruptionList({ rowsFromJson }) {
  const [rows, setRows] = useState(
    (rowsFromJson || []).map((r, i) => ({
      id: i + 1,
      checked: !!r.selected,
      dateStr: r.date,
      message: `${r.location}: ${r.description}`,
    }))
  );
  useEffect(() => {
    setRows(
      (rowsFromJson || []).map((r, i) => ({
        id: i + 1,
        checked: !!r.selected,
        dateStr: r.date,
        message: `${r.location}: ${r.description}`,
      }))
    );
  }, [rowsFromJson]);

  const toggle = (id) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
    );

  return (
    <Stack sx={{ px: 1.25, py: 1 }} spacing={0.5}>
      {rows.map((r) => (
        <Stack
          key={r.id}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 1,
            py: 0.75,
            borderRadius: 1,
            "&:hover": { backgroundColor: "rgba(2,6,23,0.03)" },
          }}
        >
          <Checkbox
            size="small"
            checked={r.checked}
            onChange={() => toggle(r.id)}
            sx={{ p: 0.5, mr: 0.5 }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#334155",
              minWidth: 175,
              fontSize: 12.5,
              textDecoration: r.checked ? "line-through" : "none",
            }}
          >
            {r.dateStr}
          </Typography>
          <ErrorOutline sx={{ color: "#ef4444", fontSize: 18, mr: 0.5 }} />
          <Typography
            variant="body2"
            sx={{
              color: "#334155",
              fontSize: 13,
              textDecoration: r.checked ? "line-through" : "none",
            }}
          >
            {r.message}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

/* =====================  FORECAST CHART CARD (TOP)  ===================== */

function ForecastChartCard({
  sku,
  selectedSkuId,
  skuOptions,
  onChangeSku,
  height = 180,
}) {
  const [mainTabValue, setMainTabValue] = useState(0);

  // Responsive flags
  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));
  const upXl = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const graphHeight = upXl
    ? Math.max(height, 160)
    : upLg
    ? Math.max(height - 20, 150)
    : height;

  // ---- Dynamic size based on the card container (match Graph 2) ----
  const [containerHeight, setContainerHeight] = useState(400);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = React.useRef(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const rect = containerRef.current.getBoundingClientRect();
      // room for header/legend above inside this card section
      // const availableHeight = Math.max(300, rect.height - 140);
      const availableHeight = Math.max(200, rect.height - 110);
      const availableWidth = Math.max(700, rect.width - 40); // padding
      setContainerHeight(availableHeight);
      setContainerWidth(availableWidth);

      if (chartRef.current?.chart) {
        chartRef.current.chart.setSize(availableWidth, availableHeight, false);
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const chartWidth = containerWidth;

  // Build x categories & series from JSON (thousands for readability)
  const df = sku?.demandForecast || { actual: [], forecast: [] };
  const allWeeks = useMemo(() => {
    const s = new Set();
    (df.actual || []).forEach((a) => s.add(a.week));
    (df.forecast || []).forEach((f) => s.add(f.week));
    return Array.from(s).sort((a, b) => a - b);
  }, [df]);

  const actualMap = new Map(
    (df.actual || []).map((d) => [d.week, d.units / 1000])
  );
  const forecastMap = new Map(
    (df.forecast || []).map((d) => [d.week, d.units / 1000])
  );
  const categories = allWeeks.map((w) => `Week ${w}`);
  const actualSeries = allWeeks.map((w) =>
    actualMap.has(w) ? to1(actualMap.get(w)) : null
  );
  const forecastSeries = allWeeks.map((w) =>
    forecastMap.has(w) ? to1(forecastMap.get(w)) : null
  );
  const lastActualIdx = Math.max(
    ...(df.actual || []).map((d) => allWeeks.indexOf(d.week)),
    0
  );

  const options = useMemo(() => {
    const base = {
      chart: {
        type: "line",
        spacing: [4, 6, 6, 6],
        reflow: true,
        // width/height driven by container (like Graph 2)
        height: containerHeight,
        width: chartWidth,
      },
      title: { text: "" },
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories,
        tickLength: 0,
        lineColor: "#e5e7eb",
        gridLineWidth: 1,
        gridLineColor: "#eef2f7",
        crosshair: { width: 1, color: "#94a3b8" },
        plotBands:
          lastActualIdx >= 0
            ? [
                {
                  from: lastActualIdx - 0.3,
                  to: lastActualIdx + 0.3,
                  color: "rgba(244,63,94,0.25)",
                  zIndex: 0,
                },
              ]
            : [],
        labels: { style: { fontSize: "11px" } },
      },
      yAxis: {
        title: {
          text: "Units (in thousands)",
          style: { color: "#64748b", fontSize: "12px" },
        },
        min: 0,
        gridLineColor: "#e5e7eb",
        labels: { style: { fontSize: "11px" } },
      },
      tooltip: {
        shared: true,
        borderRadius: 6,
        padding: 8,
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
      },
      plotOptions: { series: { animation: false, marker: { radius: 3 } } },
      series: [
        {
          name: "Actual",
          data: actualSeries,
          color: "#0f766e",
          lineWidth: 2.5,
          dashStyle: "Solid",
          zIndex: 2,
        },
        {
          name: "Forecast",
          data: forecastSeries,
          color: "#0f766e",
          lineWidth: 2.5,
          dashStyle: "ShortDot",
          marker: { enabled: false },
          opacity: 0.9,
          zIndex: 1,
        },
      ],
      accessibility: { enabled: false },
    };
    return enhanceForMobileDrag(base, isSmall, graphHeight);
  }, [
    categories,
    actualSeries,
    forecastSeries,
    containerHeight,
    chartWidth,
    isSmall,
    lastActualIdx,
    graphHeight,
  ]);

  const header = [
    { label: "Location:", value: sku?.currentLocation ?? "-" },
    { label: "Current Inventory:", value: fmtInt(sku?.currentInventory ?? 0) },
    { label: "Next week demand:", value: fmtInt(sku?.nextWeekDemand ?? 0) },
  ];

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: "grey.300",
          bgcolor: "#fff",
        }}
      >
        <Tabs value={mainTabValue} onChange={(_, v) => setMainTabValue(v)}>
          <Tab
            label="Demand"
            sx={{
              textTransform: "none",
              fontSize: 13,
              fontWeight: 600,
              minHeight: 36,
              px: 2,
            }}
          />
          <Tab
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  Disruption
                </Typography>
                <Badge
                  badgeContent={sku?.disruptions?.length || 0}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 9,
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                />
              </Stack>
            }
            sx={{ textTransform: "none", minHeight: 36, px: 2 }}
          />
        </Tabs>
        <IconButton size="small">
          <MoreVert fontSize="small" />
        </IconButton>
      </Stack>

      {mainTabValue === 0 ? (
        <>
          <ChartSectionHeader
            header={header}
            selectedSkuId={selectedSkuId}
            skuOptions={skuOptions}
            onChangeSku={onChangeSku}
          />

          {/* Make inner content match Graph 2: padded area + bordered white canvas with dynamic sizing */}
          <Stack
            sx={{
              p: 2,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Optional title for symmetry */}
            <Box
              ref={containerRef}
              sx={{
                flex: 1,
                minHeight: 200,
                width: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                backgroundColor: "#fff",
              }}
            >
              <Box
                sx={{
                  width: chartWidth,
                  height: containerHeight,
                  minWidth: chartWidth,
                  minHeight: containerHeight,
                }}
              >
                <HighchartsReact
                  ref={chartRef}
                  highcharts={Highcharts}
                  options={options}
                  containerProps={{ style: { width: "100%", height: "100%" } }}
                />
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ mx: 1, mb: 1 }} />
        </>
      ) : (
        <Stack sx={{ p: 2 }}>
          <Box
            sx={{
              border: 1,
              borderColor: "#e5e7eb",
              borderRadius: 1,
              overflow: "auto",
              minHeight: 0,
              width: { xs: "100%", md: 720 },
              alignSelf: "flex-start",
              boxShadow: 0,
              backgroundColor: "#fff",
            }}
          >
            <DisruptionList rowsFromJson={sku?.disruptions || []} />
          </Box>
        </Stack>
      )}
    </Card>
  );
}

/* =====================  CITY / LOCATIONS CARD (LINE: ACTUAL vs FORECAST)  ===================== */

const thCell = {
  fontWeight: 700,
  fontSize: 13,
  color: "#334155",
  backgroundColor: "#eef2f7",
  borderColor: "#e5e7eb",
};
const tdCell = {
  fontSize: 13,
  color: "#374151",
  borderColor: "#e5e7eb",
  whiteSpace: "nowrap",
};
const tdCellLeft = { ...tdCell, minWidth: 160 };
const subHdr = {
  fontWeight: 500,
  color: "#64748b",
  fontSize: 11,
  marginLeft: 4,
};

/** Build weekly categories "Week 1..N" plus per-location ACTUAL and FORECAST series (in thousands).
 *  Splits SKU demand across locations by each location's demandNextWeek as weights. */
function buildWeeklyLocationSeries(sku) {
  const locations = sku?.locations || [];
  const df = sku?.demandForecast || { actual: [], forecast: [] };

  const weeks = Array.from(
    new Set([
      ...(df.actual || []).map((x) => x.week),
      ...(df.forecast || []).map((x) => x.week),
    ])
  ).sort((a, b) => a - b);

  // Display Week 1..N like your screenshot
  const categories = weeks.map((_, i) => `Week ${i + 1}`);

  const actualMap = new Map((df.actual || []).map((d) => [d.week, d.units]));
  const forecastMap = new Map(
    (df.forecast || []).map((d) => [d.week, d.units])
  );

  const totalDemand = locations.reduce(
    (s, l) => s + Number(l.demandNextWeek || 0),
    0
  );
  const defaultW = locations.length ? 1 / locations.length : 0;

  const colorMap = {
    Bhuj: "#f59e0b",
    Ahemdabad: "#ef4444", // keep spelling per JSON
    Ahmedabad: "#ef4444",
    Bhavnagar: "#10b981",
  };

  const series = [];
  locations.forEach((loc) => {
    const w =
      totalDemand > 0
        ? Number(loc.demandNextWeek || 0) / totalDemand
        : defaultW;
    const color = colorMap[loc.name] || "#2563eb";

    const actual = weeks.map((wk) =>
      actualMap.has(wk) ? to1((actualMap.get(wk) * w) / 1000) : null
    );
    const forecast = weeks.map((wk) =>
      forecastMap.has(wk) ? to1((forecastMap.get(wk) * w) / 1000) : null
    );

    // names are same as screenshot style (solid & dotted entries per city)
    series.push({
      name: `${loc.name}`,
      data: actual,
      color,
      lineWidth: 2.5,
      dashStyle: "Solid",
      marker: { radius: 3 },
      zIndex: 2,
    });
    series.push({
      name: `${loc.name}`,
      data: forecast,
      color,
      lineWidth: 2.5,
      dashStyle: "ShortDot",
      marker: { enabled: false },
      zIndex: 1,
    });
  });

  return { categories, series };
}

/** Aggregate weekly series into 4-week "Month 1 / Month 2" sums (in thousands). */
function toMonthly(categories, series) {
  if (!series?.length) return { categories: [], series: [] };
  const buckets = Math.ceil((categories || []).length / 4);
  const mCats = Array.from({ length: buckets }, (_, i) => `Month ${i + 1}`);

  const mSeries = series.map((s) => {
    const grouped = Array.from({ length: buckets }, () => 0);
    (s.data || []).forEach((v, i) => {
      const b = Math.floor(i / 4);
      grouped[b] += Number.isFinite(v) ? v : 0;
    });
    return { ...s, data: grouped };
  });

  return { categories: mCats, series: mSeries };
}

function DemandByCityCard({ locations = [], sku }) {
  const [tab, setTab] = useState(0);

  // ---- build weekly series only ----
  const weekly = useMemo(() => buildWeeklyLocationSeries(sku), [sku]);
  const { categories, series } = weekly;

  // ---- Dynamic size based on the card container ----
  const [containerHeight, setContainerHeight] = useState(400);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = React.useRef(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const rect = containerRef.current.getBoundingClientRect();
      // Leave room for tabs/header/controls
      const availableHeight = Math.max(300, rect.height - 120);
      const availableWidth = Math.max(700, rect.width - 40); // padding

      setContainerHeight(availableHeight);
      setContainerWidth(availableWidth);

      if (chartRef.current?.chart) {
        chartRef.current.chart.setSize(availableWidth, availableHeight, false);
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Keep chart width exactly equal to the available content width
  const chartWidth = containerWidth;

  // ---- Highcharts options ----
  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        spacing: [4, 6, 6, 6],
        height: containerHeight,
        width: chartWidth,
        reflow: true,
      },
      title: { text: "" },
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: {
        enabled: true,
        itemStyle: { fontSize: "11px" },
        symbolWidth: 24,
        layout: "horizontal",
        align: "center",
      },
      xAxis: {
        categories, // Week 1..N
        tickLength: 0,
        lineColor: "#e5e7eb",
        gridLineWidth: 1,
        gridLineColor: "#eef2f7",
        labels: {
          style: { fontSize: "11px" },
          autoRotation: [-45],
          reserveSpace: true,
        },
        tickPixelInterval: 80,
      },
      yAxis: {
        title: {
          text: "Units (in thousands)",
          style: { color: "#64748b", fontSize: "12px" },
        },
        min: 0,
        gridLineColor: "#e5e7eb",
        labels: { style: { fontSize: "11px" } },
      },
      tooltip: {
        shared: true,
        borderRadius: 6,
        padding: 8,
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
      },
      plotOptions: {
        series: {
          animation: false,
          marker: { radius: 3 },
          lineWidth: 2.5,
        },
      },
      series,
      accessibility: { enabled: false },
    }),
    [categories, series, containerHeight, chartWidth]
  );

  return (
    <Card
      ref={containerRef}
      sx={{
        backgroundColor: "#fff",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        sx={{
          px: 1.5,
          pt: 1,
          borderBottom: 1,
          borderColor: "grey.200",
          flexShrink: 0,
        }}
      >
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36 }}>
          <Tab
            label="Graph"
            sx={{ textTransform: "none", minHeight: 36, fontSize: 13 }}
          />
          <Tab
            label="Data Table"
            sx={{ textTransform: "none", minHeight: 36, fontSize: 13 }}
          />
        </Tabs>
      </Stack>

      <Stack
        sx={{
          p: 2,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: 14, fontWeight: 600, mb: 1, flexShrink: 0 }}
        >
          Demand
        </Typography>

        {tab === 0 ? (
          <Box
            sx={{
              flex: 1,
              minHeight: 300,
              width: "100%",
              border: "1px solid #e5e7eb",
              borderRadius: 1,
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                width: chartWidth,
                height: containerHeight,
                minWidth: chartWidth,
                minHeight: 200,
              }}
            >
              <HighchartsReact
                ref={chartRef}
                highcharts={Highcharts}
                options={options}
                containerProps={{
                  style: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </Box>
          </Box>
        ) : (
          <TableContainer
            sx={{
              border: 1,
              borderColor: "#e5e7eb",
              borderRadius: 1,
              overflow: "auto",
              minHeight: 0,
              width: { xs: "100%", md: 720 },
              alignSelf: "flex-start",
              boxShadow: 0,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#eef2f7" }}>
                  <TableCell sx={thCell}>Location</TableCell>
                  <TableCell sx={thCell} align="right">
                    Distance<span style={subHdr}>(km)</span>
                  </TableCell>
                  <TableCell sx={thCell} align="right">
                    Available Qty
                  </TableCell>
                  <TableCell sx={thCell} align="right">
                    Demand <span style={subHdr}>(Next Week)</span>
                  </TableCell>
                  <TableCell sx={thCell} align="right">
                    Safety Stock
                  </TableCell>
                  <TableCell sx={thCell} align="right">
                    Excess Qty
                  </TableCell>
                  <TableCell sx={thCell} align="right">
                    ETA <span style={subHdr}>(Hours)</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(locations || []).map((r, idx) => (
                  <TableRow
                    key={`${r.name}-${idx}`}
                    sx={{
                      "& td": { borderColor: "#e5e7eb" },
                      backgroundColor: r.recommended
                        ? "rgba(37,99,235,0.08)"
                        : "transparent",
                    }}
                  >
                    <TableCell sx={tdCellLeft}>
                      <Typography sx={{ fontSize: 13, color: "#111827" }}>
                        {r.name}
                        {r.recommended && (
                          <Typography
                            component="span"
                            sx={{ color: "#2563eb", fontSize: 12, ml: 0.5 }}
                          >
                            (Recommended)
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtInt(r.distance)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtInt(r.availableQty)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtInt(r.demandNextWeek)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtInt(r.safetyStock)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtInt(r.excessQty)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtInt(r.eta)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Card>
  );
}

/* =====================  WATERFALL (helpers)  ===================== */

function buildWaterfall(
  steps,
  includeTotal = true,
  totalLabel = "Simulated Revenue"
) {
  let running = 0;
  const out = [];
  steps.forEach((st, idx) => {
    const val = to1(st.value);
    if (idx === 0) {
      running = val;
      out.push({
        name: st.name,
        base: 0,
        delta: Math.abs(val),
        raw: val,
        kind: "base",
        cumulative: to1(running),
      });
      return;
    }
    const next = to1(running + val);
    const base = Math.min(running, next);
    out.push({
      name: st.name,
      base,
      delta: Math.abs(val),
      raw: val,
      kind: val >= 0 ? "pos" : "neg",
      cumulative: next,
    });
    running = next;
  });
  if (includeTotal) {
    const total = to1(running);
    out.push({
      name: totalLabel,
      base: 0,
      delta: Math.abs(total),
      raw: total,
      kind: "total",
      cumulative: total,
    });
  }
  return out;
}
const barFill = (d) =>
  d.kind === "total" ? "#60a5fa" : d.raw >= 0 ? "#22c55e" : "#ef4444";

const WfTick = ({ x, y, payload }) => {
  const value = String(payload.value || "");
  const [first, ...rest] = value.split(" ");
  const second = rest.join(" ");
  const lines = second ? [first, second] : [first];
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#475569" fontSize={11}>
        {lines.map((ln, i) => (
          <tspan key={i} x="0" dy={i === 0 ? 0 : 12}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  );
};

function MetricTile({ title, value, delta }) {
  const isDown = (delta || "").toString().trim().startsWith("-");
  return (
    <Card
      sx={{ boxShadow: 0, border: "1px solid #e5e7eb", background: "#fff" }}
    >
      <CardContent sx={{ p: 1.25 }}>
        <Typography
          variant="body2"
          sx={{ fontSize: 11, color: "#64748b", mb: 0.5 }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
            {value}
          </Typography>
          {delta && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: isDown ? "#b91c1c" : "#16a34a",
              }}
            >
              {isDown ? "▼" : "▲"} {String(delta).replace("-", "")}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

/* =====================  RIGHT PANEL (component)  ===================== */

function RecommendationPanel({ symbol, locations, recommended, onCompare }) {
  const [recommendationType, setRecommendationType] = useState("recommended");
  const [summaryTabValue, setSummaryTabValue] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const settingsOpen = Boolean(anchorEl);

  const limits = useMemo(() => {
    const obj = {};
    (locations || []).forEach((loc) => {
      obj[loc.name] = {
        min: 0,
        max:
          Math.max(0, Number(loc.excessQty ?? 0)) ||
          Math.max(0, Number(loc.availableQty ?? 0)),
      };
    });
    return obj;
  }, [locations]);

  const initCustom = useMemo(() => {
    const start = {};
    (locations || []).forEach((l) => (start[l.name] = 0));
    if (recommended?.name)
      start[recommended.name] = Number(recommended.qty || 0);
    return start;
  }, [locations, recommended]);

  const [custom, setCustom] = useState(initCustom);
  useEffect(() => setCustom(initCustom), [initCustom]);

  const usingCustomized = recommendationType === "customize";
  const totalCustomQty = Object.values(custom || {}).reduce(
    (a, b) => a + Number(b || 0),
    0
  );
  const qtyFeedingChart = usingCustomized
    ? totalCustomQty
    : Number(recommended?.qty || 0);

  const { scale, axis: axisLabel, suffix } = getMoneyUnit(symbol);

  const selectedLoc =
    (locations || []).find((l) => l.name === recommended?.name) ||
    locations?.[0];
  const logistics = selectedLoc?.logistics || {};
  const BASELINE_STEPS_NORM = useMemo(() => {
    const stepsRaw = [
      {
        name: "Projected Revenue",
        value: Number(logistics.projectedRevenue || 0) / scale,
      },
      {
        name: "Additional Revenue",
        value: Number(logistics.additionalRevenue || 0) / scale,
      },
      {
        name: "Logistic Cost",
        value: Number(logistics.logisticCost || 0) / scale,
      },
      {
        name: "Handling Cost",
        value: Number(logistics.laborHandlingCost || 0) / scale,
      },
      {
        name: "Transaction Cost",
        value: Number(logistics.transactionCost || 0) / scale,
      },
    ];
    return stepsRaw;
  }, [logistics, scale]);

  const stepsForQty = (qty) => {
    const reco = Number(recommended?.qty || 0);
    const mult = reco > 0 ? qty / reco : 0;
    return BASELINE_STEPS_NORM.map((s) => ({
      ...s,
      value: to1(s.value * mult),
    }));
  };

  const stepsFeedingChart = useMemo(
    () => stepsForQty(qtyFeedingChart),
    [qtyFeedingChart]
  );
  const wfData = useMemo(
    () => buildWaterfall(stepsFeedingChart, true, "Simulated Revenue"),
    [stepsFeedingChart]
  );
  const yDomain = useMemo(() => {
    const mins = wfData.map((d) => Math.min(d.base, d.base + d.delta));
    const maxs = wfData.map((d) => Math.max(d.base, d.base + d.delta));
    const min = Math.min(0, ...mins);
    const max = Math.max(0, ...maxs);
    return [min, max];
  }, [wfData]);

  const openSettings = (e) => setAnchorEl(e.currentTarget);
  const closeSettings = () => setAnchorEl(null);

  const fmtQty = (n) => fmtInt(n);
  const fmtMoney = (n) => fmtCurrency(n, symbol);

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
        width: { xs: 300, md: RIGHT_W },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Stack
        sx={{ p: 1.5, borderBottom: 1, borderColor: "grey.300" }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
      >
        <Stack direction="row" alignItems="center" gap={0.5}>
          <RadioGroup
            value={recommendationType}
            onChange={(e) => setRecommendationType(e.target.value)}
            row
          >
            <FormControlLabel
              value="recommended"
              control={<Radio size="small" />}
              label={<Typography fontSize={12}>Recommended</Typography>}
            />
            <FormControlLabel
              value="customize"
              control={<Radio size="small" />}
              label={<Typography fontSize={12}>Customize</Typography>}
            />
          </RadioGroup>

          {usingCustomized && (
            <Tooltip title="Adjust quantities">
              <IconButton
                aria-label="Adjust quantities"
                size="small"
                onClick={openSettings}
                sx={{ ml: 0.5 }}
              >
                <Tune fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            sx={{ fontSize: 11, textTransform: "none", py: 0.5, px: 1.5 }}
            onClick={onCompare}
          >
            Compare Simulation
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: 11, textTransform: "none", py: 0.5, px: 1.5 }}
          >
            Request Transfer
          </Button>
        </Stack>
      </Stack>

      {/* Sliders Popover */}
      <Popover
        open={settingsOpen}
        anchorEl={anchorEl}
        onClose={closeSettings}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            p: 1,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            width: 320,
            maxHeight: 420,
            overflow: "auto",
          },
        }}
      >
        {(locations || []).map((loc) => {
          const lim = limits[loc.name] || { min: 0, max: 0 };
          const val = Math.min(
            Math.max(Number(custom[loc.name] || 0), lim.min),
            lim.max
          );
          return (
            <Stack key={loc.name} sx={{ p: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
                {loc.name}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.25 }}
              >
                <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                  {lim.min}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                  {lim.max}
                </Typography>
              </Stack>
              <Slider
                size="small"
                value={val}
                min={lim.min}
                max={lim.max}
                onChange={(_, v) =>
                  setCustom((c) => ({ ...c, [loc.name]: Number(v) }))
                }
                sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
              />
              <TextField
                size="small"
                value={fmtInt(custom[loc.name] || 0)}
                onChange={(e) =>
                  setCustom((c) => {
                    const cleaned = String(e.target.value).replace(/,/g, "");
                    const num = Number(cleaned);
                    return { ...c, [loc.name]: Number.isFinite(num) ? num : 0 };
                  })
                }
                fullWidth
                sx={{
                  mt: 0.5,
                  "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
                }}
              />
              <Divider sx={{ my: 1 }} />
            </Stack>
          );
        })}
      </Popover>

      <Divider />
      <Tabs
        value={summaryTabValue}
        onChange={(_, v) => setSummaryTabValue(v)}
        sx={{ px: 1 }}
      >
        <Tab
          label={<Typography fontSize={12}>Summary</Typography>}
          sx={{ textTransform: "none", minHeight: 36 }}
        />
        <Tab
          label={<Typography fontSize={12}>Details</Typography>}
          sx={{ textTransform: "none", minHeight: 36 }}
        />
      </Tabs>

      <Stack sx={{ p: 1.5, overflow: "auto", flex: 1, minHeight: 0 }}>
        {summaryTabValue === 0 ? (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "stretch" }}>
            <Card
              sx={{
                flex: 1,
                backgroundColor: "#e7f0ff",
                border: "1px solid #cfe1ff",
                boxShadow: 0,
              }}
            >
              <CardContent sx={{ p: 1.25 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1d4ed8",
                    mb: 1,
                  }}
                >
                  Recommended
                </Typography>
                <Stack spacing={0.5} sx={{ mb: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
                      {recommended?.name ?? "-"}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      {fmtQty(recommended?.qty ?? 0)} Qty
                    </Typography>
                  </Stack>
                </Stack>
                <Stack spacing={1}>
                  <MetricTile
                    title="Profit"
                    value={fmtMoney(recommended?.profit ?? 0)}
                    delta={`${recommended?.profitMargin ?? 0}%`}
                  />
                  <MetricTile title="ETA" value={recommended?.eta ?? "-"} />
                </Stack>
              </CardContent>
            </Card>

            {usingCustomized && (
              <Card
                sx={{
                  flex: 1,
                  backgroundColor: "#fff",
                  border: "1px solid #bfdbfe",
                  boxShadow: 0,
                }}
              >
                <CardContent sx={{ p: 1.25 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#0f172a",
                      mb: 1,
                    }}
                  >
                    Customized
                  </Typography>
                  <Stack spacing={0.5} sx={{ mb: 1 }}>
                    {Object.entries(custom)
                      .filter(([, v]) => Number(v) > 0)
                      .map(([name, v]) => (
                        <Stack
                          key={name}
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
                            {name}:
                          </Typography>
                          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                            {fmtQty(v)} Qty
                          </Typography>
                        </Stack>
                      ))}
                  </Stack>
                  <Stack spacing={1}>
                    <MetricTile
                      title="Profit"
                      value={fmtMoney(recommended?.profit ?? 0)}
                      delta="-14%"
                    />
                    <MetricTile title="ETA" value={recommended?.eta ?? "-"} />
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        ) : (
          <>
            <Card sx={{ mb: 1.5 }}>
              <CardContent sx={{ p: 1.25 }}>
                <div style={{ width: "100%", height: 260, marginTop: 8 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {/* <BarChart data={wfData} margin={{ top: 28, right: 16, bottom: 8, left: 12 }} barCategoryGap={8}> */}
                    <BarChart
                      data={wfData}
                      margin={{ top: 28, right: 12, bottom: 8, left: -1 }}
                      barCategoryGap={8}
                    >
                      <CartesianGrid stroke="#eef2f7" vertical />
                      {/* <XAxis dataKey="name" interval={0} minTickGap={0} tickMargin={12} height={44} tick={<WfTick />} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} /> */}
                      <XAxis
                        dataKey="name"
                        interval={0}
                        minTickGap={0}
                        tickMargin={12}
                        height={44}
                        tick={<WfTick />}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                        padding={{ left: -1, right: 0 }} // nudge first bar toward the left edge
                      />
                      {/* <YAxis
                        domain={yDomain}
                        tick={{ fontSize: 11, fill: "#475569" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                        tickFormatter={(v) => `${to1(v)}`}
                        label={{ value: axisLabel, angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 11 }}
                      /> */}
                      <YAxis
                        width={36} // reserve less left gutter
                        domain={yDomain}
                        tick={{ fontSize: 11, fill: "#475569" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                        tickMargin={2} // bring ticks closer to axis
                        tickFormatter={(v) => `${to1(v)}`}
                        label={{
                          value: axisLabel,
                          angle: -90,
                          position: "insideLeft",
                          offset: 6,
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <RTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.[0]) return null;
                          const p = payload[0].payload;
                          return (
                            <div
                              style={{
                                padding: 8,
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 12,
                                  marginBottom: 4,
                                }}
                              >
                                {label}
                              </div>
                              <div style={{ fontSize: 12, color: "#334155" }}>
                                Change: {to1(p.raw)}
                                {suffix}
                              </div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>
                                Cumulative: {to1(p.cumulative)}
                                {suffix}
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Bar
                        dataKey="base"
                        stackId="wf"
                        fill="transparent"
                        isAnimationActive={false}
                        barSize={26}
                      />
                      <Bar
                        dataKey="delta"
                        stackId="wf"
                        isAnimationActive={false}
                        barSize={26}
                      >
                        {wfData.map((d, i) => (
                          <Cell key={i} fill={barFill(d)} />
                        ))}
                        <LabelList
                          dataKey="raw"
                          position="top"
                          offset={6}
                          formatter={(v) => `${to1(v)}${suffix}`}
                          style={{
                            fontSize: 12,
                            fill: "#111827",
                            fontWeight: 700,
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {recommended && (
              <Card sx={{ border: 1, borderColor: "#dbeafe", boxShadow: 0 }}>
                <Stack
                  sx={{
                    px: 1.5,
                    py: 1,
                    bgcolor: "#eaf2ff",
                    borderBottom: "1px solid #dbeafe",
                  }}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  flexWrap="wrap"
                >
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}
                  >
                    {recommended.name}{" "}
                    <Typography
                      component="span"
                      sx={{ color: "#2563eb", ml: 0.5, fontWeight: 700 }}
                    >
                      (Recommended)
                    </Typography>
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#334155" }}>
                    Qty: <strong>{fmtInt(recommended.qty)}</strong>
                  </Typography>
                </Stack>

                <CardContent sx={{ p: 1.25 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4}>
                      <MetricTile
                        title="Profit"
                        value={fmtMoney(recommended.profit)}
                        delta={`${recommended.profitMargin}%`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <MetricTile title="ETA" value={recommended.eta} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <MetricTile
                        title="Logistic Cost"
                        value={fmtMoney(recommended.logisticCost)}
                        delta="-15%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <MetricTile
                        title="Labor/Handling"
                        value={fmtMoney(recommended.laborHandlingCost)}
                        delta="-15%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <MetricTile
                        title="Revenue"
                        value={fmtMoney(recommended.revenue)}
                        delta="24%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <MetricTile
                        title="Total Cost"
                        value={fmtMoney(recommended.totalCost)}
                        delta="10%"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}

/* =====================  DATA ADAPTERS  ===================== */

// Scenario chip coloring
const typeColorByCategory = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("increase") || c.includes("expansion") || c.includes("launch"))
    return "info";
  if (c.includes("supply")) return "error";
  if (c.includes("decrease") || c.includes("pressure") || c.includes("cost"))
    return "error";
  return "primary";
};

// Build sidebar scenarios for a SKU
function scenariosForSku(data, sku) {
  if (Array.isArray(sku?.scenarios) && sku.scenarios.length) {
    return sku.scenarios.map((s, i) => ({
      id: `${sku.id}-${i}`,
      name: s.name,
      impact: s.impact,
      duration: s.duration,
      description: s.description,
      type: s.name.split(" ")[0] || "Scenario",
      typeColor: typeColorByCategory(s.name),
    }));
  }

  const dict = data?.scenarios || {};
  const arr = Object.values(dict);
  const filtered = arr.filter((s) =>
    (s.applicableRegions || []).some((r) =>
      r.toLowerCase().includes((sku?.country || "").toLowerCase())
    )
  );
  return filtered.map((s) => ({
    id: s.id,
    name: s.name,
    impact: s.impact,
    duration: s.duration,
    description: s.description,
    type: s.category || "Scenario",
    typeColor: typeColorByCategory(s.category || s.name),
  }));
}

/* =====================  MAIN LAYOUT  ===================== */
function MainContentSection() {
  const skus = scenarioData?.skus || [];
  const [selectedSkuId, setSelectedSkuId] = useState(skus[0]?.id || "");
  const currentSku = useMemo(
    () => skus.find((s) => s.id === selectedSkuId) || skus[0],
    [skus, selectedSkuId]
  );

  const skuOptions = useMemo(
    () => skus.map((s) => ({ value: s.id, label: s.name })),
    [skus]
  );

  const scenarios = useMemo(
    () => scenariosForSku(scenarioData, currentSku),
    [currentSku]
  );
  const [selectedScenario, setSelectedScenario] = useState(
    scenarios[0] || null
  );
  useEffect(() => setSelectedScenario(scenarios[0] || null), [scenarios]);

  const [showSim, setShowSim] = useState(false);

  // 2 columns when comparing (hide right panel), 3 columns otherwise
  const layoutCols = showSim
    ? `${SIDEBAR_W} 1fr`
    : `${SIDEBAR_W} minmax(700px, 1fr) ${RIGHT_W}`;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: MAX_APP_WIDTH,
        mx: "auto",
        px: 1,
        display: "grid",
        gridTemplateColumns: layoutCols,
        gap: 1,
        overflow: "hidden",
        alignItems: "stretch",
      }}
    >
      {/* Sidebar – fixed */}
      <Box sx={{ minWidth: 0 }}>
        <SidebarBox
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
        />
      </Box>

      {/* Middle */}
      {showSim ? (
        <Box
          sx={{
            minWidth: 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <NewRecommendationScreen onBack={() => setShowSim(false)} />
        </Box>
      ) : (
        <Box
          sx={{
            minWidth: 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            display: "grid",
            gridTemplateRows: "minmax(260px, 1fr) minmax(260px, 1fr)",
            gap: 1,
          }}
        >
          <Box sx={{ minHeight: 0, display: "flex" }}>
            <ForecastChartCard
              sku={currentSku}
              selectedSkuId={selectedSkuId}
              skuOptions={skuOptions}
              onChangeSku={setSelectedSkuId}
              height={180}
            />
          </Box>
          <Box sx={{ minHeight: 0, display: "flex" }}>
            <DemandByCityCard
              locations={currentSku?.locations || []}
              sku={currentSku}
              height={170}
            />
          </Box>
        </Box>
      )}

      {/* Right – render ONLY when not comparing */}
      {!showSim && (
        <Box sx={{ minWidth: 0 }}>
          <RecommendationPanel
            symbol={currentSku?.symbol || "₹"}
            locations={currentSku?.locations || []}
            recommended={currentSku?.recommendedLocation || null}
            onCompare={() => setShowSim(true)}
          />
        </Box>
      )}
    </Box>
  );
}

/* =====================  ROOT  ===================== */

export default function DemandMProject() {
  return (
    <>
      <CssBaseline />
      <Card
        sx={{
          height: "100svh",
          width: "100%",
          borderRadius: 2,
          m: 0,
          p: 0,
          display: "flex",
          overflow: "hidden",
          overflowX: "hidden",
          boxShadow: "0 12px 28px rgba(2,6,23,.08)",
        }}
      >
        <MainContentSection />
      </Card>
    </>
  );
}
