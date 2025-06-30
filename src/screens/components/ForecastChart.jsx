import React, { useMemo, useState, useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GridViewIcon from "@mui/icons-material/GridView";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";

// Custom styled checkbox
const BlueSquare = styled("span")({
  width: 18,
  height: 18,
  borderRadius: 3,
  border: "2px solid #2196f3",
  background: "#fff",
});
const BlueChecked = styled(BlueSquare)({
  background: "#2196f3",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    left: 4,
    top: 1,
    width: 7,
    height: 12,
    border: "solid #fff",
    borderWidth: "0 2.5px 2.5px 0",
    transform: "rotate(45deg)",
  },
});
function BlueCheckbox(props) {
  return (
    <Checkbox
      disableRipple
      color="default"
      checkedIcon={<BlueChecked />}
      icon={<BlueSquare />}
      sx={{ p: 0.5, "&:hover": { bgcolor: "transparent" } }}
      {...props}
    />
  );
}

const LEGEND_CONFIG = [
  { key: "actual", label: "Actual", color: "#ff4d4f", dash: "Solid", seriesIndex: 0 },
  { key: "baseline", label: "Baseline", color: "#1890ff", dash: "Solid", seriesIndex: 1 },
  { key: "ml", label: "ML", color: "#fadb14", dash: "Solid", seriesIndex: 2 },
  { key: "consensus", label: "Consensus", color: "#52c41a", dash: "Solid", seriesIndex: 3 },
  { key: "baseline_forecast", label: "Baseline Forecast", color: "rgba(24,144,255,0.6)", dash: "Dash", seriesIndex: 4 },
  { key: "ml_forecast", label: "ML Forecast", color: "rgba(250,173,20,0.6)", dash: "Dash", seriesIndex: 5 },
  { key: "consensus_forecast", label: "Consensus Forecast", color: "rgba(82,196,26,0.6)", dash: "Dash", seriesIndex: 6 },
  { key: "holidays", label: "Holidays", color: "rgba(82,196,26,0.4)", dash: "Solid", isOverlay: true },
  { key: "promotions", label: "Promotions", color: "rgba(250,173,20,0.4)", dash: "Solid", isOverlay: true },
];

// Tree menu data
const treeData = [
  {
    id: 1,
    title: "Model",
    disabled: false,
    type: "radio",
    items: [
      { id: 11, label: "XGBoost", value: "xgboost", starred: true },
      { id: 12, label: "LightGBM", value: "lightgbm" },
      { id: 13, label: "ARIMA", value: "arima" },
    ],
  },
  {
    id: 2,
    title: "External Factors",
    disabled: true,
    type: "checkbox",
    items: [
      { id: 21, label: "All", checked: false },
      { id: 22, label: "CPI", checked: true, starred: true },
      { id: 23, label: "Interest Rate", checked: false },
      { id: 24, label: "GDP", checked: true, starred: true },
      { id: 25, label: "Unemployment Rate", checked: true, starred: true },
      { id: 26, label: "Average Disposable Income", checked: false },
    ],
  },
  {
    id: 3,
    title: "Events",
    disabled: true,
    type: "checkbox",
    items: [
      { id: 31, label: "All", checked: true, starred: true },
      { id: 32, label: "Holidays", checked: true },
      { id: 33, label: "Marketing & Promotion", checked: true },
    ],
  },
];

// Tree menu item (disabled sections)
function TreeMenuItem({ item, disabled }) {
  return (
    <ListItem
      sx={{
        px: 2, py: 0.25, borderRadius: 1,
        "&:hover": disabled ? {} : { bgcolor: "rgba(0,0,0,0.04)" },
        minHeight: 28, opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <BlueCheckbox checked={item.checked} disabled />
      </ListItemIcon>
      {item.starred && <StarIcon sx={{ fontSize: 14, color: "warning.main", mr: 0.5 }} />}
      <ListItemText
        primary={
          <Typography variant="body2" color="text.secondary" sx={{ mt: -0.25 }}>
            {item.label}
          </Typography>
        }
      />
    </ListItem>
  );
}

// Tree menu section
function TreeMenuSection({ section, selectedModel, setSelectedModel }) {
  const [expanded, setExpanded] = useState(section.id === 1);
  const toggle = () => !section.disabled && setExpanded(!expanded);

  return (
    <>
      <Box
        onClick={toggle}
        sx={{
          px: 1, py: 1, bgcolor: section.disabled ? "grey.100" : "primary.lighter",
          borderRadius: 1, display: "flex", alignItems: "center", gap: 1,
          mb: 0.5, cursor: section.disabled ? "not-allowed" : "pointer",
          opacity: section.disabled ? 0.6 : 1,
        }}
      >
        <ExpandMoreIcon
          sx={{
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s",
            color: section.disabled ? "grey.500" : "primary.main",
          }}
        />
        <DescriptionOutlined sx={{ color: section.disabled ? "grey.500" : "primary.main" }} />
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ flexGrow: 1, color: section.disabled ? "grey.600" : "primary.main" }}
        >
          {section.title}
        </Typography>
      </Box>

      {expanded && (
        <Box
          sx={{
            pl: 3,
            opacity: section.disabled ? 0.5 : 1,
            pointerEvents: section.disabled ? "none" : "auto",
          }}
        >
          {section.type === "radio" ? (
            <RadioGroup
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              sx={{ display: "flex", gap: 0.5 }}
            >
              {section.items.map(item => (
                <FormControlLabel
                  key={item.id}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {item.starred && <StarIcon sx={{ fontSize: 14, color: "warning.main" }} />}
                      <Typography variant="body2">{item.label}</Typography>
                    </Box>
                  }
                  sx={{ mr: 0 }}
                />
              ))}
            </RadioGroup>
          ) : (
            <List disablePadding>
              {section.items.map(item => (
                <TreeMenuItem key={item.id} item={item} disabled={section.disabled} />
              ))}
            </List>
          )}
        </Box>
      )}
    </>
  );
}

