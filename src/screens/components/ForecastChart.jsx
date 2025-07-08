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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GridViewIcon from "@mui/icons-material/GridView";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";

// const apiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- reusable styled checkbox ---------- */
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

/* ---------- legend config ---------- */
const LEGEND_CONFIG = [
  { key: "actual", label: "Actual", color: "#ff4d4f", seriesIndex: 0 },
  { key: "baseline", label: "Baseline", color: "#1890ff", seriesIndex: 1 },
  { key: "ml", label: "ML", color: "#fadb14", seriesIndex: 2 },
  { key: "consensus", label: "Consensus", color: "#52c41a", seriesIndex: 3 },
  {
    key: "baseline_forecast",
    label: "Baseline Forecast",
    color: "rgba(24,144,255,0.6)",
    dash: "Dash",
    seriesIndex: 4,
  },
  {
    key: "ml_forecast",
    label: "ML Forecast",
    color: "rgba(250,173,20,0.6)",
    dash: "Dash",
    seriesIndex: 5,
  },
  {
    key: "consensus_forecast",
    label: "Consensus Forecast",
    color: "rgba(82,196,26,0.6)",
    dash: "Dash",
    seriesIndex: 6,
  },
  { key: "holidays", label: "Holidays", color: "#BBF7D0", isOverlay: true },
  { key: "promotions", label: "Promotions", color: "#FED7AA", isOverlay: true },
];

/* ---------- helper: plot bands from events ---------- */
function createPlotBands(events, months, overlays) {
  return events.reduce((acc, ev) => {
    const sIdx = months.indexOf(
      new Date(ev.start_date).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      })
    );
    const eIdx = months.indexOf(
      new Date(ev.end_date).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      })
    );
    if (sIdx === -1) return acc;
    const isHoliday = ev.event_type === "Holiday";
    const show = isHoliday ? overlays.holidays : overlays.promotions;
    if (!show) return acc;
    acc.push({
      id: `${ev.event_type.toLowerCase()}_${ev.event_id}`,
      from: sIdx - 0.25,
      to: (eIdx === -1 ? sIdx : eIdx) + 0.25,
      // color: isHoliday ? "rgba(82,196,26,0.1)" : "rgba(250,173,20,0.1)",
      color: isHoliday ? "#BBF7D0" : "#FED7AA",
    });
    return acc;
  }, []);
}

/* ---------- tree-menu items ---------- */
function TreeMenuItem({ item, disabled }) {
  return (
    <ListItem
      sx={{
        px: 2,
        py: 0.25,
        borderRadius: 1,
        "&:hover": disabled ? {} : { bgcolor: "rgba(0,0,0,0.04)" },
        minHeight: 28,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <BlueCheckbox checked={item.checked} disabled />
      </ListItemIcon>
      {item.starred && (
        <StarIcon sx={{ fontSize: 14, color: "warning.main", mr: 0.5 }} />
      )}
      <ListItemText
        primary={
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
        }
      />
    </ListItem>
  );
}

/* ---------- tree-menu section ---------- */
function TreeMenuSection({ section, modelName, setModelName }) {
  const [expanded, setExpanded] = useState(section.id === 1);
  const toggle = () => !section.disabled && setExpanded((v) => !v);

  return (
    <>
      <Box
        onClick={toggle}
        sx={{
          px: 1,
          py: 1,
          mb: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderRadius: 1,
          bgcolor: section.disabled ? "grey.100" : "primary.lighter",
          cursor: section.disabled ? "not-allowed" : "pointer",
          opacity: section.disabled ? 0.6 : 1,
        }}
      >
        {section.id === 1 && section.disabled && (
          <CircularProgress size={16} sx={{ mr: 1 }} />
        )}
        <ExpandMoreIcon
          sx={{
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s",
            color: section.disabled ? "grey.500" : "primary.main",
          }}
        />
        <DescriptionOutlined
          sx={{ color: section.disabled ? "grey.500" : "primary.main" }}
        />
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{
            flexGrow: 1,
            color: section.disabled ? "grey.600" : "primary.main",
          }}
        >
          {section.title}
          {section.id === 1 && section.disabled && " (Loading…)"}
        </Typography>
      </Box>

      {expanded && (
        <Box
          sx={{
            pl: 3,
            pointerEvents: section.disabled ? "none" : "auto",
            opacity: section.disabled ? 0.5 : 1,
          }}
        >
          {section.type === "radio" ? (
            <RadioGroup
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              sx={{ display: "flex", gap: 0.5 }}
            >
              {section.items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No models available
                </Typography>
              ) : (
                section.items.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.value}
                    control={<Radio size="small" />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {item.starred && (
                          <StarIcon
                            sx={{ fontSize: 14, color: "warning.main" }}
                          />
                        )}
                        <Typography variant="body2">{item.label}</Typography>
                      </Box>
                    }
                    sx={{ mr: 0 }}
                  />
                ))
              )}
            </RadioGroup>
          ) : (
            <List disablePadding>
              {section.items.map((item) => (
                <TreeMenuItem
                  key={item.id}
                  item={item}
                  disabled={section.disabled}
                />
              ))}
            </List>
          )}
        </Box>
      )}
    </>
  );
}

