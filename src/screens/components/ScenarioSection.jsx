import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  Radio as MuiRadio,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import HelpOutline from "@mui/icons-material/HelpOutline";
import TrendingUp from "@mui/icons-material/TrendingUp";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Tune from "@mui/icons-material/Tune";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import OpenInFull from "@mui/icons-material/OpenInFull";
import Close from "@mui/icons-material/Close";

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

import scenarioData from "../assets/supply_chain_data.json";

const MAX_APP_WIDTH = 1900;
const SIDEBAR_W = "clamp(280px, 18vw, 320px)";
const COLLAPSED_W = "52px";
const RIGHT_W = "clamp(420px, 34vw, 760px)";
const GRAPH_HEIGHT = 200;

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

const RAW_WATERFALL_COLORS = {
  "projected revenue": "#22C55E80",
  "additional revenue": "#22C55E80",
  "logistic cost": "#FFA8A880",
  "labor cost": "#FFA8A880",
  "handling cost": "#FFA8A880",
  "transaction cost": "#FFA8A880",
  "simulated revenue": "#93C5FDCC",
};
const normalizeKey = (s = "") =>
  s.toString().trim().toLowerCase().replace(/\s+/g, " ");
const colorForStep = (name, kind, rawVal) => {
  const k = normalizeKey(name);
  if (RAW_WATERFALL_COLORS[k]) return RAW_WATERFALL_COLORS[k];
  if (kind === "total") return RAW_WATERFALL_COLORS["simulated revenue"];
  return rawVal >= 0 ? "#22C55E80" : "#FFA8A880";
};

const CITY_COLOR_MAP = {
  bhuj: "#22c55e",
  ahemdabad: "#3b82f6",
  ahmedabad: "#3b82f6",
  bhavnagar: "#fda4af",
  denver: "#f59e0b",
  phoenix: "#ef4444",
  dallas: "#10b981",
};
const getCityColor = (name = "") =>
  CITY_COLOR_MAP[name.toLowerCase()] || "#2563eb";

