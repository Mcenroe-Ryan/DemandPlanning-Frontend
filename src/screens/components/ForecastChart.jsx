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

const API_BASE_URL = import.meta.env.VITE_API_URL;



/* ---------- MAPE color coding function ---------- */
const getMapeColor = (mapeValue) => {
  const value = Number(mapeValue);

  if (isNaN(value)) return "#6B7280"; // Gray for invalid/no data

  if (value >= 0 && value <= 20) {
    return "#22C55E"; // Green - Good
  } else if (value > 20 && value <= 40) {
    return "#F97316"; // Orange - Reasonable/Acceptable
  } else if (value > 40) {
    return "#EF4444"; // Red - Poor
  } else {
    return "#6B7280"; // Gray for edge cases
  }
};

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
  { key: "actual", label: "Actual", color: "#EF4444", seriesIndex: 0 },
  { key: "baseline", label: "Baseline", color: "#60A5FA", seriesIndex: 1 },
  { key: "ml", label: "ML", color: "#EAB308", seriesIndex: 2 },
  { key: "consensus", label: "Consensus", color: "#0E7490", seriesIndex: 3 },
  {
    key: "baseline_forecast",
    label: "Baseline Forecast",
    color: "#60A5FA",
    dash: "Dash",
    seriesIndex: 4,
  },
  {
    key: "ml_forecast",
    label: "ML Forecast",
    color: "#EAB308",
    dash: "Dash",
    seriesIndex: 5,
  },
  {
    key: "consensus_forecast",
    label: "Consensus Forecast",
    color: "#0E7490",
    dash: "Dash",
    seriesIndex: 6,
  },
  { key: "holidays", label: "Holidays", color: "#DCFCE7", isOverlay: true },
  { key: "promotions", label: "Promotions", color: "#FFEDD5", isOverlay: true },
];

/* ---------- ENHANCED helper: plot bands from events with proper date handling ---------- */
function createPlotBands(events, months, overlays) {
  return events.reduce((acc, ev) => {
    const startDate = new Date(ev.start_date);
    const endDate = new Date(ev.end_date);
    
    // Find which months the event spans
    const startMonthLabel = startDate.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    const endMonthLabel = endDate.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    
    const sIdx = months.indexOf(startMonthLabel);
    const eIdx = months.indexOf(endMonthLabel);
    
    if (sIdx === -1) return acc;
    
    const isHoliday = ev.event_type === "Holiday";
    const show = isHoliday ? overlays.holidays : overlays.promotions;
    if (!show) return acc;
    
    // Calculate precise positioning within months
    const calculateMonthPosition = (date, monthIndex) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Position within the month (0 = start, 1 = end)
      const positionInMonth = (day - 1) / daysInMonth;
      
      // Convert to chart coordinates (-0.5 to +0.5 for each month)
      return monthIndex + positionInMonth - 0.5;
    };
    
    let fromPos, toPos;
    
    if (sIdx === eIdx || eIdx === -1) {
      // Event within same month or end month not visible
      fromPos = calculateMonthPosition(startDate, sIdx);
      toPos = eIdx === -1 ? sIdx + 0.5 : calculateMonthPosition(endDate, sIdx);
    } else {
      // Event spans multiple months
      fromPos = calculateMonthPosition(startDate, sIdx);
      toPos = calculateMonthPosition(endDate, eIdx);
    }
    
    // Ensure minimum width for very short events
    const minWidth = 0.05;
    if (toPos - fromPos < minWidth) {
      const center = (fromPos + toPos) / 2;
      fromPos = center - minWidth / 2;
      toPos = center + minWidth / 2;
    }
    
    acc.push({
      id: `${ev.event_type.toLowerCase()}_${ev.event_id}`,
      from: fromPos,
      to: toPos,
      color: isHoliday ? "#BBF7D0" : "#FED7AA",
    });
    
    return acc;
  }, []);
}