/* ---------- floating tree-menu with dynamic positioning ---------- */
function TreeMenu({
  open,
  onClose,
  modelName,
  setModelName,
  treeData,
  anchorEl,
}) {
  const [menuPosition, setMenuPosition] = useState({ top: 80, right: 40 });

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const parentRect = anchorEl.offsetParent?.getBoundingClientRect();
      const menuWidth = 260;
      const menuHeight = 360;

      if (!parentRect) return;

      let top = rect.bottom - parentRect.top + 8;
      let left = rect.left - parentRect.left;

      if (top + menuHeight > parentRect.height) {
        top = rect.top - parentRect.top - menuHeight - 8;
      }

      if (left + menuWidth > parentRect.width) {
        left = parentRect.width - menuWidth - 16;
      }

      if (left < 16) {
        left = 16;
      }

      setMenuPosition({ top, left });
    }
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => !e.target.closest(".tree-menu-float") && onClose();
    window.addEventListener("mousedown", handle);
    return () => window.removeEventListener("mousedown", handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Paper
      className="tree-menu-float"
      elevation={4}
      sx={{
        position: "absolute",
        top: menuPosition.top,
        left: menuPosition.left,
        width: 260,
        maxHeight: 360,
        overflowY: "auto",
        p: 1,
        zIndex: 2000,
      }}
    >
      <Stack spacing={0.5}>
        {treeData.map((sec) => (
          <TreeMenuSection
            key={sec.id}
            section={sec}
            modelName={modelName}
            setModelName={setModelName}
          />
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- custom legend ---------- */
function CustomLegend({ activeKeys, onToggle }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
      {LEGEND_CONFIG.map(({ key, label, color }) => (
        <Box
          key={key}
          onClick={() => onToggle(key)}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: activeKeys.includes(key) ? 1 : 0.5,
            borderRadius: 1,
            border: "1px solid",
            borderColor: color,
            px: 1,
            userSelect: "none",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: color,
              borderRadius: 1,
              mr: 1,
            }}
          />
          <Typography variant="body2" fontWeight={500}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function ForecastChart({
  months,
  data,
  modelName,
  setModelName,
  models,
  loadingModels,
  avgMapeData,
}) {
  const [treeMenuOpen, setTreeMenuOpen] = useState(false);
  const chartRef = useRef();
  const gridIconRef = useRef(); // ✅ NEW: Reference to grid icon button
  const [overlays, setOverlays] = useState({
    holidays: true,
    promotions: true,
  });
  const [hiddenSeries, setHiddenSeries] = useState({});
  const [events, setEvents] = useState([]);

  /* ---------- dynamic tree-data (now INSIDE component) ---------- */
  const treeData = useMemo(
    () => [
      {
        id: 1,
        title: "Model",
        disabled: loadingModels,
        type: "radio",
        items: models.map((m) => ({
          id: m.model_id,
          label: m.model_name,
          value: m.model_name,
          starred: m.model_name === "XGBoost",
        })),
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
    ],
    [models, loadingModels]
  );

  /* ---------- fetch events once ---------- */
  useEffect(() => {
    fetch(`http://localhost:5000/api/events`)
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  /* ---------- split hist/forecast for stepped joins ---------- */
  const todayIdx = months.indexOf(
    new Date().toLocaleString("default", { month: "short", year: "2-digit" })
  );
  const join = (hist, fc) => {
    const out = [...fc];
    for (let i = 1; i < out.length; i++) {
      if (out[i] != null && out[i - 1] == null) {
        out[i - 1] = hist[todayIdx];
        break;
      }
    }
    return out;
  };

  /* ---------- series data ---------- */
  const seriesData = useMemo(() => {
    const get = (row) =>
      months.map((m) => {
        const v = data?.[m]?.[row];
        return v == null || v === "-" ? null : +v;
      });

    const baseFull = get("Baseline Forecast");
    const mlFull = get("ML Forecast");
    const consFull = get("Consensus");
    const actual = get("Actual");

    const histCut = (arr) => arr.map((v, i) => (i <= todayIdx ? v : null));
    const fcCut = (arr) => arr.map((v, i) => (i > todayIdx ? v : null));

    return {
      actual,
      baseline: histCut(baseFull),
      baseline_forecast: join(histCut(baseFull), fcCut(baseFull)),
      ml: histCut(mlFull),
      ml_forecast: join(histCut(mlFull), fcCut(mlFull)),
      consensus: histCut(consFull),
      consensus_forecast: join(histCut(consFull), fcCut(consFull)),
    };
  }, [months, data, todayIdx]);

  /* ---------- highcharts options ---------- */
  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "#fafafa",
        style: { fontFamily: "Inter" },
        zoomType: "x",
      },
      title: { text: "" },
      xAxis: {
        categories: months,
        gridLineWidth: 1,
        gridLineColor: "#e0e0e0",
        labels: { style: { color: "#555" } },
        plotBands: createPlotBands(events, months, overlays),
      },
      yAxis: {
        title: { text: "Units" },
        gridLineDashStyle: "ShortDash",
        gridLineColor: "#e0e0e0",
        min: 1,
      },
      tooltip: { shared: true },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [
        {
          name: "Actual",
          data: seriesData.actual,
          color: "#ff4d4f",
          visible: !hiddenSeries[0],
          marker: { enabled: false },
        },
        {
          name: "Baseline",
          data: seriesData.baseline,
          color: "#1890ff",
          visible: !hiddenSeries[1],
          marker: { enabled: false },
        },
        {
          name: "ML",
          data: seriesData.ml,
          color: "#fadb14",
          visible: !hiddenSeries[2],
          marker: { enabled: false },
        },
        {
          name: "Consensus",
          data: seriesData.consensus,
          color: "#52c41a",
          visible: !hiddenSeries[3],
          marker: { enabled: false },
        },
        {
          name: "Baseline Forecast",
          data: seriesData.baseline_forecast,
          color: "rgba(24,144,255,0.6)",
          dashStyle: "Dash",
          visible: !hiddenSeries[4],
          marker: { enabled: false },
        },
        {
          name: "ML Forecast",
          data: seriesData.ml_forecast,
          color: "rgba(250,173,20,0.6)",
          dashStyle: "Dash",
          visible: !hiddenSeries[5],
          marker: { enabled: false },
        },
        {
          name: "Consensus Forecast",
          data: seriesData.consensus_forecast,
          color: "rgba(82,196,26,0.6)",
          dashStyle: "Dash",
          visible: !hiddenSeries[6],
          marker: { enabled: false },
        },
        {
          name: "Holidays",
          data: [],
          color: "#BBF7D0",
          showInLegend: true,
          enableMouseTracking: false,
          visible: overlays.holidays,
          marker: { enabled: false },
        },
        {
          name: "Promotions",
          data: [],
          color: "#FED7AA",
          showInLegend: true,
          enableMouseTracking: false,
          visible: overlays.promotions,
          marker: { enabled: false },
        },
      ],
    }),
    [months, seriesData, events, overlays, hiddenSeries]
  );

  /* ---------- legend click handler ---------- */
  const handleLegendClick = (item) => {
    const chart = chartRef.current?.chart;
    if (!chart) return;

    if (item.isOverlay) {
      setOverlays((prev) => {
        const vis = !prev[item.key];
        chart.series[item.key === "holidays" ? 7 : 8].setVisible(vis, false);
        chart.redraw();
        return { ...prev, [item.key]: vis };
      });
    } else {
      const s = chart.series[item.seriesIndex];
      s.visible ? s.hide() : s.show();
      setHiddenSeries((prev) => ({ ...prev, [item.seriesIndex]: !s.visible }));
    }
  };

  /* ---------- sync hidden series state on first render ---------- */
  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    const init = {};
    chart.series.forEach((s, i) => (init[i] = !s.visible));
    setHiddenSeries(init);
  }, []);

  /* ---------- mape ---------- */

  const mape = avgMapeData ? Number(avgMapeData).toFixed(1) : "-";

  /* ---------- active legend keys ---------- */
  const activeKeys = LEGEND_CONFIG.filter((it) =>
    it.isOverlay ? overlays[it.key] : !hiddenSeries[it.seriesIndex]
  ).map((it) => it.key);

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        bgcolor: "#fff",
        borderRadius: 1,
        boxShadow: 1,
        position: "relative",
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" fontWeight={700}>
            Demand Forecast
          </Typography>
          <Typography variant="body2" fontWeight={700} color="#555">
            MAPE:&nbsp;
            <Box component="span" sx={{ color: "#22c55e" }}>
              {mape}
            </Box>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
          <IconButton
            ref={gridIconRef}
            size="small"
            onClick={() => setTreeMenuOpen((v) => !v)}
          >
            <GridViewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* legend */}
      <CustomLegend
        activeKeys={activeKeys}
        onToggle={(k) =>
          handleLegendClick(LEGEND_CONFIG.find((i) => i.key === k))
        }
      />

      {/* chart */}
      <Box sx={{ height: 400 }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </Box>

      {/* floating tree-menu */}
      <TreeMenu
        open={treeMenuOpen}
        onClose={() => setTreeMenuOpen(false)}
        modelName={modelName}
        setModelName={setModelName}
        treeData={treeData}
        anchorEl={gridIconRef.current}
      />
    </Box>
  );
}