function SidebarBox({
  scenarios,
  selectedScenario,
  setSelectedScenario,
  collapsed,
  onToggleCollapse,
  forceCollapsed = false,
  allowToggle = true,
}) {
  const effectiveCollapsed = forceCollapsed ? true : collapsed;

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
        position: "relative",
        width: effectiveCollapsed ? COLLAPSED_W : { xs: 280, md: SIDEBAR_W },
        backgroundColor: "#fff",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 220ms ease",
        minHeight: 0,
      }}
    >
      {allowToggle && !forceCollapsed && (
        <Box
          sx={{
            position: "absolute",
            right: -12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            width: 24,
            height: 48,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={onToggleCollapse}
          aria-label={
            effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {effectiveCollapsed ? (
            <ChevronRight sx={{ fontSize: 18, color: "#334155" }} />
          ) : (
            <ChevronLeft sx={{ fontSize: 18, color: "#334155" }} />
          )}
        </Box>
      )}

      <Stack
        sx={{
          p: 1.5,
          backgroundColor: "#f8f9fa",
          borderBottom: 1,
          borderColor: "grey.300",
          flexShrink: 0,
        }}
        direction="row"
        justifyContent={effectiveCollapsed ? "center" : "space-between"}
        alignItems="center"
      >
        {effectiveCollapsed ? (
          <Tooltip title="What-If Scenarios?">
            <HelpOutline sx={{ fontSize: 18, color: "#666" }} />
          </Tooltip>
        ) : (
          <>
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
          </>
        )}
      </Stack>

      <Stack
        sx={{
          p: effectiveCollapsed ? 0.75 : 1,
          borderBottom: 1,
          borderColor: "grey.300",
          alignItems: "center",
          flexShrink: 0,
        }}
        direction="row"
      >
        <Search
          sx={{
            fontSize: 16,
            color: "#999",
            mr: effectiveCollapsed ? 0 : 1,
          }}
        />
        {!effectiveCollapsed && (
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
        )}
      </Stack>

      <Stack sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        {effectiveCollapsed ? (
          <List sx={{ p: 0 }}>
            {scenarios.map((s) => (
              <Tooltip key={s.id} title={s.name} placement="right">
                <ListItem
                  onClick={() => setSelectedScenario(s)}
                  sx={{
                    cursor: "pointer",
                    py: 0.75,
                    justifyContent: "center",
                    borderLeft:
                      selectedScenario?.id === s.id
                        ? "3px solid #1976d2"
                        : "3px solid transparent",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TrendingUp sx={{ fontSize: 16, color: "#666" }} />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        ) : (
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
                    selectedScenario?.id === s.id
                      ? "3px solid #1976d2"
                      : "none",
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
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
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
                        backgroundColor:
                          (s.typeColor === "info" && "#2196f3") ||
                          (s.typeColor === "error" && "#ff9800") ||
                          (s.typeColor === "success" && "#4caf50") ||
                          (s.typeColor === "primary" && "#9c27b0") ||
                          "#f5f5f5",
                        color: "#fff",
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
        )}
      </Stack>
    </Box>
  );
}

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

function DisruptionList({ rowsFromJson, onCountChange }) {
  const [rows, setRows] = useState(
    (rowsFromJson || []).map((r, i) => ({
      id: i + 1,
      checked: !!r.selected,
      dateStr: r.date,
      message: `${r.location}: ${r.description}`,
    }))
  );
  useEffect(() => {
    const next = (rowsFromJson || []).map((r, i) => ({
      id: i + 1,
      checked: !!r.selected,
      dateStr: r.date,
      message: `${r.location}: ${r.description}`,
    }));
    setRows(next);
    onCountChange?.(next.filter((r) => !r.checked).length);
  }, [rowsFromJson]);

  const toggle = (id) =>
    setRows((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, checked: !r.checked } : r
      );
      onCountChange?.(next.filter((r) => !r.checked).length);
      return next;
    });
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

function ForecastChartSection({
  sku,
  selectedSkuId,
  skuOptions,
  onChangeSku,
  height = 180,
  width,
}) {
  const [mainTabValue, setMainTabValue] = useState(0);
  const [activeDisruptions, setActiveDisruptions] = useState(
    (sku?.disruptions || []).filter((d) => !d.selected).length
  );
  useEffect(() => {
    setActiveDisruptions(
      (sku?.disruptions || []).filter((d) => !d.selected).length
    );
  }, [sku]);

  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));
  const upXl = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const graphHeight = upXl
    ? Math.max(height, 160)
    : upLg
    ? Math.max(height - 20, 150)
    : height;

  const [containerHeight, setContainerHeight] = useState(height);
  const [containerWidth, setContainerWidth] = useState(
    typeof width === "number" ? width : 800
  );
  const containerRef = React.useRef(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const availableHeight = Math.max(100, height);
      const target = typeof width === "number" ? width : rect.width;
      const availableWidth = Math.max(300, Math.min(target, rect.width));
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
  }, [height, width]);

  const chartWidth = containerWidth;
  const df = sku?.demandForecast || { actual: [], forecast: [] };

  const allWeeks = useMemo(() => {
    const s = new Set();
    (df.actual || []).forEach((a) => s.add(a.week));
    (df.forecast || []).forEach((f) => s.add(f.week));
    return Array.from(s).sort((a, b) => a - b);
  }, [df]);

  const actualMap = new Map((df.actual || []).map((d) => [d.week, d.units]));
  const forecastMap = new Map(
    (df.forecast || []).map((d) => [d.week, d.units])
  );
  const categories = allWeeks.map((w) => `Week ${w}`);

  const actualSeries = allWeeks.map((w) =>
    actualMap.has(w) ? to1((actualMap.get(w) || 0) / 1000) : null
  );
  const lastActualIdx = allWeeks.reduce(
    (acc, w, i) => (actualMap.has(w) ? i : acc),
    -1
  );
  const forecastJoined = allWeeks.map((w, i) => {
    if (i < lastActualIdx) return null;
    if (i === lastActualIdx) {
      const ay = actualMap.has(w) ? to1((actualMap.get(w) || 0) / 1000) : null;
      const fy = forecastMap.has(w)
        ? to1((forecastMap.get(w) || 0) / 1000)
        : null;
      return ay ?? fy ?? null;
    }
    return forecastMap.has(w) ? to1((forecastMap.get(w) || 0) / 1000) : null;
  });

  const options = useMemo(() => {
    const base = {
      chart: {
        type: "line",
        spacing: [4, 6, 6, 6],
        reflow: true,
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
          connectNulls: true,
        },
        {
          name: "Forecast",
          data: forecastJoined,
          color: "#0f766e",
          lineWidth: 2.5,
          dashStyle: "ShortDot",
          marker: { enabled: false },
          opacity: 0.9,
          zIndex: 1,
          connectNulls: true,
        },
      ],
      accessibility: { enabled: false },
    };
    return enhanceForMobileDrag(base, isSmall, graphHeight);
  }, [
    categories,
    actualSeries,
    forecastJoined,
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
    <Box
      component="section"
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
        minHeight: 0,
      }}
      aria-label="Demand forecast section"
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
          flexShrink: 0,
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
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  Disruption
                </Typography>
                <Badge
                  badgeContent={activeDisruptions}
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
          <Stack
            sx={{
              p: 2,
              flex: "0 0 auto",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: width ?? "100%",
                height,
                minHeight: 100,
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ width: "100%", height: "100%" }}>
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
              width: "100%",
              alignSelf: "flex-start",
              boxShadow: 0,
              backgroundColor: "#fff",
            }}
          >
            <DisruptionList rowsFromJson={sku?.disruptions || []} />
          </Box>
        </Stack>
      )}
    </Box>
  );
}

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

