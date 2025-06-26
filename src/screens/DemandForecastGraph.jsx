import React, { useMemo, useState, useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  ClickAwayListener,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';

const LEGEND_CONFIG = [
  { key: 'actual', label: 'Actual', color: '#ff4d4f', dash: 'Solid', seriesIndex: 0 },
  { key: 'baseline', label: 'Baseline', color: '#1890ff', dash: 'Solid', seriesIndex: 1 },
  { key: 'ml', label: 'ML', color: '#fadb14', dash: 'Solid', seriesIndex: 2 },
  { key: 'consensus', label: 'Consensus', color: '#52c41a', dash: 'Solid', seriesIndex: 3 },
  { key: 'holidays', label: 'Holidays', color: 'rgba(82,196,26,0.6)', dash: 'Solid', isOverlay: true },
  { key: 'promotions', label: 'Promotions', color: 'rgba(250,173,20,0.6)', dash: 'Solid', isOverlay: true },
];

const treeData = [
  {
    id: 1,
    title: "Model",
    items: [
      { id: 11, label: "XGBoost", checked: true, starred: true },
      { id: 12, label: "LightGBM", checked: false },
      { id: 13, label: "ARIMA", checked: false }
    ]
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
      { id: 26, label: "Average Disposable Income", checked: false }
    ]
  },
  {
    id: 3,
    title: "Events",
    items: [
      { id: 31, label: "All", checked: true, starred: true },
      { id: 32, label: "Holidays", checked: true },
      { id: 33, label: "Marketing and Promotion", checked: true }
    ]
  }
];