function createEventPoints(events, months, overlays) {
  const holidayData = [];
  const promoData = [];

  events.forEach((ev) => {
    const idx = months.indexOf(
      new Date(ev.start_date).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      })
    );

    if (idx === -1) return;

    const isHoliday = ev.event_type === "Holiday";
    const show = isHoliday ? overlays.holidays : overlays.promotions;
    if (!show) return;

    const point = {
      x: idx,
      y: 1.1,
      custom: {
        name: ev.event_name,
        type: ev.event_type,
        country: ev.country_name,
        date: new Date(ev.start_date).toDateString(),
      },
    };

    if (isHoliday) holidayData.push(point);
    else promoData.push(point);
  });

  return { holidayData, promoData };
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
            borderColor: "#CBD5E1",
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
  const gridIconRef = useRef();
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
    fetch(`${API_BASE_URL}/events`)
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  /* ---------- split hist/forecast for stepped joins ---------- */
  const todayIdx = months.indexOf(
    new Date().toLocaleString("default", { month: "short", year: "2-digit" })
  );

  /* ---------- helper: Only first future value after todayIdx is shown, rest are null ---------- */
  function onlyFirstFutureValue(arr, todayIdx) {
    let found = false;
    return arr.map((v, i) => {
      if (i > todayIdx && v != null && !found) {
        found = true;
        return v;
      }
      return null;
    });
  }

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

  /* ---------- series data (Consensus joined to first forecast) ---------- */
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
      // join last hist Consensus with first future Consensus-Forecast
      consensus_forecast: join(
        histCut(consFull),
        onlyFirstFutureValue(consFull, todayIdx)
      ),
    };
  }, [months, data, todayIdx]);

  const { holidayData, promoData } = createEventPoints(
    events,
    months,
    overlays
  );

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
        labels: {
          rotation: 0,
          style: {
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0.4px",
            color: "#64748B",
          },
          overflow: "justify",
          crop: false,
        },
        plotBands: createPlotBands(events, months, overlays),
      },

      yAxis: {
        title: {
          text: "Units (in thousands)",
          style: {
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "12px",
            color: "#64748B",
            letterSpacing: "0.4px",
            lineHeight: "100%",
          },
        },
        labels: {
          align: "center",
          style: {
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0.4px",
            color: "#64748B",
          },
          formatter: function () {
            if (this.value === 0) return "0";
            return this.value / 1000;
          },
        },
        gridLineDashStyle: "ShortDash",
        gridLineColor: "#e0e0e0",
        min: null,
      },

      tooltip: { shared: true },
      legend: { enabled: false },
      credits: { enabled: false },

      series: [
        {
          name: "Actual",
          data: seriesData.actual,
          color: "#EF4444",
          visible: !hiddenSeries[0],
          marker: { enabled: false },
        },
        {
          name: "Baseline",
          data: seriesData.baseline,
          color: "#60A5FA",
          visible: !hiddenSeries[1],
          marker: { enabled: false },
        },
        {
          name: "ML",
          data: seriesData.ml,
          color: "#EAB308",
          visible: !hiddenSeries[2],
          marker: { enabled: false },
        },
        {
          name: "Consensus",
          data: seriesData.consensus,
          color: "#0E7490",
          visible: !hiddenSeries[3],
          marker: { enabled: false },
        },
        {
          name: "Baseline Forecast",
          data: seriesData.baseline_forecast,
          color: "#60A5FA",
          dashStyle: "Dash",
          visible: !hiddenSeries[4],
          marker: { enabled: false },
        },
        {
          name: "ML Forecast",
          data: seriesData.ml_forecast,
          color: "#EAB308",
          dashStyle: "Dash",
          visible: !hiddenSeries[5],
          marker: { enabled: false },
        },
        {
          name: "Consensus Forecast",
          data: seriesData.consensus_forecast,
          color: "#0E7490",
          dashStyle: "Dash",
          visible: !hiddenSeries[6],
          marker: { enabled: false },
        },
        {
          name: "Holidays",
          type: "scatter",
          data: holidayData,
          visible: overlays.holidays,
          showInLegend: false,
          marker: { enabled: false, radius: 0.1 },
          tooltip: {
            pointFormatter: function () {
              return `<b>Holiday:</b> ${this.custom.name}<br/>
                <b>Date:</b> ${this.custom.date}<br/>
                <b>Country:</b> ${this.custom.country}`;
            },
          },
        },
        {
          name: "Promotions",
          type: "scatter",
          data: promoData,
          visible: overlays.promotions,
          showInLegend: false,
          marker: { enabled: false, radius: 0.1 },
          tooltip: {
            pointFormatter: function () {
              return `<b>Promotion:</b> ${this.custom.name}<br/>
                <b>Date:</b> ${this.custom.date}<br/>
                <b>Country:</b> ${this.custom.country}`;
            },
          },
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

  /* ---------- SIMPLIFIED: mape with color coding only ---------- */
  const mape = avgMapeData ? Number(avgMapeData).toFixed(1) : "-";
  const mapeColor = getMapeColor(mape);

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
            <Box component="span" sx={{ color: mapeColor, fontWeight: 700 }}>
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