function buildWeeklyLocationSeries(sku) {
  const locations = sku?.locations || [];
  const df = sku?.demandForecast || { actual: [], forecast: [] };

  const weeks = Array.from(
    new Set([
      ...(df.actual || []).map((x) => x.week),
      ...(df.forecast || []).map((x) => x.week),
    ])
  ).sort((a, b) => a - b);
  const categories = weeks.map((_, i) => `Week ${i + 1}`);

  const actualMap = new Map((df.actual || []).map((d) => [d.week, d.units]));
  const forecastMap = new Map(
    (df.forecast || []).map((d) => [d.week, d.units])
  );
  const lastActualIdx = weeks.reduce(
    (acc, w, i) => (actualMap.has(w) ? i : acc),
    -1
  );

  const totalDemand = locations.reduce(
    (s, l) => s + Number(l.demandNextWeek || 0),
    0
  );
  const defaultW = locations.length ? 1 / locations.length : 0;

  const series = [];
  locations.forEach((loc) => {
    const w =
      totalDemand > 0
        ? Number(loc.demandNextWeek || 0) / totalDemand
        : defaultW;
    const color = getCityColor(loc.name);

    const actual = weeks.map((wk) =>
      actualMap.has(wk) ? to1((actualMap.get(wk) * w) / 1000) : null
    );
    const forecastRaw = weeks.map((wk) =>
      forecastMap.has(wk) ? to1((forecastMap.get(wk) * w) / 1000) : null
    );
    const forecastJoined = forecastRaw.map((v, i) => {
      if (i < lastActualIdx) return null;
      if (i === lastActualIdx) return actual[i] ?? v ?? null;
      return v;
    });

    series.push({
      name: `${loc.name}`,
      data: actual,
      color,
      lineWidth: 2.5,
      dashStyle: "Solid",
      marker: { radius: 3 },
      zIndex: 2,
      connectNulls: true,
    });
    series.push({
      name: `${loc.name}`,
      data: forecastJoined,
      color,
      lineWidth: 2.5,
      dashStyle: "ShortDot",
      marker: { enabled: false },
      zIndex: 1,
      connectNulls: true,
    });
  });

  return { categories, series };
}

