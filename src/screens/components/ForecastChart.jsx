import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// --- Highcharts modules (init safely across ESM/CJS) ---
import exportingInit from "highcharts/modules/exporting";
import exportDataInit from "highcharts/modules/export-data";
import offlineExportingInit from "highcharts/modules/offline-exporting";

// initialize modules (handles both function export and { default } export)
const initHCModule = (mod) => {
  if (!mod) return;
  if (typeof mod === "function") mod(Highcharts);
  else if (mod.default && typeof mod.default === "function")
    mod.default(Highcharts);
};
initHCModule(exportingInit);
initHCModule(exportDataInit);
initHCModule(offlineExportingInit);

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
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- Utility: colour-code MAPE ---------- */
const getMapeColor = (mapeValue) => {
  const v = Number(mapeValue);
  if (isNaN(v)) return "#6B7280";
  if (v <= 20) return "#22C55E";
  if (v <= 40) return "#F97316";
  return "#EF4444";
};

/* ---------- Re-usable typography tokens ---------- */
const AXIS_LABEL_STYLE = {
  fontFamily: "Poppins",
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "100%",
  letterSpacing: 0.4,
  color: "#64748B",
};
const AXIS_TITLE_STYLE = { ...AXIS_LABEL_STYLE };

/* ---------- Custom blue checkbox visuals ---------- */
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
const BlueCheckbox = (props) => (
  <Checkbox
    disableRipple
    color="default"
    checkedIcon={<BlueChecked />}
    icon={<BlueSquare />}
    sx={{ p: 0.5, "&:hover": { bgcolor: "transparent" } }}
    {...props}
  />
);

/* ---------- Legend meta data ---------- */
const LEGEND_CONFIG = [
  { key: "actual", label: "Actual", color: "#4338CA", seriesIndex: 0 },
  { key: "baseline", label: "Baseline", color: "#60A5FA", seriesIndex: 1 },
  { key: "ml", label: "ML", color: "#A16207", seriesIndex: 2 },
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
    color: "#A16207",
    dash: "Dash",
    seriesIndex: 5,
  },
  {
    key: "consensus_forecast",
    label: "Consensus Plan",
    color: "#0E7490",
    dash: "Dash",
    seriesIndex: 6,
  },
  { key: "holidays", label: "Holidays", color: "#DCFCE7", isOverlay: true },
  { key: "promotions", label: "Promotions", color: "#FFEDD5", isOverlay: true },
];

