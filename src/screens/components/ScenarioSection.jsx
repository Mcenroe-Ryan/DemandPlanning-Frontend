import Add from "@mui/icons-material/Add";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HelpOutline from "@mui/icons-material/HelpOutline";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Warning from "@mui/icons-material/Warning";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import LineIcon from "@mui/icons-material/Remove";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

/* ---------- data ---------- */
const scenariosData = [
  { id: 1, title: "Sudden Spike in Demand", description: "30% increase due to marketing campaign", category: "Demand", impact: "+30%", duration: "3 Months", isSelected: true },
  { id: 2, title: "Sudden Drop in Demand", description: "20% drop due to economic slowdown", category: "Demand", impact: "-20%", duration: "6 Months", isSelected: false },
  { id: 3, title: "New Market Expansion", description: "Launch in new region with 40% uplift", category: "Demand", impact: "+40%", duration: "12 Months", isSelected: false },
  { id: 4, title: "Supplier Disruption", description: "Unfulfilled demand due to raw material shortage", category: "Supply", impact: "-15%", duration: "4 Months", isSelected: false },
  { id: 5, title: "Price Change Impact", description: "10% price increase affects demand", category: "Price", impact: "-12%", duration: "6 Months", isSelected: false },
  { id: 6, title: "New Product Introduction", description: "25% cannibalization + 35% new demand", category: "Product", impact: "+10%", duration: "9 Months", isSelected: false },
  { id: 7, title: "Promotions & Discount", description: "Flash sale increases demand by 50%", category: "Demand", impact: "+50%", duration: "1 Months", isSelected: false },
  { id: 8, title: "Change in Lead Time", description: "Lead time increase affects availability", category: "Supply", impact: "-8%", duration: "8 Months", isSelected: false },
  { id: 9, title: "Production Constraints", description: "30% capacity reduction", category: "Supply", impact: "-30%", duration: "2 Months", isSelected: false },
];

const disruptionData = [
  {
    id: 1,
    date: "22 Aug, 2025 12:34PM",
    location: "Hyderabad (HYD543)",
    product: "Sweet Mixes (C5240200A)",
    description: "Unexpected regional event.",
    isCompleted: false,
  },
  {
    id: 2,
    date: "18 Jul, 2025 04:30PM",
    location: "Hyderabad (HYD543)",
    product: "RTE - Soup Pack (Veg) (C4660200B)",
    description: "Weather event.",
    isCompleted: true,
  },
];

const chartData = {
  yAxisLabels: [30, 25, 20, 15, 10, 5, 0],
  xAxisLabels: ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7","Week 8"],
  regions: [
    { name: "Region 1", color: "#0891b2", data: [6, 8, 10, 17, 12, 7, 9, 15] },
    { name: "Region 2", color: "#f87171", data: [12, 9, 6, 13, 10, 16, 14, 17] },
    { name: "Region 3", color: "#22c55e", data: [15, 13, 11, 9, 12, 11, 18, 20] },
  ],
};

/* ---------- helpers ---------- */
const getCategoryColor = (category) => {
  switch (category) {
    case "Demand": return { bg: "#e0f7fa", color: "#00695c" };
    case "Supply": return { bg: "#ffebee", color: "#c62828" };
    case "Price":  return { bg: "#e8f5e8", color: "#2e7d32" };
    case "Product":return { bg: "#e3f2fd", color: "#1565c0" };
    default:       return { bg: "#f5f5f5", color: "#424242" };
  }
};

/* ============================================================
   MonthGraph — responsive, pure SVG version of your first graph
   ============================================================ */