function DemandByCitySection({ locations = [], sku, height = 300, width }) {
  const [tab, setTab] = useState(0);

  const weekly = useMemo(() => buildWeeklyLocationSeries(sku), [sku]);
  const { categories, series } = weekly;

  const [containerHeight, setContainerHeight] = useState(height);
  const [containerWidth, setContainerWidth] = useState(
    typeof width === "number" ? width : 800
  );
  const containerRef = React.useRef(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const availableHeight = Math.max(120, height);
      const target = typeof width === "number" ? width : rect.width;
      const availableWidth = Math.max(300, Math.min(target, rect.width));
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
  }, [height, width]);

  const chartWidth = containerWidth;

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
        categories,
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
        series: { animation: false, marker: { radius: 3 }, lineWidth: 2.5 },
      },
      series,
      accessibility: { enabled: false },
    }),
    [categories, series, containerHeight, chartWidth]
  );

  return (
    <Box
      component="section"
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
        minHeight: 0,
      }}
      aria-label="Demand by city section"
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
              flex: "0 0 auto",
              minHeight: 120,
              width: width ?? "100%",
              border: "1px solid #e5e7eb",
              borderRadius: 1,
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                width: chartWidth,
                height: containerHeight,
                minHeight: 120,
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
        ) : (
          <TableContainer
            sx={{
              border: 1,
              borderColor: "#e5e7eb",
              borderRadius: 1,
              overflow: "auto",
              minHeight: 0,
              width: "100%",
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
    </Box>
  );
}

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

function buildStackedWaterfall(
  steps,
  perCityQty,
  recoQty,
  includeTotal = true,
  totalLabel = "Simulated Revenue"
) {
  const activeCities = Object.entries(perCityQty || {})
    .filter(([, q]) => Number(q) > 0)
    .map(([name]) => name);

  let running = 0;
  const rows = [];

  const cityTotals = Object.fromEntries(activeCities.map((c) => [c, 0]));

  steps.forEach((st, idx) => {
    const sign = st.value >= 0 ? 1 : -1;

    const cityVals = {};
    let totalThisStep = 0;
    activeCities.forEach((city) => {
      const mult = recoQty > 0 ? Number(perCityQty[city] || 0) / recoQty : 0;
      const v = to1(Math.abs(st.value) * mult) * sign; 
      cityVals[city] = v;
      cityTotals[city] += v; 
      totalThisStep += v;
    });

    if (idx === 0) {
      running = totalThisStep;
      rows.push({
        name: st.name,
        base: 0,
        raw: totalThisStep,
        kind: "base",
        cumulative: to1(running),
        stackAbs: Math.abs(totalThisStep),
        ...Object.fromEntries(
          activeCities.map((c) => [`city_${c}`, Math.abs(cityVals[c] || 0)])
        ),
      });
      return;
    }

    const next = to1(running + totalThisStep);
    const base = Math.min(running, next);

    rows.push({
      name: st.name,
      base,
      raw: totalThisStep,
      kind: totalThisStep >= 0 ? "pos" : "neg",
      cumulative: next,
      stackAbs: Math.abs(totalThisStep),
      ...Object.fromEntries(
        activeCities.map((c) => [
          `city_${c}`,
          (cityVals[c] || 0) >= 0
            ? Math.abs(cityVals[c] || 0)
            : -Math.abs(cityVals[c] || 0),
        ])
      ),
    });

    running = next;
  });

  if (includeTotal) {
    const total = to1(running);
    const signTotal = total >= 0 ? 1 : -1;

    rows.push({
      name: totalLabel,
      base: 0,
      raw: total,
      kind: "total",
      cumulative: total,
      stackAbs: Math.abs(total),
      ...Object.fromEntries(
        activeCities.map((c) => [
          `city_${c}`,
          Math.abs(cityTotals[c] || 0) * signTotal,
        ])
      ),
    });
  }

  return { rows, activeCities };
}

const WfTick = ({ x, y, payload }) => {
  const value = String(payload.value || "");
  const constSplit = value.split(" ");
  const [first, ...rest] = constSplit;
  const second = rest.join(" ");
  const lines = second ? [first, second] : [first];
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#475569" fontSize={9}>
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

function WaterfallChart({
  usingCustomized,
  activeCities,
  wfData,
  wfStackedRows,
  symbol,
  height = 260,
}) {
  const data = usingCustomized && activeCities.length ? wfStackedRows : wfData;

  const showIfNotZero = (v) => Math.abs(Number(v || 0)) >= 0.05; 
  const { suffix } = getMoneyUnit(symbol);

  return (
    <div style={{ width: "100%", height, marginTop: 8 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 34, right: 16, bottom: 10, left: 2 }}
          barCategoryGap={8}
        >
          <CartesianGrid stroke="#eef2f7" vertical />
          <XAxis
            dataKey="name"
            interval={0}
            minTickGap={0}
            tickMargin={12}
            height={44}
            tick={<WfTick />}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            padding={{ left: -1, right: 0 }}
          />
          <YAxis
            width={40}
            domain={["auto", "auto"]}
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            tickMargin={2}
            tickFormatter={(v) => `${to1(v)}`}
            label={{
              value: getMoneyUnit(symbol).axis,
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
              if (!active || !payload?.length) return null;
              const p0 = payload[0]?.payload || {};
              const cityParts = (payload || [])
                .filter((pp) => String(pp.dataKey || "").startsWith("city_"))
                .map((pp) => ({
                  city: String(pp.dataKey).replace("city_", ""),
                  val: to1(pp.value || 0),
                }))
                .filter((x) => Math.abs(x.val) > 0);

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
                    style={{ fontWeight: 700, fontSize: 12, marginBottom: 6 }}
                  >
                    {label}
                  </div>

                  {cityParts.length > 0 && (
                    <div style={{ marginBottom: 6 }}>
                      {cityParts.map(({ city, val }) => (
                        <div
                          key={city}
                          style={{
                            fontSize: 12,
                            color: "#334155",
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: 9,
                              height: 9,
                              borderRadius: 9999,
                              background: getCityColor(city),
                            }}
                          />
                          <span>
                            {city}: {val}
                            {suffix}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {cityParts.length === 0 && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#334155",
                        marginBottom: 6,
                      }}
                    >
                      Change: {to1(p0.raw)}
                      {suffix}
                    </div>
                  )}

                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Cumulative: {to1(p0.cumulative)}
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

          {usingCustomized && activeCities.length ? (
            <>
              {activeCities.map((city) => (
                <Bar
                  key={city}
                  dataKey={`city_${city}`}
                  stackId="wf"
                  isAnimationActive={false}
                  barSize={26}
                  fill={getCityColor(city)}
                />
              ))}

              <Bar
                dataKey="stackAbs"
                isAnimationActive={false}
                fill="transparent"
              >
                <LabelList
                  dataKey="stackAbs"
                  position="top"
                  offset={8}
                  formatter={(_, dataEntry) => {
                    const c = Number(dataEntry?.cumulative ?? 0);
                    return showIfNotZero(c) ? `${to1(c)}${suffix}` : "";
                  }}
                  style={{ fontSize: 12, fill: "#111827", fontWeight: 700 }}
                />
              </Bar>
            </>
          ) : (
            <Bar
              dataKey="delta"
              stackId="wf"
              isAnimationActive={false}
              barSize={26}
            >
              {(wfData || []).map((d, i) => (
                <Cell key={i} fill={colorForStep(d.name, d.kind, d.raw)} />
              ))}
              <LabelList
                dataKey="delta"
                position="top"
                offset={6}
                formatter={(_, dataEntry) => {
                  const c = Number(dataEntry?.cumulative ?? 0);
                  return showIfNotZero(c) ? `${to1(c)}${suffix}` : "";
                }}
                style={{ fontSize: 12, fill: "#111827", fontWeight: 700 }}
              />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// =====================  RECOMMENDATION PANEL (UPDATED)  =====================
function RecommendationPanel({
  symbol,
  locations,
  recommended,
  onCompare,
  selectedSkuId,
  onToggleFull, // NEW: toggles full-width layout
  isFull, // NEW: whether panel is currently full-width
}) {
  const [recommendationType, setRecommendationType] = useState("recommended");
  const [summaryTabValue, setSummaryTabValue] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const settingsOpen = Boolean(anchorEl);

  const [transferOpen, setTransferOpen] = useState(false);
  const handleRequestTransfer = () => setTransferOpen(true);
  const closeTransfer = () => setTransferOpen(false);

  const [wfFullscreenOpen, setWfFullscreenOpen] = useState(false);

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

  const { scale } = getMoneyUnit(symbol);
  const getLoc = useCallback(
    (name) => (locations || []).find((l) => l.name === name),
    [locations]
  );

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
        name: "Labor Cost",
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

  // Stacked WF for Customize
  const { rows: wfStackedRows, activeCities } = useMemo(() => {
    if (!usingCustomized) return { rows: [], activeCities: [] };
    const recoQty = Number(recommended?.qty || 0);
    return buildStackedWaterfall(
      stepsForQty(totalCustomQty),
      custom,
      recoQty,
      true,
      "Simulated Revenue"
    );
  }, [usingCustomized, custom, totalCustomQty, recommended?.qty]);

  const openSettings = (e) => setAnchorEl(e.currentTarget);
  const closeSettings = () => setAnchorEl(null);

  const fmtQty = (n) => fmtInt(n);
  const fmtMoney = (n) => fmtCurrency(n, symbol);

  const computeCustomMetrics = useCallback(
    (locName, qty) => {
      const loc = getLoc(locName) || {};
      const base =
        loc.logistics && Object.keys(loc.logistics).length
          ? loc.logistics
          : logistics;

      const baseQty = Number(recommended?.qty || 0) || 1;
      const m = Number(qty || 0) / baseQty;
      const safeMul = (v) => Number(v || 0) * m;

      const totalCostRaw =
        Number(base.totalCost ?? 0) ||
        Number(base.logisticCost || 0) +
          Number(base.laborHandlingCost || 0) +
          Number(base.transactionCost || 0);

      const revenueRaw =
        Number(base.revenue ?? 0) ||
        Number(base.projectedRevenue || 0) +
          Number(base.additionalRevenue || 0);

      const profitRaw = Number(base.profit ?? 0) || revenueRaw - totalCostRaw;

      const profitScaled = safeMul(profitRaw);
      const totalCostScaled = safeMul(totalCostRaw);
      const revenueScaled = safeMul(revenueRaw);
      const pm = revenueScaled > 0 ? (profitScaled / revenueScaled) * 100 : 0;

      return {
        eta: loc.eta ?? recommended?.eta ?? "-",
        profit: profitScaled,
        profitMargin: to1(pm),
        logisticCost: safeMul(base.logisticCost),
        laborHandlingCost: safeMul(base.laborHandlingCost),
        transactionCost: safeMul(base.transactionCost),
        totalCost: totalCostScaled,
        revenue: revenueScaled,
      };
    },
    [getLoc, logistics, recommended?.qty, recommended?.eta]
  );

  const customizedCities = useMemo(
    () =>
      Object.entries(custom || [])
        .filter(
          ([name, q]) => Number(q) > 0 && name !== (recommended?.name || "")
        )
        .map(([name, qty]) => ({
          name,
          qty: Number(qty),
          ...computeCustomMetrics(name, qty),
        })),
    [custom, recommended?.name, computeCustomMetrics]
  );

  const RadioAlias = MuiRadio;

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Stack
        sx={{ p: 1.5, borderBottom: 1, borderColor: "grey.300", flexShrink: 0 }}
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
              control={<RadioAlias size="small" />}
              label={<Typography fontSize={12}>Recommended</Typography>}
            />
            <FormControlLabel
              value="customize"
              control={<RadioAlias size="small" />}
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
            onClick={handleRequestTransfer}
          >
            Request Transfer
          </Button>
        </Stack>
      </Stack>

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

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 1.5,
          pb: 1.5,
        }}
      >
        <Box sx={{ width: "100%" }}>
          {summaryTabValue === 0 ? (
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: "stretch", flexWrap: "wrap" }}
            >
              <Card
                sx={{
                  flex: 1,
                  minWidth: 260,
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

              {usingCustomized && customizedCities.length > 0 && (
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 260,
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
                    <Stack spacing={0.75}>
                      {customizedCities.map((c) => (
                        <Stack
                          key={c.name}
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
                            {c.name}:
                          </Typography>
                          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                            {fmtQty(c.qty)} Qty
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          ) : (
            <>
              {usingCustomized && activeCities.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1, flexWrap: "wrap" }}
                >
                  {activeCities.map((city) => (
                    <Chip
                      key={city}
                      label={city}
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        "& .MuiChip-label": {
                          fontSize: 12,
                          color: "#111827",
                          fontWeight: 600,
                        },
                      }}
                      icon={
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: 9999,
                            background: getCityColor(city),
                            marginLeft: 6,
                          }}
                        />
                      }
                    />
                  ))}
                </Stack>
              )}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 0.75 }}
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}
                >
                  Waterfall Graph
                </Typography>
                <Tooltip title="Open fullscreen">
                  <IconButton
                    size="small"
                    onClick={() => setWfFullscreenOpen(true)}
                    aria-label="Open waterfall fullscreen"
                    sx={{ border: "1px solid #e5e7eb" }}
                  >
                    <OpenInFull fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Card sx={{ mb: 1.5 }}>
                <CardContent sx={{ p: 1.25 }}>
                  <WaterfallChart
                    usingCustomized={usingCustomized}
                    activeCities={activeCities}
                    wfData={wfData}
                    wfStackedRows={wfStackedRows}
                    symbol={symbol}
                    height={260}
                  />
                </CardContent>
              </Card>

              {recommended && (
                <Card
                  sx={{
                    border: 1,
                    borderColor: "#dbeafe",
                    boxShadow: 0,
                    mb: customizedCities.length ? 1.25 : 0,
                  }}
                >
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
                          title="Revenue"
                          value={fmtMoney(recommended.revenue)}
                          delta="24%"
                        />
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
                          title="Total Cost"
                          value={fmtMoney(recommended.totalCost)}
                          delta="10%"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {usingCustomized &&
                customizedCities.map((c) => (
                  <Card
                    key={c.name}
                    sx={{
                      border: 1,
                      borderColor: "#e5e7eb",
                      boxShadow: 0,
                      mb: 1.0,
                    }}
                  >
                    <Stack
                      sx={{
                        px: 1.5,
                        py: 1,
                        bgcolor: "#fff",
                        borderBottom: "1px solid #eef2f7",
                      }}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Typography
                        sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}
                      >
                        {c.name}{" "}
                        <Typography
                          component="span"
                          sx={{ color: "#6b7280", ml: 0.5, fontWeight: 700 }}
                        >
                          (Customized)
                        </Typography>
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#334155" }}>
                        Qty: <strong>{fmtInt(c.qty)}</strong>
                      </Typography>
                    </Stack>

                    <CardContent sx={{ p: 1.25 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} md={4}>
                          <MetricTile
                            title="Profit"
                            value={fmtMoney(c.profit)}
                            delta={`${to1(c.profitMargin)}%`}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <MetricTile title="ETA" value={c.eta} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <MetricTile
                            title="Revenue"
                            value={fmtMoney(c.revenue)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <MetricTile
                            title="Logistic Cost"
                            value={fmtMoney(c.logisticCost)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <MetricTile
                            title="Labor/Handling"
                            value={fmtMoney(c.laborHandlingCost)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <MetricTile
                            title="Total Cost"
                            value={fmtMoney(c.totalCost)}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
            </>
          )}
        </Box>
      </Box>

      <Dialog open={transferOpen} onClose={closeTransfer}>
        <DialogContent sx={{ textAlign: "center", px: 4, py: 3 }}>
          <CheckCircleOutline sx={{ fontSize: 42, color: "#22c55e", mb: 1 }} />
          <Typography sx={{ color: "#111827", fontWeight: 600, mb: 0.5 }}>
            Request Stock (SKU: {selectedSkuId || "-"})
          </Typography>
          <Typography sx={{ color: "#111827", mb: 1 }}>
            Transfer to Region 1
          </Typography>
          <Typography sx={{ color: "#22c55e", fontWeight: 700, mb: 2 }}>
            Submitted Successfully
          </Typography>
          <DialogActions sx={{ justifyContent: "center", p: 0 }}>
            <Button
              variant="contained"
              onClick={closeTransfer}
              sx={{ minWidth: 96 }}
            >
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={wfFullscreenOpen}
        onClose={() => setWfFullscreenOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#f8fafc",
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
            Waterfall —{" "}
            {usingCustomized ? "Customized Allocation" : "Recommended"}
          </Typography>
          <IconButton onClick={() => setWfFullscreenOpen(false)}>
            <Close />
          </IconButton>
        </Stack>

        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ width: "100%", height: { xs: 420, sm: 520, md: 640 } }}>
            <WaterfallChart
              usingCustomized={usingCustomized}
              activeCities={activeCities}
              wfData={wfData}
              wfStackedRows={wfStackedRows}
              symbol={symbol}
              height={Math.min(
                700,
                typeof window !== "undefined" ? window.innerHeight * 0.75 : 640
              )}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

const typeColorByCategory = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("increase") || c.includes("expansion") || c.includes("launch"))
    return "info";
  if (c.includes("supply")) return "error";
  if (c.includes("decrease") || c.includes("pressure") || c.includes("cost"))
    return "error";
  return "primary";
};

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

function MainContentSection() {
  const theme = useTheme();
  const lgDown = useMediaQuery(theme.breakpoints.down("lg"));

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [panelFull, setPanelFull] = useState(false); 

  const effectiveCollapsed = showSim ? sidebarCollapsed : false;

  const layoutCols = `${effectiveCollapsed ? COLLAPSED_W : SIDEBAR_W} 1fr`;

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
        overflowX: "hidden",
        overflowY: "hidden",
        alignItems: "stretch",
        transition: "grid-template-columns 220ms ease",
        minHeight: 0,
      }}
    >
      <Box sx={{ minWidth: 0, minHeight: 0 }}>
        <SidebarBox
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
          collapsed={effectiveCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          allowToggle={showSim}
          forceCollapsed={false}
        />
      </Box>

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
            gap: 1,
            minHeight: 0,
            gridTemplateColumns: panelFull
              ? "1fr"
              : { xs: "1fr", lg: "minmax(0,2fr) minmax(0,1.2fr)" },
            gridTemplateRows: "minmax(220px, 1fr) minmax(260px, 1fr)",
            alignItems: "stretch",
            pr: { lg: 1 },
          }}
        >
          {!panelFull && (
            <Box
              sx={{ minHeight: 0, display: "flex", gridColumn: 1, gridRow: 1 }}
            >
              <ForecastChartSection
                sku={currentSku}
                selectedSkuId={selectedSkuId}
                skuOptions={skuOptions}
                onChangeSku={setSelectedSkuId}
                height={205}
              />
            </Box>
          )}

          {!panelFull && (
            <Box
              sx={{ minHeight: 0, display: "flex", gridColumn: 1, gridRow: 2 }}
            >
              <DemandByCitySection
                locations={currentSku?.locations || []}
                sku={currentSku}
                height={205}
              />
            </Box>
          )}

          <Box
            sx={{
              minWidth: 0,
              minHeight: 0,
              height: "100%",
              display: "flex",
              gridColumn: panelFull ? "1" : { xs: "1", lg: "2" },
              gridRow: panelFull
                ? "1 / span 2"
                : { xs: "auto", lg: "1 / span 2" },
              alignSelf: "start",
              width: "100%",
            }}
          >
            <RecommendationPanel
              symbol={currentSku?.symbol || "₹"}
              locations={currentSku?.locations || []}
              recommended={currentSku?.recommendedLocation || null}
              onCompare={() => setShowSim(true)}
              selectedSkuId={selectedSkuId}
              onToggleFull={() => setPanelFull((v) => !v)}
              isFull={panelFull}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

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
          minHeight: 0,
        }}
      >
        <MainContentSection />
      </Card>
    </>
  );
}