// Floating TreeMenu
function TreeMenu({ open, onClose }) {
  const [selectedModel, setSelectedModel] = useState("xgboost");

  useEffect(() => {
    if (!open) return;
    const handleClick = e => {
      if (!e.target.closest(".tree-menu-float")) onClose();
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Paper
      className="tree-menu-float"
      elevation={4}
      sx={{
        position: "fixed",
        top: 80,
        right: 40,
        zIndex: 2000,
        width: 260,
        maxHeight: 360,
        overflowY: "auto",
        p: 1,
      }}
    >
      <Stack spacing={0.5}>
        {treeData.map(sec => (
          <TreeMenuSection
            key={sec.id}
            section={sec}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        ))}
      </Stack>
    </Paper>
  );
}

// Box-style custom legend
function CustomLegend({ activeKeys, onToggle }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
      {LEGEND_CONFIG.map(({ key, label, color }) => {
        const isActive = activeKeys.includes(key);
        return (
          <Box
            key={key}
            onClick={() => onToggle(key)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              opacity: isActive ? 1 : 0.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: color,
              padding: "4px 12px",
              userSelect: "none",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#222" }}>
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// Main ForecastChart component
export default function ForecastChart({ months, data }) {
  const [treeMenuOpen, setTreeMenuOpen] = useState(false);
  const chartRef = useRef();
  const [overlays, setOverlays] = useState({ holidays: true, promotions: true });
  const [hiddenSeries, setHiddenSeries] = useState({});

  const today = new Date();
  const currentIdx = months.indexOf(
    today.toLocaleString("default", { month: "short", year: "2-digit" })
  );

  const joinSeries = (hist, fc) => {
    const out = [...fc];
    for (let i = 0; i < out.length; i++) {
      if (out[i] != null && i > 0 && out[i - 1] == null) {
        out[i - 1] = hist[currentIdx];
        break;
      }
    }
    return out;
  };

  const seriesData = useMemo(() => {
    const get = label => months.map(m => {
      const v = data?.[m]?.[label];
      return v == null || v === "-" || v === "NULL" ? null : Number(v);
    });
    const baseFull = get("Baseline Forecast");
    const mlFull = get("ML Forecast");
    const consFull = get("Consensus");
    const actual = get("Actual");

    const baseHist = baseFull.map((v, i) => (i <= currentIdx ? v : null));
    const mlHist = mlFull.map((v, i) => (i <= currentIdx ? v : null));
    const consHist = consFull.map((v, i) => (i <= currentIdx ? v : null));

    const baseFc = baseFull.map((v, i) => (i > currentIdx ? v : null));
    const mlFc = mlFull.map((v, i) => (i > currentIdx ? v : null));
    const consFc = consFull.map((v, i) => (i > currentIdx ? v : null));

    return {
      actual,
      baseline: baseHist,
      baseline_forecast: joinSeries(baseHist, baseFc),
      ml: mlHist,
      ml_forecast: joinSeries(mlHist, mlFc),
      consensus: consHist,
      consensus_forecast: joinSeries(consHist, consFc),
    };
  }, [months, data, currentIdx]);

  const plotBands = useMemo(() => {
    const bands = [];
    if (overlays.holidays) {
      for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * months.length);
        bands.push({ id: `h${i}`, color: "rgba(82,196,26,0.1)", from: idx - 0.1, to: idx + 0.1 });
      }
    }
    if (overlays.promotions) {
      for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * months.length);
        bands.push({ id: `p${i}`, color: "rgba(250,173,20,0.1)", from: idx - 0.25, to: idx + 0.25 });
      }
    }
    return bands;
  }, [months, overlays]);

  const options = useMemo(() => ({
    chart: {
      backgroundColor: "#fafafa",
      style: { fontFamily: "Arial, sans-serif" },
      zoomType: "x",
    },
    title: { text: "" },
    xAxis: {
      categories: months,
      gridLineWidth: 1,
      gridLineColor: "#e0e0e0",
      labels: { style: { color: "#555" } },
      plotBands,
    },
    yAxis: {
      type: "linear",
      title: { text: "Units", style: { color: "#333" } },
      gridLineDashStyle: "ShortDash",
      gridLineColor: "#e0e0e0",
      labels: { style: { color: "#555" } },
      min: 1,
    },
    tooltip: {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderColor: "#999",
      borderRadius: 4,
      style: { color: "#333" },
      shared: true,
    },
    legend: { enabled: false },
    series: [
      { name: "Actual", data: seriesData.actual, color: "#ff4d4f", marker: { enabled: true, radius: 5 }, lineWidth: 2, visible: !hiddenSeries[0] },
      { name: "Baseline", data: seriesData.baseline, color: "#1890ff", marker: { enabled: true, radius: 5 }, lineWidth: 2, visible: !hiddenSeries[1] },
      { name: "ML", data: seriesData.ml, color: "#fadb14", marker: { enabled: true, radius: 5 }, lineWidth: 2, visible: !hiddenSeries[2] },
      { name: "Consensus", data: seriesData.consensus, color: "#52c41a", marker: { enabled: true, radius: 5 }, lineWidth: 2, visible: !hiddenSeries[3] },
      { name: "Baseline Forecast", data: seriesData.baseline_forecast, color: "rgba(24,144,255,0.6)", dashStyle: "Dash", lineWidth: 2, visible: !hiddenSeries[4] },
      { name: "ML Forecast", data: seriesData.ml_forecast, color: "rgba(250,173,20,0.6)", dashStyle: "Dash", lineWidth: 2, visible: !hiddenSeries[5] },
      { name: "Consensus Forecast", data: seriesData.consensus_forecast, color: "rgba(82,196,26,0.6)", dashStyle: "Dash", lineWidth: 2, visible: !hiddenSeries[6] },
      { name: "Holidays", data: [], color: "rgba(82,196,26,0.4)", enableMouseTracking: false, showInLegend: true, visible: overlays.holidays },
      { name: "Promotions", data: [], color: "rgba(250,173,20,0.4)", enableMouseTracking: false, showInLegend: true, visible: overlays.promotions },
    ],
    credits: { enabled: false },
  }), [months, seriesData, plotBands, hiddenSeries, overlays]);

  const handleLegendClick = item => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    if (item.isOverlay) {
      setOverlays(prev => {
        const next = { ...prev, [item.key]: !prev[item.key] };
        chart.series[item.key === "holidays" ? 8 : 9].setVisible(!prev[item.key], false);
        chart.redraw();
        return next;
      });
    } else {
      const s = chart.series[item.seriesIndex];
      if (s) {
        s.visible ? s.hide() : s.show();
        setHiddenSeries(prev => ({ ...prev, [item.seriesIndex]: !s.visible }));
      }
    }
  };

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    const newHidden = {};
    chart.series.forEach((s, i) => { newHidden[i] = !s.visible; });
    setHiddenSeries(newHidden);
  }, [chartRef, overlays]);

  // Compute MAPE
  const mape = useMemo(() => {
    const actual = seriesData.actual;
    const consensusNum = seriesData.consensus;
    let totalPctErr = 0, count = 0;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] && consensusNum[i]) {
        totalPctErr += Math.abs((actual[i] - consensusNum[i]) / actual[i]);
        count++;
      }
    }
    return count ? ((totalPctErr / count) * 100).toFixed(1) : "-";
  }, [seriesData]);

  // Determine active keys for custom legend
  const activeKeys = LEGEND_CONFIG
    .filter(item => {
      if (item.isOverlay) return overlays[item.key];
      else return !hiddenSeries[item.seriesIndex];
    })
    .map(item => item.key);

  // Handler for custom legend toggle
  const handleCustomLegendToggle = (key) => {
    const item = LEGEND_CONFIG.find(i => i.key === key);
    if (!item) return;
    handleLegendClick(item);
  };

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: "#fff", borderRadius: 1, boxShadow: 1, position: "relative" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Demand Forecast
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            MAPE: <Box component="span" sx={{ fontWeight: 700, color: "#22c55e" }}>{mape}%</Box>
          </Typography>
        </Typography>
        <Box>
          <IconButton size="small" onClick={() => setTreeMenuOpen(v => !v)}><GridViewIcon /></IconButton>
          <IconButton size="small"><ChatBubbleOutlineIcon /></IconButton>
          <IconButton size="small"><ShareIcon /></IconButton>
          <IconButton size="small"><SettingsIcon /></IconButton>
        </Box>
      </Box>

      {/* Custom box-style legend */}
      <CustomLegend
        activeKeys={activeKeys}
        onToggle={handleCustomLegendToggle}
      />

      {/* Chart */}
      <Box sx={{ height: 400 }}>
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </Box>

      {/* Tree menu */}
      <TreeMenu open={treeMenuOpen} onClose={() => setTreeMenuOpen(false)} />
    </Box>
  );
}