/* ---------- Menu item for disabled tree sections ---------- */
const TreeMenuItem = ({ item, disabled }) => (
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

/* ---------- Collapsible radio / checkbox sections ---------- */
function TreeMenuSection({ section, modelName, setModelName }) {
  const [open, setOpen] = useState(section.id === 1);
  const toggle = () => !section.disabled && setOpen((v) => !v);

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
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
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

      {open && (
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

/* ---------- Floating tree-menu wrapper ---------- */
function TreeMenu({
  open,
  onClose,
  modelName,
  setModelName,
  treeData,
  anchorEl,
}) {
  const [pos, setPos] = useState({ top: 80, left: 40 });

  useEffect(() => {
    if (!open || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const parent = anchorEl.offsetParent?.getBoundingClientRect();
    const width = 260;
    const height = 360;
    if (!parent) return;

    let top = rect.bottom - parent.top + 8;
    let left = rect.left - parent.left;
    if (top + height > parent.height) top = rect.top - parent.top - height - 8;
    if (left + width > parent.width) left = parent.width - width - 16;
    if (left < 16) left = 16;
    setPos({ top, left });
  }, [open, anchorEl]);

  /* outside-click close */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => !e.target.closest(".tree-menu-float") && onClose();
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Paper
      className="tree-menu-float"
      elevation={4}
      sx={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
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

const CustomLegend = ({
  activeKeys,
  onToggle,
  showForecast,
  disableForecastLegend,
}) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
    {LEGEND_CONFIG.filter(({ key }) => {
      if (!showForecast) {
        return ![
          "baseline_forecast",
          "ml_forecast",
          "consensus_forecast",
        ].includes(key);
      }
      return true;
    }).map(({ key, label, color }) => {
      const isForecast = [
        "baseline_forecast",
        "ml_forecast",
        "consensus_forecast",
      ].includes(key);

      const disabled = isForecast && disableForecastLegend;

      return (
        <Box
          key={key}
          onClick={(e) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            onToggle(key);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 25,
            minWidth: 60,
            px: 1.1,
            py: 0.3,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.4 : activeKeys.includes(key) ? 1 : 0.5,
            borderRadius: 1.2,
            border: "1px solid",
            borderColor: "#CBD5E1",
            userSelect: "none",
            pointerEvents: disabled ? "none" : "auto",
            "&:hover": { opacity: disabled ? 0.4 : 0.8 },
          }}
          aria-disabled={disabled}
          title={disabled ? "No forecast data available" : undefined}
        >
          {isForecast ? (
            <Box
              sx={{
                width: 16,
                height: 12,
                mr: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "2px",
                  background: `repeating-linear-gradient(
                    to right,
                    ${color} 0px,
                    ${color} 4px,
                    transparent 4px,
                    transparent 6px
                  )`,
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: color,
                borderRadius: 1,
                mr: 1,
              }}
            />
          )}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0.1px",
              color: "#475569",
            }}
          >
            {label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

export default function ForecastChart({
  months,
  data,
  modelName,
  setModelName,
  models,
  loadingModels,
  avgMapeData,
  countryName,
  showForecast,
  setErrorSnackbar,
}) {
  const chartRef = useRef();
  const gridIconRef = useRef();
  const [treeOpen, setTreeOpen] = useState(false);
  const [overlays, setOverlays] = useState({
    holidays: false,
    promotions: false,
  });
  const [hiddenSeries, setHiddenSeries] = useState({});
  const [events, setEvents] = useState([]);

  const treeData = useMemo(() => {
    const sorted = [...models].sort((a, b) => {
      if (a.model_name === "XGBoost") return -1;
      if (b.model_name === "XGBoost") return 1;
      return a.model_name.localeCompare(b.model_name);
    });
    return [
      {
        id: 1,
        title: "Model",
        disabled: loadingModels,
        type: "radio",
        items: sorted.map((m) => ({
          id: m.model_id,
          label: m.model_name,
          value: m.model_name,
          starred: m.model_name === "XGBoost",
        })),
      },
      // (future sections hidden)
      // {
      //   id: 2,
      //   title: "External Factors",
      //   disabled: true,
      //   type: "checkbox",
      //   items: [
      //     { id: 21, label: "All", checked: false },
      //     { id: 22, label: "CPI", checked: true, starred: true },
      //     { id: 23, label: "Interest Rate", checked: false },
      //     { id: 24, label: "GDP", checked: true, starred: true },
      //     { id: 25, label: "Unemployment Rate", checked: true, starred: true },
      //     { id: 26, label: "Average Disposable Income", checked: false },
      //   ],
      // },
      // {
      //   id: 3,
      //   title: "Events",
      //   disabled: true,
      //   type: "checkbox",
      //   items: [
      //     { id: 31, label: "All", checked: true, starred: true },
      //     { id: 32, label: "Holidays", checked: true },
      //     { id: 33, label: "Marketing & Promotion", checked: true },
      //   ],
      // },
    ];
  }, [models, loadingModels]);

  // resilient /events fetch
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchEvents = async () => {
      const url = `${API_BASE_URL}/events?_=${Date.now()}`;
      const opts = {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "application/json" },
      };

      const withTimeout = (p, ms = 8000) =>
        Promise.race([
          p,
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error("timeout")), ms)
          ),
        ]);

      const tryOnce = async () => {
        const res = await withTimeout(fetch(url, opts));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!text) return [];
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          try {
            return JSON.parse(text);
          } catch {
            throw new Error("non-json body");
          }
        }
        return JSON.parse(text);
      };

      const load = async () => {
        try {
          let data = await tryOnce();
          if (!Array.isArray(data)) data = [];
          if (alive) setEvents(data);
        } catch {
          try {
            await new Promise((r) => setTimeout(r, 500));
            let data = await tryOnce();
            if (!Array.isArray(data)) data = [];
            if (alive) setEvents(data);
          } catch {
            if (alive) setEvents([]);
          }
        }
      };

      load();
    };

    fetchEvents();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (!events.length) return [];
    if (!countryName) return events;
    const countries = Array.isArray(countryName) ? countryName : [countryName];
    return events.filter(
      (ev) =>
        ev.country_name &&
        countries.some((c) =>
          ev.country_name.toLowerCase().includes(c.toLowerCase())
        )
    );
  }, [events, countryName]);

  const createPlotBands = useCallback(
    (evts, monthsArr, overlayState) =>
      evts.reduce((acc, ev) => {
        const s = new Date(ev.start_date);
        const e = new Date(ev.end_date);
        const sm = s.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        const em = e.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        const sIdx = monthsArr.indexOf(sm);
        const eIdx = monthsArr.indexOf(em);

        if (sIdx === -1) return acc;
        const holiday = ev.event_type === "Holiday";
        if (holiday ? !overlayState.holidays : !overlayState.promotions)
          return acc;

        const dayFrac = (date) => {
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();
          const max = new Date(year, month + 1, 0).getDate();
          return (day - 1) / max;
        };
        const minWidth = 0.05;
        const fromPos = sIdx + dayFrac(s) - 0.5;
        const toPos =
          eIdx === -1
            ? sIdx + 0.5
            : eIdx === sIdx
            ? sIdx + dayFrac(e) - 0.5
            : eIdx + dayFrac(e) - 0.5;
        const wid = Math.max(toPos - fromPos, minWidth);

        acc.push({
          id: `${ev.event_type.toLowerCase()}_${ev.event_id}`,
          from: fromPos,
          to: fromPos + wid,
          color: holiday ? "#DCFCE7" : "#FFEDD5",
          events: {
            mouseover: function (mouseEvt) {
              const ch = chartRef.current?.chart;
              if (!ch) return;
              if (ch.customTooltip) ch.customTooltip.destroy();

              const names = [];
              if (Array.isArray(countryName)) names.push(...countryName);
              else if (typeof countryName === "string") names.push(countryName);
              if (ev.country_name) names.push(ev.country_name);
              const all = names.map((t) => t.toLowerCase());

              const matchAny = (text, keys) =>
                keys.some((k) => text.includes(k));
              const isUSA = all.some((t) =>
                matchAny(t, [
                  "usa",
                  "u.s.",
                  "united states",
                  "united states of america",
                  "us",
                ])
              );
              const isIndia = all.some((t) => matchAny(t, ["india", "bharat"]));

              const formatDate = (date) => {
                if (isUSA && isIndia) {
                  return date.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  });
                } else if (isUSA) {
                  return date.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  });
                } else if (isIndia) {
                  return date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                }
                return date.toLocaleDateString();
              };

              const s = new Date(ev.start_date);
              const e = new Date(ev.end_date);

              const tip = `
      <div style="padding:8px;font-size:12px;font-family:Inter">
        <b>${ev.event_type}:</b> ${ev.event_name}<br/>
        <b>Start:</b> ${formatDate(s)}<br/>
        <b>End&nbsp;&nbsp;:</b> ${formatDate(e)}<br/>
        <b>Country:</b> ${ev.country_name || "N/A"}
      </div>`;

              const rect = ch.container.getBoundingClientRect();
              const x = (mouseEvt.pageX || mouseEvt.clientX) - rect.left + 10;
              const y = (mouseEvt.pageY || mouseEvt.clientY) - rect.top - 100;

              ch.customTooltip = ch.renderer
                .label(tip, x, y, "round", null, null, true)
                .attr({
                  fill: "rgba(255,255,255,0.95)",
                  stroke: "rgba(51,51,51,0.3)",
                  "stroke-width": 1,
                  r: 3,
                  padding: 8,
                  zIndex: 999,
                })
                .css({
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.24)",
                })
                .add();
            },
            mouseout: function () {
              const ch = chartRef.current?.chart;
              if (ch?.customTooltip) {
                ch.customTooltip.destroy();
                ch.customTooltip = null;
              }
            },
          },
        });
        return acc;
      }, []),
    []
  );

  /* ---------- SAFE split index (prevents -1 issues) ---------- */
  const todayLabel = new Date().toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });
  const rawTodayIdx = months.indexOf(todayLabel);
  const safeTodayIdx =
    rawTodayIdx === -1 ? (months.length ? months.length - 1 : -1) : rawTodayIdx;

  /* ---------- Series helpers using safeTodayIdx ---------- */
  const seriesData = useMemo(() => {
    if (!months || !months.length) {
      return {
        actual: [],
        baseline: [],
        baseline_forecast: [],
        ml: [],
        ml_forecast: [],
        consensus: [],
        consensus_forecast: [],
      };
    }

    const getRow = (row) =>
      months.map((m) => {
        const v = data?.[m]?.[row];
        return v == null || v === "-" ? null : +v;
      });

    const baselineFull = getRow("Baseline Forecast");
    const mlFull = getRow("ML Forecast");
    const consFull = getRow("Consensus");
    const actual = getRow("Actual");

    const hist = (arr) => arr.map((v, i) => (i <= safeTodayIdx ? v : null));
    const fut = (arr) => arr.map((v, i) => (i > safeTodayIdx ? v : null));

    // const join = (histArr, futArr) => {
    //   const out = [...futArr];
    //   for (let i = 1; i < out.length; i++) {
    //     if (out[i] != null && out[i - 1] == null) {
    //       const bridgeIdx = Math.min(
    //         Math.max(safeTodayIdx, 0),
    //         histArr.length - 1
    //       );
    //       const bridgeVal = bridgeIdx >= 0 ? histArr[bridgeIdx] : null;
    //       out[i - 1] = bridgeVal;
    //       break;
    //     }
    //   }
    //   return out;
    // };
    const join = (histArr, futArr) => {
      const out = [...futArr];

      // find the bridge position (first future point whose previous slot is empty)
      let bridgePos = -1;
      for (let i = 1; i < out.length; i++) {
        if (out[i] != null && out[i - 1] == null) {
          bridgePos = i - 1;
          break;
        }
      }

      if (bridgePos >= 0) {
        // put the last historical value into the FORECAST series at the bridge
        out[bridgePos] = histArr?.[bridgePos] ?? null;

        // hide the historical point at the bridge so only forecast shows there
        if (Array.isArray(histArr)) histArr[bridgePos] = null;
      }

      return out;
    };

    const firstFutureOnly = (arr) => {
      let found = false;
      return arr.map((v, i) => {
        if (i > safeTodayIdx && v != null && !found) {
          found = true;
          return v;
        }
        return null;
      });
    };

    return {
      actual,
      baseline: hist(baselineFull),
      baseline_forecast: join(hist(baselineFull), fut(baselineFull)),
      ml: hist(mlFull),
      ml_forecast: join(hist(mlFull), fut(mlFull)),
      consensus: hist(consFull),
      consensus_forecast: join(hist(consFull), firstFutureOnly(consFull)),
    };
  }, [months, data, safeTodayIdx]);

  // -------- Detect if any forecast data exists (to disable legend chips) --------
  const hasBaselineFc = (seriesData.baseline_forecast || []).some(
    (v) => v != null
  );
  const hasMlFc = (seriesData.ml_forecast || []).some((v) => v != null);
  const hasConsFc = (seriesData.consensus_forecast || []).some(
    (v) => v != null
  );
  const hasAnyForecastData = hasBaselineFc || hasMlFc || hasConsFc;

  /* ----------------------- PDF download handler ----------------------- */
  const handleDownloadPdf = useCallback(() => {
    const ch = chartRef.current?.chart;
    if (!ch) {
      setErrorSnackbar?.({
        open: true,
        message: "Chart not ready yet. Try again in a moment.",
      });
      return;
    }

    try {
      if (ch.customTooltip) {
        ch.customTooltip.destroy();
        ch.customTooltip = null;
      }

      const filename = `demand_forecast_${new Date()
        .toISOString()
        .slice(0, 10)}`;

      const exportOpts = {
        type: "application/pdf",
        filename,
        scale: 2,
        sourceWidth: ch.chartWidth,
        sourceHeight: ch.chartHeight,
      };

      if (typeof ch.exportChartLocal === "function") {
        ch.exportChartLocal(exportOpts);
      } else if (typeof ch.exportChart === "function") {
        ch.exportChart(exportOpts);
      } else {
        throw new Error("Highcharts exporting module not loaded");
      }
    } catch {
      setErrorSnackbar?.({
        open: true,
        message:
          "Unable to export PDF. Make sure exporting modules are loaded and try again.",
      });
    }
  }, [setErrorSnackbar]);

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
        tickmarkPlacement: "on",
        startOnTick: true,
        endOnTick: true,
        title: { text: "", style: AXIS_TITLE_STYLE },
        labels: { style: AXIS_LABEL_STYLE, overflow: "justify", crop: false },
        plotBands: createPlotBands(filteredEvents, months, overlays),
      },
      yAxis: {
        title: { text: "Units (in thousands)", style: AXIS_TITLE_STYLE },
        labels: {
          align: "center",
          style: AXIS_LABEL_STYLE,
          formatter() {
            if (this.value === 0) return "0";
            return this.value / 1000;
          },
        },
        gridLineDashStyle: "ShortDash",
        gridLineColor: "#e0e0e0",
        min: null,
      },

      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          const idx =
            (this.points && this.points[0] && this.points[0].point.x) ??
            (this.point && this.point.x);

          // get month label from categories (months array)
          const categories = this.points?.[0]?.series?.xAxis?.categories || [];
          const header =
            Number.isInteger(idx) && categories[idx] !== undefined
              ? categories[idx]
              : String(this.x);

          let pts = this.points || [this];

          // at join index, hide solid Baseline/ML/Consensus
          if (idx === safeTodayIdx) {
            const hideSolid = new Set(["Baseline", "ML", "Consensus"]);
            pts = pts.filter((p) => !hideSolid.has(p.series.name));
          }

          // build tooltip
          let html = `<div style="font-weight:600;margin-bottom:4px">${header}</div>`;
          pts.forEach((p) => {
            if (p.y == null) return;
            const cleanName = p.series.name.replace(/\s*\(\d+\)\s*$/, "");
            html += `<span style="color:${
              p.color
            }">●</span> ${cleanName}: <b>${Highcharts.numberFormat(
              p.y,
              0
            )}</b><br/>`;
          });
          return html;
        },
      },

      legend: { enabled: false },
      credits: { enabled: false },
      exporting: {
        enabled: false, // we use our own button
        fallbackToExportServer: true,
      },
      series: [
        {
          name: "Actual",
          data: seriesData.actual,
          color: "#4338CA",
          marker: { enabled: false },
          visible: !hiddenSeries[0],
        },
        {
          name: "Baseline",
          data: seriesData.baseline,
          color: "#60A5FA",
          marker: { enabled: false },
          visible: !hiddenSeries[1],
        },
        {
          name: "ML",
          data: seriesData.ml,
          color: "#A16207",
          marker: { enabled: false },
          visible: !hiddenSeries[2],
        },
        {
          name: "Consensus",
          data: seriesData.consensus,
          color: "#0E7490",
          marker: { enabled: false },
          visible: !hiddenSeries[3],
        },
        {
          name: "Baseline Forecast",
          data: seriesData.baseline_forecast,
          color: "#60A5FA",
          dashStyle: "Dash",
          marker: { enabled: false },
          visible: !hiddenSeries[4],
        },
        {
          name: "ML Forecast",
          data: seriesData.ml_forecast,
          color: "#A16207",
          dashStyle: "Dash",
          marker: { enabled: false },
          visible: !hiddenSeries[5],
        },
        {
          name: "Consensus Forecast",
          data: seriesData.consensus_forecast,
          color: "#0E7490",
          dashStyle: "Dash",
          marker: { enabled: false },
          visible: !hiddenSeries[6],
        },
      ],
    }),
    [
      months,
      seriesData,
      filteredEvents,
      overlays,
      hiddenSeries,
      createPlotBands,
    ]
  );

  // country check for overlays
  const validateCountrySelection = useCallback(() => {
    if (
      !countryName ||
      (Array.isArray(countryName) && countryName.length === 0) ||
      countryName === ""
    ) {
      if (setErrorSnackbar) {
        setErrorSnackbar({
          open: true,
          message:
            "Country is not selected. Please select a country before accessing holidays and promotions.",
        });
      }
      return false;
    }
    return true;
  }, [countryName, setErrorSnackbar]);

  const handleLegendClick = useCallback(
    (key) => {
      const cfg = LEGEND_CONFIG.find((i) => i.key === key);
      if (!cfg) return;

      // Ignore forecast toggles if there's no forecast data
      const isForecastKey = [
        "baseline_forecast",
        "ml_forecast",
        "consensus_forecast",
      ].includes(key);
      if (isForecastKey && !hasAnyForecastData) return;

      if (
        (key === "holidays" || key === "promotions") &&
        !validateCountrySelection()
      ) {
        return;
      }

      const ch = chartRef.current?.chart;
      if (!ch) return;

      if (cfg.isOverlay) {
        setOverlays((prev) => {
          const next = { ...prev, [cfg.key]: !prev[cfg.key] };
          setTimeout(() => {
            ch.xAxis[0].update({
              plotBands: createPlotBands(filteredEvents, months, next),
            });
          }, 0);
          return next;
        });
      } else {
        const s = ch.series[cfg.seriesIndex];
        if (!s) return;
        s.visible ? s.hide() : s.show();
        setHiddenSeries((prev) => ({ ...prev, [cfg.seriesIndex]: !s.visible }));
      }
    },
    [
      createPlotBands,
      filteredEvents,
      months,
      validateCountrySelection,
      hasAnyForecastData,
    ]
  );

  useEffect(() => {
    const ch = chartRef.current?.chart;
    if (!ch) return;
    const init = {};
    ch.series.forEach((s, i) => {
      init[i] = !s.visible;
    });
    setHiddenSeries(init);
  }, []);

  useEffect(() => {
    if (showForecast === undefined) return;
    const forecastIdx = [4, 5, 6]; // BaselineFc, MLFc, ConsFc
    const ch = chartRef.current?.chart;
    setHiddenSeries((prev) => {
      const next = { ...prev };
      forecastIdx.forEach((i) => {
        next[i] = !showForecast;
        if (ch?.series?.[i]) {
          showForecast ? ch.series[i].show(false) : ch.series[i].hide(false);
        }
      });
      return next;
    });
  }, [showForecast]);

  useEffect(
    () => () => {
      const ch = chartRef.current?.chart;
      if (ch?.customTooltip) ch.customTooltip.destroy();
    },
    []
  );

  const activeKeys = LEGEND_CONFIG.filter((cfg) =>
    cfg.isOverlay ? overlays[cfg.key] : !hiddenSeries[cfg.seriesIndex]
  ).map((i) => i.key);

  const mapeStr = avgMapeData ? Number(avgMapeData).toFixed(1) : "-";
  const mapeColor = getMapeColor(mapeStr);

  return (
    <Box
      sx={{
        mt: 1,
        mx: 1,
        p: 1,
        bgcolor: "#fff",
        borderRadius: 1,
        boxShadow: 1,
        position: "relative",
        border: "1px solid #CBD5E1",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: 14,
              color: "#334155",
            }}
          >
            Demand Forecast
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0.1px",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#4f4f58ff",
            }}
          >
            |
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: 14,
              color: "#555",
              display: "flex",
              alignItems: "center",
            }}
          >
            MAPE:&nbsp;
            <Box component="span" sx={{ color: mapeColor }}>
              {mapeStr}
            </Box>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
          <IconButton
            ref={gridIconRef}
            size="small"
            onClick={() => setTreeOpen((v) => !v)}
          >
            <GridViewIcon fontSize="small" />
          </IconButton>
          {/* <IconButton size="small">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton> */}
          <IconButton size="small" onClick={handleDownloadPdf}>
            <DownloadIcon
              sx={{ width: 20, height: 20, color: "text.secondary" }}
            />
          </IconButton>
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Legend */}
      <CustomLegend
        activeKeys={activeKeys}
        onToggle={handleLegendClick}
        showForecast={showForecast}
        disableForecastLegend={!hasAnyForecastData}
      />

      {/* Chart */}
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
      />

      {/* Floating tree menu */}
      <TreeMenu
        open={treeOpen}
        onClose={() => setTreeOpen(false)}
        modelName={modelName}
        setModelName={setModelName}
        treeData={treeData}
        anchorEl={gridIconRef.current}
      />
    </Box>
  );
}
