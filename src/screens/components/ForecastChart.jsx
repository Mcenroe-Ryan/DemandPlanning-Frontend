import React, { useMemo, useState, useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Box, Typography, IconButton, Paper, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import { styled } from '@mui/material/styles';

// --- Custom Checkbox to match screenshot ---
const BlueSquare = styled("span")({
  width: 18,
  height: 18,
  borderRadius: 3,
  border: "2px solid #2196f3",
  background: "#fff",
  display: "block",
});

const BlueChecked = styled(BlueSquare)({
  background: "#2196f3",
  border: "2px solid #2196f3",
  position: "relative",
  "&:before": {
    content: '""',
    display: "block",
    position: "absolute",
    left: 4,
    top: 1,
    width: 7,
    height: 12,
    border: "solid #fff",
    borderWidth: "0 2.5px 2.5px 0",
    borderRadius: 1,
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
      sx={{
        p: 0.5,
        "&:hover": { bgcolor: "transparent" },
      }}
      {...props}
    />
  );
}

// --- Legend configuration ---
const LEGEND_CONFIG = [
  { key: 'actual', label: 'Actual', color: '#ff4d4f', dash: 'Solid', seriesIndex: 0 },
  { key: 'baseline', label: 'Baseline', color: '#1890ff', dash: 'Solid', seriesIndex: 1 },
  { key: 'ml', label: 'ML', color: '#fadb14', dash: 'Solid', seriesIndex: 2 },
  { key: 'consensus', label: 'Consensus', color: '#52c41a', dash: 'Solid', seriesIndex: 3 },
  { key: 'baseline_forecast', label: 'Baseline Forecast', color: '#1890ff', dash: 'Dot', seriesIndex: 4 },
  { key: 'ml_forecast', label: 'ML Forecast', color: '#fadb14', dash: 'Dot', seriesIndex: 5 },
  { key: 'consensus_forecast', label: 'Consensus Forecast', color: '#52c41a', dash: 'Dot', seriesIndex: 6 },
  { key: 'holidays', label: 'Holidays', color: 'rgba(82,196,26,0.6)', dash: 'Solid', isOverlay: true },
  { key: 'promotions', label: 'Promotions', color: 'rgba(250,173,20,0.6)', dash: 'Solid', isOverlay: true },
];

// --- Tree menu data ---
const treeData = [
  {
    id: 1,
    title: "Model",
    items: [
      { id: 11, label: "XGBoost", checked: true, starred: true },
      { id: 12, label: "LightGBM", checked: false },
      { id: 13, label: "ARIMA", checked: false },
    ],
  },
  {
    id: 2,
    title: "External Factors",
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
    items: [
      { id: 31, label: "All", checked: true, starred: true },
      { id: 32, label: "Holidays", checked: true },
      { id: 33, label: "Marketing and Promotion", checked: true },
    ],
  },
];

// --- Tree Menu Item ---
const TreeMenuItem = ({ item, handleToggle }) => (
  <ListItem
    sx={{
      px: 2,
      py: 0.25,
      borderRadius: 1,
      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
      minHeight: 28,
    }}
    onClick={() => handleToggle(item.id)}
    button
  >
    <ListItemIcon sx={{ minWidth: 28 }}>
      <BlueCheckbox
        edge="start"
        checked={item.checked}
        tabIndex={-1}
        inputProps={{ "aria-labelledby": `checkbox-list-label-${item.id}` }}
      />
    </ListItemIcon>
    {item.starred && (
      <StarIcon
        sx={{
          fontSize: 14,
          color: "warning.main",
          mr: 0.5,
        }}
      />
    )}
    <ListItemText
      primary={
        <Typography variant="body2" color="text.secondary" sx={{ mt: -0.25 }}>
          {item.label}
        </Typography>
      }
    />
  </ListItem>
);

// --- Tree Menu Section ---
const TreeMenuSection = ({ section, handleToggle }) => {
  const [expanded, setExpanded] = useState(true);
  const toggleExpand = () => setExpanded(!expanded);

  return (
    <>
      <Box
        sx={{
          px: 0.5,
          py: 1,
          bgcolor: "primary.50",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 0.5,
          cursor: "pointer",
        }}
        onClick={toggleExpand}
      >
        <ExpandMore sx={{ color: "primary.main", width: 20, height: 20, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
        <DescriptionOutlined sx={{ color: "primary.main", width: 20, height: 20 }} />
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="primary.main"
          sx={{ flexGrow: 1, fontSize: 14 }}
        >
          {section.title}
        </Typography>
      </Box>
      {expanded && (
        <List disablePadding sx={{ pl: 2, pr: 0, py: 0 }}>
          {section.items.map((item) => (
            <TreeMenuItem
              key={item.id}
              item={item}
              handleToggle={handleToggle}
            />
          ))}
        </List>
      )}
    </>
  );
};

// --- Tree Menu ---
const TreeMenu = ({ open, onClose }) => {
  const [menuData, setMenuData] = useState(treeData);

  const handleToggle = (itemId) => {
    setMenuData((prevData) =>
      prevData.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item,
        ),
      })),
    );
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!e.target.closest('.tree-menu-float')) onClose();
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Paper
      elevation={4}
      className="tree-menu-float"
      sx={{
        position: "fixed",
        top: 80,
        right: 40,
        zIndex: 2000,
        border: 1,
        borderColor: "grey.200",
        bgcolor: "background.paper",
        width: 220,
        maxHeight: 340,
        overflowY: "auto",
        boxShadow: 8,
        p: 1,
      }}
    >
      <Stack spacing={0.5}>
        {menuData.map((section) => (
          <TreeMenuSection
            key={section.id}
            section={section}
            handleToggle={handleToggle}
          />
        ))}
      </Stack>
    </Paper>
  );
};
// --- Main Chart Component ---
export default function ForecastChart({ months, data }) {
  const [treeMenuOpen, setTreeMenuOpen] = useState(false);
  const chartRef = useRef();
  const [overlays, setOverlays] = useState({
    holidays: true,
    promotions: true,
  });
  const [hiddenSeries, setHiddenSeries] = useState({});

  const today = new Date();
  const currentMonthStr = today.toLocaleString('default', { month: 'short', year: '2-digit' });
  const currentIdx = months.indexOf(currentMonthStr);

  // --- Helper: Seamless forecast line continuation ---
  const joinSeries = (histArr, forecastArr) => {
    const joined = [...forecastArr];
    for (let i = 0; i < joined.length; i++) {
      if (joined[i] !== null) {
        if (i > 0 && joined[i - 1] === null) {
          joined[i - 1] = histArr[currentIdx];
        }
        break;
      }
    }
    return joined;
  };

  // --- Build series for actual, historical, and forecast ---
  const seriesData = useMemo(() => {
    const getSeries = (rowLabel) => months.map((m) => {
      const v = data?.[m]?.[rowLabel];
      if (v === undefined || v === null || v === '-' || v === 'NULL') return null;
      return Number(v);
    });

    const baselineFull = getSeries('Baseline Forecast');
    const mlFull = getSeries('ML Forecast');
    const consensusFull = getSeries('Consensus Forecast');
    const actual = getSeries('Actual');

    const baselineHist = baselineFull.map((v, i) => (i <= currentIdx ? v : null));
    const mlHist = mlFull.map((v, i) => (i <= currentIdx ? v : null));
    const consensusHist = consensusFull.map((v, i) => (i <= currentIdx ? v : null));

    const baselineForecast = baselineFull.map((v, i) => (i > currentIdx ? v : null));
    const mlForecast = mlFull.map((v, i) => (i > currentIdx ? v : null));
    const consensusForecast = consensusFull.map((v, i) => (i > currentIdx ? v : null));

    return {
      actual,
      baseline: baselineHist,
      baseline_forecast: joinSeries(baselineHist, baselineForecast),
      ml: mlHist,
      ml_forecast: joinSeries(mlHist, mlForecast),
      consensus: consensusHist,
      consensus_forecast: joinSeries(consensusHist, consensusForecast),
    };
  }, [months, data, currentIdx]);
  // Plot bands for overlays (holidays/promotions)
  const plotBands = useMemo(() => {
    const bands = [];
    if (overlays.holidays) {
      for (let i = 0; i < 3; i += 1) {
        const idx = Math.floor(Math.random() * months.length);
        bands.push({
          id: `holiday-${i}`,
          color: 'rgba(82,196,26,0.2)',
          from: idx - 0.1,
          to: idx + 0.1,
          zIndex: -1,
        });
      }
    }
    if (overlays.promotions) {
      for (let i = 0; i < 3; i += 1) {
        const idx = Math.floor(Math.random() * months.length);
        bands.push({
          id: `promo-${i}`,
          color: 'rgba(250,173,20,0.2)',
          from: idx - 0.25,
          to: idx + 0.25,
          zIndex: -1,
        });
      }
    }
    return bands;
  }, [months, overlays]);

  // Chart options
  const options = useMemo(() => ({
    title: { text: '' },
    chart: { height: 400, spacingTop: 20, animation: false },
    xAxis: {
      categories: months,
      tickmarkPlacement: 'on',
      tickInterval: 1,
      gridLineWidth: 1,
      plotBands,
    },
    yAxis: {
      title: { text: 'Units (in thousands)' },
      gridLineDashStyle: 'Dot',
      gridLineWidth: 1,
      minorGridLineWidth: 0,
    },
    tooltip: { shared: true },
    legend: { enabled: false }, // We use our own legend
    series: [
      { name: 'Actual', data: seriesData.actual, color: '#ff4d4f', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Solid', visible: hiddenSeries[0] !== true },
      { name: 'Baseline', data: seriesData.baseline, color: '#1890ff', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Solid', visible: hiddenSeries[1] !== true },
      { name: 'ML', data: seriesData.ml, color: '#fadb14', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Solid', visible: hiddenSeries[2] !== true },
      { name: 'Consensus', data: seriesData.consensus, color: '#52c41a', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Solid', visible: hiddenSeries[3] !== true },
      { name: 'Baseline Forecast', data: seriesData.baseline_forecast, color: '#1890ff', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Dot', visible: hiddenSeries[4] !== true },
      { name: 'ML Forecast', data: seriesData.ml_forecast, color: '#fadb14', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Dot', visible: hiddenSeries[5] !== true },
      { name: 'Consensus Forecast', data: seriesData.consensus_forecast, color: '#52c41a', type: 'line', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Dot', visible: hiddenSeries[6] !== true },
      { name: 'Holidays', type: 'line', data: [], color: 'rgba(82,196,26,0.6)', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Solid', enableMouseTracking: false, showInLegend: true, visible: overlays.holidays },
      { name: 'Promotions', type: 'line', data: [], color: 'rgba(250,173,20,0.6)', marker: { enabled: false }, lineWidth: 3, dashStyle: 'Solid', enableMouseTracking: false, showInLegend: true, visible: overlays.promotions }
    ],
    credits: { enabled: false },
  }), [months, seriesData, plotBands, hiddenSeries, overlays]);

  // Handle legend item click
  const handleLegendClick = (item) => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    if (item.isOverlay) {
      setOverlays((prev) => {
        const next = { ...prev, [item.key]: !prev[item.key] };
        chart.xAxis[0].update({ plotBands: plotBands }, false);
        chart.series[item.key === 'holidays' ? 7 : 8].setVisible(!prev[item.key], false);
        chart.redraw();
        return next;
      });
    } else {
      const idx = item.seriesIndex;
      const series = chart.series[idx];
      if (series) {
        if (series.visible) {
          series.hide();
        } else {
          series.show();
        }
        setHiddenSeries((prev) => ({
          ...prev,
          [idx]: !series.visible,
        }));
      }
    }
  };

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    const newHidden = {};
    chart.series.forEach((s, idx) => {
      newHidden[idx] = !s.visible;
    });
    setHiddenSeries(newHidden);
  }, [chartRef, overlays]);

  // Custom legend rendering
  const legendBox = (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1, flexWrap: 'wrap', minHeight: 32 }}>
      {LEGEND_CONFIG.map((item) => {
        let isActive = true;
        if (item.isOverlay) isActive = overlays[item.key];
        else if (typeof item.seriesIndex === 'number') isActive = !(hiddenSeries[item.seriesIndex]);
        return (
          <Box
            key={item.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 4,
              cursor: 'pointer',
              opacity: isActive ? 1 : 0.4,
              userSelect: 'none',
              transition: 'opacity 0.2s',
              "&:hover": { opacity: 0.7 },
            }}
            onClick={() => handleLegendClick(item)}
          >
            <span
              style={{
                display: 'inline-block',
                width: 18,
                height: 8,
                borderRadius: 8,
                marginRight: 8,
                background: item.dash !== 'Solid' ? 'transparent' : item.color,
                border: item.dash !== 'Solid' ? `2px dashed ${item.color}` : `2px solid ${item.color}`,
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#222",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                textDecoration: isActive ? "none" : "line-through",
                letterSpacing: 0.2,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ mt: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 1, p: 2, position: 'relative' }}>
      {/* Header row */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1,
        flexWrap: "wrap",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Demand Forecast
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#222" }}>
            | MAPE: <span style={{ fontWeight: 700, color: "#22c55e" }}>12</span>
            <span style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              marginLeft: 4,
              marginRight: 8,
              verticalAlign: "middle",
            }} />
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={() => setTreeMenuOpen(v => !v)}>
            <GridViewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small"><ChatBubbleOutlineIcon fontSize="small" /></IconButton>
          <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
          <IconButton size="small"><SettingsIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
      {/* Custom interactive legend */}
      {legendBox}
      {/* Chart */}
      <Box sx={{ height: 400 }}>
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </Box>
      {/* Tree menu floating panel */}
      <TreeMenu open={treeMenuOpen} onClose={() => setTreeMenuOpen(false)} />
    </Box>
  );
}