const MonthGraph = ({ viewMode, setViewMode }) => {
  // Axes & ticks
  const yMax = 35;
  const yTicks = [35, 30, 25, 20, 15, 10, 5, 0];
  const xLabels = ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7","Week 8"];

  // Demo data (customize with real series later)
  const actual = [6, 8, 12, 17, 14, 11, 13, 15];
  const forecast = [14, 13, 12, 13, 14, 16, 15, 14];

  // SVG metrics
  const W = 860;
  const H = 340;
  const margin = { top: 10, right: 16, bottom: 40, left: 56 };
  const iw = W - margin.left - margin.right;
  const ih = H - margin.top - margin.bottom;

  const x = (i) => (i / (xLabels.length - 1)) * iw;
  const y = (val) => ih - (val / yMax) * ih;

  const toPath = (arr) =>
    arr
      .map((v, i) => `${i === 0 ? "M" : "L"} ${margin.left + x(i)} ${margin.top + y(v)}`)
      .join(" ");

  const actualPath = toPath(actual);
  const forecastPath = toPath(forecast);

  // Pink band around middle (between week 4 and week 5)
  const bandX = margin.left + x(4) - iw * 0.012; // ~1.2% width offset
  const bandW = iw * 0.025; // ~2.5% width

  return (
    <Paper
      sx={{
        width: "100%",
        border: "1px solid #9CA3AF",
        borderTop: "none",
        p: 1.5,
      }}
    >
      {/* Legend & toggles */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1}>
          <Chip
            icon={<CircleIcon sx={{ color: "#0E7490", fontSize: 12 }} />}
            label="Actual"
            variant="outlined"
            sx={{
              bgcolor: "#EFF6FF",
              borderColor: "#9CA3AF",
              "& .MuiChip-label": { fontSize: 14, color: "#4B5563" },
            }}
          />
          <Chip
            icon={<LineIcon sx={{ color: "#2563EB", fontSize: 16 }} />}
            label="Forecast"
            variant="outlined"
            sx={{
              bgcolor: "#EFF6FF",
              borderColor: "#9CA3AF",
              "& .MuiChip-label": { fontSize: 14, color: "#4B5563" },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant={viewMode === "M" ? "contained" : "outlined"}
            onClick={() => setViewMode("M")}
            sx={{
              minWidth: 38, width: 38, height: 38, borderRadius: "50px",
              borderColor: "#2563EB",
              color: viewMode === "M" ? "white" : "#1F2937",
              bgcolor: viewMode === "M" ? "#2563EB" : "transparent",
              fontSize: 12, fontWeight: 600,
              "&:hover": { bgcolor: viewMode === "M" ? "#1D4ED8" : "#EFF6FF" },
            }}
          >
            M
          </Button>
          <Button
            variant={viewMode === "W" ? "contained" : "outlined"}
            onClick={() => setViewMode("W")}
            sx={{
              minWidth: 38, width: 38, height: 38, borderRadius: "50px",
              borderColor: "#2563EB",
              color: viewMode === "W" ? "white" : "#1F2937",
              bgcolor: viewMode === "W" ? "#2563EB" : "transparent",
              fontSize: 12, fontWeight: 600,
              "&:hover": { bgcolor: viewMode === "W" ? "#1D4ED8" : "#EFF6FF" },
            }}
          >
            W
          </Button>
        </Stack>
      </Stack>

      {/* Responsive SVG area */}
      <Box sx={{ width: "100%", aspectRatio: { xs: "4 / 3", md: "16 / 7" } }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
          {/* grid background */}
          <defs>
            <pattern id="grid" width={iw / 8} height={ih / 7} patternUnits="userSpaceOnUse">
              <path d={`M ${iw / 8} 0 L 0 0 0 ${ih / 7}`} fill="none" stroke="#E5E7EB" strokeWidth="1" />
            </pattern>
          </defs>

          {/* plot area background */}
          <rect
            x={margin.left}
            y={margin.top}
            width={iw}
            height={ih}
            fill="url(#grid)"
          />

          {/* pink band */}
          <rect x={bandX} y={margin.top} width={bandW} height={ih} fill="rgba(255, 167, 167, 0.49)" />

          {/* axes lines */}
          <line
            x1={margin.left}
            y1={margin.top + ih}
            x2={margin.left + iw}
            y2={margin.top + ih}
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + ih}
            stroke="#9CA3AF"
            strokeWidth="1"
          />

          {/* y tick labels */}
          {yTicks.map((t) => (
            <text
              key={t}
              x={margin.left - 8}
              y={margin.top + y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              style={{ fontSize: 12, fontWeight: 600, fill: "#6B7280" }}
            >
              {t}
            </text>
          ))}

          {/* x tick labels */}
          {xLabels.map((lbl, i) => (
            <text
              key={lbl}
              x={margin.left + x(i)}
              y={margin.top + ih + 24}
              textAnchor="middle"
              style={{ fontSize: 12, fontWeight: 600, fill: "#6B7280" }}
            >
              {lbl}
            </text>
          ))}

          {/* y axis title */}
          <text
            x={margin.left - 48}
            y={margin.top + ih / 2}
            transform={`rotate(-90 ${margin.left - 48} ${margin.top + ih / 2})`}
            textAnchor="middle"
            style={{ fontSize: 14, fill: "#4B5563" }}
          >
            Units (in thousands)
          </text>

          {/* series */}
          <path d={actualPath} fill="none" stroke="#0E7490" strokeWidth="2.5" />
          <path d={forecastPath} fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="6,6" />
        </svg>
      </Box>
    </Paper>
  );
};

/* ============================================================
   RegionChart (unchanged from your version except minor polish)
   ============================================================ */
const RegionChart = ({ viewMode, setViewMode }) => {
  return (
    <Paper
      sx={{
        width: "100%",
        border: "1px solid #cbd5e1",
        borderRadius: 0,
        p: 1.5,
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1}>
            {chartData.regions.map((region, index) => (
              <Chip
                key={index}
                icon={<Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: region.color, ml: 1 }} />}
                label={region.name}
                variant="outlined"
                sx={{
                  bgcolor: "#eff6ff",
                  borderColor: "#cbd5e1",
                  "& .MuiChip-label": { fontSize: 14, color: "#64748b" },
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant={viewMode === "M" ? "contained" : "outlined"}
              onClick={() => setViewMode("M")}
              sx={{
                minWidth: 38, width: 38, height: 32, borderRadius: "50px",
                fontSize: 12, fontWeight: 600,
                color: viewMode === "M" ? "white" : "#1e293b",
                bgcolor: viewMode === "M" ? "#2563eb" : "transparent",
                borderColor: "#2563eb",
                "&:hover": { bgcolor: viewMode === "M" ? "#1d4ed8" : "#f1f5f9" },
              }}
            >
              M
            </Button>
            <Button
              variant={viewMode === "W" ? "contained" : "outlined"}
              onClick={() => setViewMode("W")}
              sx={{
                minWidth: 38, width: 38, height: 32, borderRadius: "50px",
                fontSize: 12, fontWeight: 600,
                color: viewMode === "W" ? "white" : "#1e293b",
                bgcolor: viewMode === "W" ? "#2563eb" : "transparent",
                borderColor: "#2563eb",
                "&:hover": { bgcolor: viewMode === "W" ? "#1d4ed8" : "#f1f5f9" },
              }}
            >
              W
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ position: "relative", flex: 1, minHeight: 280 }}>
          <Stack direction="row" sx={{ height: "100%" }}>
            <Stack spacing={5.125} sx={{ width: 60, justifyContent: "space-between", pt: 2 }}>
              <Typography
                sx={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  fontSize: 14,
                  color: "#64748b",
                  position: "absolute",
                  left: -60,
                  top: "50%",
                  width: 144,
                  textAlign: "center",
                }}
              >
                Units (in thousands)
              </Typography>
              {chartData.yAxisLabels.map((label, index) => (
                <Typography
                  key={index}
                  sx={{ fontSize: 12, color: "#64748b", textAlign: "right", fontWeight: 600, width: 34 }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>

            <Box sx={{ flex: 1, position: "relative", ml: 2 }}>
              <svg width="100%" height="280" viewBox="0 0 774 280" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid2" width="96.75" height="41" patternUnits="userSpaceOnUse">
                    <path d="M 96.75 0 L 0 0 0 41" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid2)" />

                {chartData.regions.map((region, regionIndex) => {
                  const pathData = region.data
                    .map((value, index) => {
                      const x = (index * 774) / 7;
                      const y = 280 - (value / 30) * 280;
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ");

                  return (
                    <g key={regionIndex}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={region.color}
                        strokeWidth="2"
                        strokeDasharray={regionIndex === 1 ? "5,5" : "0"}
                      />
                      {region.data.map((value, index) => {
                        const x = (index * 774) / 7;
                        const y = 280 - (value / 30) * 280;
                        return <circle key={index} cx={x} cy={y} r="3" fill={region.color} />;
                      })}
                    </g>
                  );
                })}
              </svg>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ position: "absolute", bottom: -26, left: 0, right: 0, px: 2 }}
              >
                {chartData.xAxisLabels.map((label, index) => (
                  <Typography key={index} sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                    {label}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

/* ---------- top nav ---------- */
const AnalyticsSection = () => {
  const [activeTab, setActiveTab] = useState("Scenarios");
  const navigationItems = [
    { label: "Demand", hasAlert: false, alertCount: 0 },
    { label: "Alerts for Forecast Error", hasAlert: true, alertCount: 2 },
    { label: "Compare Model", hasAlert: false, alertCount: 0 },
    { label: "Analytics", hasAlert: false, alertCount: 0 },
    { label: "Scenarios", hasAlert: false, alertCount: 0 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        bgcolor: "white",
        border: 1,
        borderColor: "grey.300",
        overflowX: "auto",
      }}
    >
      {navigationItems.map((item) => (
        <Box
          key={item.label}
          onClick={() => setActiveTab(item.label)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            px: 1.25,
            py: 0.625,
            cursor: "pointer",
            backgroundColor: activeTab === item.label ? "blue.50" : "transparent",
            borderBottom: activeTab === item.label ? 2 : 0,
            borderBottomColor: activeTab === item.label ? "blue.500" : "transparent",
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, color: "grey.700", textAlign: "center" }}>
            {item.label}
          </Typography>
          {item.hasAlert && (
            <Chip
              label={item.alertCount}
              size="small"
              sx={{
                bgcolor: "red",
                color: "white",
                height: 20,
                fontSize: 12,
                fontWeight: 600,
                "& .MuiChip-label": { px: 0.75, py: 0 },
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

/* ---------- main content ---------- */
const ScenariosSection = () => {
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [chartTab, setChartTab] = useState(0);
  const [disruptionTab, setDisruptionTab] = useState(0);
  const [viewMode, setViewMode] = useState("W");

  const handleScenarioClick = (scenarioId) => setSelectedScenario(scenarioId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Main content area */}
      <Stack direction="row" spacing={0.5} sx={{ height: "100%", border: 1, borderColor: "grey.300", flex: 1, minHeight: 0 }}>
        {/* Left sidebar - Scenarios */}
        <Box sx={{ width: 305, bgcolor: "background.paper", borderRight: 1, borderColor: "grey.300", minHeight: 0 }}>
          <Stack sx={{ height: "100%" }}>
            <Box sx={{ p: 1.25, bgcolor: "grey.200", borderBottom: 1, borderColor: "grey.300" }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                <HelpOutline sx={{ fontSize: 16 }} />
                <Typography variant="body2" color="text.secondary">What-If Scenarios?</Typography>
              </Stack>
              <Typography variant="caption" color="text.disabled">
                Select a scenario to analyze its impact on demand planning.
              </Typography>
            </Box>

            <Box sx={{ height: 50, borderBottom: 1, borderColor: "grey.300" }}>
              <Autocomplete
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search scenarios"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        height: 50,
                        "& fieldset": { border: "none" },
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Search sx={{ fontSize: 16, mr: 1 }} />,
                      endAdornment: <Add sx={{ fontSize: 16 }} />,
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 1, overflow: "auto" }}>
              <Stack>
                {scenariosData.map((scenario) => (
                  <Paper
                    key={scenario.id}
                    onClick={() => handleScenarioClick(scenario.id)}
                    sx={{
                      p: 1.25,
                      m: 0,
                      borderRadius: 0,
                      border: "none",
                      borderBottom: 1,
                      borderColor: "grey.300",
                      borderLeft: scenario.isSelected ? 4 : 0,
                      borderLeftColor: scenario.isSelected ? "info.main" : "transparent",
                      bgcolor: scenario.isSelected ? "info.50" : "background.paper",
                      cursor: "pointer",
                      "&:hover": { bgcolor: scenario.isSelected ? "info.50" : "grey.50" },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <TrendingUp sx={{ fontSize: 12 }} />
                          <Typography variant="body2" color="text.primary" sx={{ fontSize: 13, fontWeight: 500 }}>
                            {scenario.title}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                          {scenario.description}
                        </Typography>
                      </Stack>
                      <MoreVert sx={{ fontSize: 16 }} />
                    </Stack>

                    <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                      <Chip
                        label={scenario.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(scenario.category).bg,
                          color: getCategoryColor(scenario.category).color,
                          fontSize: 9,
                          height: 18,
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                      <Chip
                        label={scenario.impact}
                        size="small"
                        sx={{
                          bgcolor: "grey.200",
                          color: "grey.800",
                          fontSize: 9,
                          height: 18,
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                      <Chip
                        label={scenario.duration}
                        size="small"
                        sx={{
                          bgcolor: "grey.200",
                          color: "grey.800",
                          fontSize: 9,
                          height: 18,
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Middle content - Charts */}
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          {/* Top chart - MonthGraph (responsive SVG) */}
          <MonthGraph viewMode={viewMode} setViewMode={setViewMode} />

          {/* Bottom chart with tabs - RegionChart */}
          <Box sx={{ bgcolor: "background.paper", border: 1, borderColor: "grey.300" }}>
            <Tabs
              value={chartTab}
              onChange={(e, newValue) => setChartTab(newValue)}
              sx={{
                bgcolor: "background.paper",
                borderBottom: 1,
                borderColor: "grey.300",
                "& .MuiTab-root": { minHeight: 40, fontSize: 12 },
              }}
            >
              <Tab label="Graph" />
              <Tab label="Data Table" />
            </Tabs>

            <RegionChart viewMode={viewMode} setViewMode={setViewMode} />
          </Box>
        </Stack>

        {/* Right sidebar - Disruption */}
        <Box sx={{ width: 320, bgcolor: "background.paper", border: 1, borderColor: "grey.300", minWidth: 0 }}>
          <Tabs
            value={disruptionTab}
            onChange={(e, newValue) => setDisruptionTab(newValue)}
            sx={{
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "grey.300",
              "& .MuiTab-root": { minHeight: 40, fontSize: 12 },
            }}
          >
            <Tab label="Disruption" />
            <Tab label="Tracking" />
          </Tabs>

          <Box sx={{ p: 1.5, bgcolor: "grey.50", height: "calc(100% - 48px)", overflow: "auto" }}>
            <Stack spacing={2}>
              {disruptionData.map((disruption) => (
                <Stack key={disruption.id} direction="row" spacing={1} alignItems="flex-start">
                  <Checkbox checked={disruption.isCompleted} size="small" sx={{ mt: -0.5 }} />

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600, fontSize: 11 }}>
                      {disruption.date}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 0.5 }}>
                      <Warning sx={{ fontSize: 12, color: "warning.main", mt: 0.25 }} />
                      <Typography
                        variant="caption"
                        color="text.primary"
                        sx={{
                          fontSize: 11,
                          textDecoration: disruption.isCompleted ? "line-through" : "none",
                        }}
                      >
                        <strong>
                          {disruption.location} - {disruption.product}:
                        </strong>
                        <br />
                        {disruption.description}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Stack>

      {/* Bottom action buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          p: 2,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "grey.300",
        }}
      >
        <Checkbox size="small" />
        <Typography variant="body2" color="text.secondary" sx={{ mr: "auto" }}>
          Save as Template
        </Typography>
        <Button variant="contained" color="primary" size="small">
          Apply Scenario
        </Button>
        <Button variant="outlined" size="small">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

/* ---------- page shell ---------- */
const WhatIfScenario = () => {
  return (
    <Box
      sx={{
        bgcolor: "grey.300",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "grey.200",
          width: "100%",
          maxWidth: 1920,
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            mt: "92px",
            p: 1.25,
            height: "calc(100vh - 92px)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Stack direction="column" spacing={1.25} sx={{ width: "100%", height: "100%", minHeight: 0 }}>
            <AnalyticsSection />
            <ScenariosSection />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default WhatIfScenario;