// Floating tree menu for advanced filtering
function TreeMenu({ open, onClose }) {
  const [expandedSections, setExpandedSections] = useState([1, 2, 3]);
  const [checkedItems, setCheckedItems] = useState(
    treeData.flatMap(section =>
      section.items.filter(item => item.checked).map(item => item.id)
    )
  );

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleToggleItem = (itemId) => {
    setCheckedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (!open) return null;

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Paper
        variant="outlined"
        sx={{
          position: "fixed",
          top: 140,
          right: 40,
          width: 320,
          zIndex: 1500,
          boxShadow: 4,
          borderRadius: 2,
          p: 0,
        }}
      >
        <Stack spacing={1} sx={{ p: 2, width: "100%" }}>
          {treeData.map((section) => (
            <Box key={section.id}>
              {/* Section Header */}
              <Box
                sx={{
                  px: 1,
                  py: 1.25,
                  bgcolor: "primary.lighter",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 1,
                  cursor: "pointer"
                }}
                onClick={() => handleToggleSection(section.id)}
              >
                <ChevronDownIcon sx={{ color: "primary.main" }} />
                <DescriptionIcon sx={{ color: "primary.main" }} />
                <Typography
                  variant="subtitle1"
                  sx={{
                    flexGrow: 1,
                    color: "primary.main",
                    fontWeight: 600
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              {/* Section Items */}
              {expandedSections.includes(section.id) && (
                <List disablePadding>
                  {section.items.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        pl: 3.75,
                        pr: 0,
                        py: 0,
                        "&:hover": { bgcolor: "action.hover" }
                      }}
                      onClick={() => handleToggleItem(item.id)}
                    >
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.625,
                          bgcolor: "background.paper",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderRadius: 1,
                          width: "100%",
                          cursor: "pointer"
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                          <Checkbox
                            checked={checkedItems.includes(item.id)}
                            sx={{
                              p: 0,
                              width: 16,
                              height: 16,
                              color: "grey.400",
                              '&.Mui-checked': {
                                color: "primary.main",
                              }
                            }}
                          />
                        </ListItemIcon>
                        {item.starred && (
                          <StarIcon
                            sx={{
                              width: 16,
                              height: 16,
                              color: "warning.main"
                            }}
                          />
                        )}
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "text.secondary",
                            sx: { mt: "-1px" }
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    </ClickAwayListener>
  );
}

export default function ForecastChart({ months, data }) {
  const [treeMenuOpen, setTreeMenuOpen] = useState(false);
  const chartRef = useRef();

  // Track overlays (plot bands) visibility
  const [overlays, setOverlays] = useState({
    holidays: true,
    promotions: true,
  });

  // Track which series are hidden (by index)
  const [hiddenSeries, setHiddenSeries] = useState({});

  // Chart data
  const today = new Date();
  const currentMonthStr = today.toLocaleString('default', { month: 'short', year: '2-digit' });
  const currentIdx = months.indexOf(currentMonthStr);

  const seriesData = useMemo(() => {
    const getSeries = (rowLabel) => months.map((m) => {
      const v = data?.[m]?.[rowLabel];
      if (v === undefined || v === null || v === '-' || v === 'NULL') return null;
      return Number(v);
    });
    return {
      actual: getSeries('Actual'),
      baseline: getSeries('Baseline Forecast'),
      ml: getSeries('ML Forecast'),
      consensus: getSeries('Consensus'),
    };
  }, [months, data]);

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
      { 
        name: 'Actual', 
        data: seriesData.actual, 
        color: '#ff4d4f', 
        type: 'line',
        marker: { enabled: false },
        lineWidth: 3,
        dashStyle: 'Solid',
        visible: hiddenSeries[0] !== true,
      },
      {
        name: 'Baseline',
        data: seriesData.baseline,
        color: '#1890ff',
        zoneAxis: 'x',
        marker: { enabled: false },
        lineWidth: 3,
        zones: [
          { value: currentIdx + 0.5, dashStyle: 'Solid' },
          { dashStyle: 'ShortDot' },
        ],
        visible: hiddenSeries[1] !== true,
      },
      {
        name: 'ML',
        data: seriesData.ml,
        color: '#fadb14',
        zoneAxis: 'x',
        marker: { enabled: false },
        lineWidth: 3,
        zones: [
          { value: currentIdx + 0.5, dashStyle: 'Solid' },
          { dashStyle: 'ShortDash' },
        ],
        visible: hiddenSeries[2] !== true,
      },
      {
        name: 'Consensus',
        data: seriesData.consensus,
        color: '#52c41a',
        zoneAxis: 'x',
        marker: { enabled: false },
        lineWidth: 3,
        zones: [
          { value: currentIdx + 0.5, dashStyle: 'Solid' },
          { dashStyle: 'ShortDashDot' },
        ],
        visible: hiddenSeries[3] !== true,
      },
      {
        name: 'Holidays',
        type: 'line',
        data: [],
        color: 'rgba(82,196,26,0.6)',
        marker: { enabled: false },
        lineWidth: 3,
        dashStyle: 'Solid',
        enableMouseTracking: false,
        showInLegend: true,
        visible: overlays.holidays,
      },
      {
        name: 'Promotions',
        type: 'line',
        data: [],
        color: 'rgba(250,173,20,0.6)',
        marker: { enabled: false },
        lineWidth: 3,
        dashStyle: 'Solid',
        enableMouseTracking: false,
        showInLegend: true,
        visible: overlays.promotions,
      }
    ],
    credits: { enabled: false },
  }), [months, seriesData, plotBands, hiddenSeries, overlays, currentIdx]);

  // Handle legend item click
  const handleLegendClick = (item) => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    if (item.isOverlay) {
      // Toggle overlays (holidays/promotions)
      setOverlays((prev) => {
        const next = { ...prev, [item.key]: !prev[item.key] };
        // Update plot bands by updating xAxis
        chart.xAxis[0].update({ plotBands: plotBands }, false);
        chart.series[item.key === 'holidays' ? 4 : 5].setVisible(!prev[item.key], false);
        chart.redraw();
        return next;
      });
    } else {
      // Toggle series visibility
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
          [idx]: series.visible, // after .show()/.hide(), series.visible is updated
        }));
      }
    }
  };

  // Sync legend state with chart series visibility on mount/update
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
        // Determine active state
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
    <Box sx={{ mt: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 1, p: 2 }}>
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
      {/* Floating tree menu */}
      <TreeMenu open={treeMenuOpen} onClose={() => setTreeMenuOpen(false)} />
    </Box>
  );
}
