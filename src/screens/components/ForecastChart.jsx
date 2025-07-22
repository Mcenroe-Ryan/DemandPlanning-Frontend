// import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Paper,
//   Stack,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   Checkbox,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import GridViewIcon from "@mui/icons-material/GridView";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import ShareIcon from "@mui/icons-material/Share";
// import SettingsIcon from "@mui/icons-material/Settings";
// import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import StarIcon from "@mui/icons-material/Star";

// // const API_BASE_URL = import.meta.env.VITE_API_URL;
// const API_BASE_URL = `http://localhost:5000/api`;

// /* ---------- MAPE color coding function ---------- */
// const getMapeColor = (mapeValue) => {
//   const value = Number(mapeValue);
//   if (isNaN(value)) return "#6B7280";
//   if (value >= 0 && value <= 20) return "#22C55E";
//   if (value > 20 && value <= 40) return "#F97316";
//   if (value > 40) return "#EF4444";
//   return "#6B7280";
// };

// /* ---------- CONSISTENT LABEL STYLING ---------- */
// const AXIS_LABEL_STYLE = {
//   fontFamily: "Poppins",
//   fontWeight: 600,
//   fontSize: "12px",
//   lineHeight: "100%",
//   letterSpacing: "0.4px",
//   color: "#64748B",
// };

// const AXIS_TITLE_STYLE = {
//   fontFamily: "Poppins",
//   fontWeight: 600,
//   fontSize: "12px",
//   lineHeight: "100%",
//   letterSpacing: "0.4px",
//   color: "#64748B",
// };

// /* ---------- reusable styled checkbox ---------- */
// const BlueSquare = styled("span")({
//   width: 18,
//   height: 18,
//   borderRadius: 3,
//   border: "2px solid #2196f3",
//   background: "#fff",
// });

// const BlueChecked = styled(BlueSquare)({
//   background: "#2196f3",
//   position: "relative",
//   "&:before": {
//     content: '""',
//     position: "absolute",
//     left: 4,
//     top: 1,
//     width: 7,
//     height: 12,
//     border: "solid #fff",
//     borderWidth: "0 2.5px 2.5px 0",
//     transform: "rotate(45deg)",
//   },
// });

// function BlueCheckbox(props) {
//   return (
//     <Checkbox
//       disableRipple
//       color="default"
//       checkedIcon={<BlueChecked />}
//       icon={<BlueSquare />}
//       sx={{ p: 0.5, "&:hover": { bgcolor: "transparent" } }}
//       {...props}
//     />
//   );
// }

// /* ---------- legend config ---------- */
// const LEGEND_CONFIG = [
//   { key: "actual", label: "Actual", color: "#EF4444", seriesIndex: 0 },
//   { key: "baseline", label: "Baseline", color: "#60A5FA", seriesIndex: 1 },
//   { key: "ml", label: "ML", color: "#EAB308", seriesIndex: 2 },
//   { key: "consensus", label: "Consensus", color: "#0E7490", seriesIndex: 3 },
//   {
//     key: "baseline_forecast",
//     label: "Baseline Forecast",
//     color: "#60A5FA",
//     dash: "Dash",
//     seriesIndex: 4,
//   },
//   {
//     key: "ml_forecast",
//     label: "ML Forecast",
//     color: "#EAB308",
//     dash: "Dash",
//     seriesIndex: 5,
//   },
//   {
//     key: "consensus_forecast",
//     label: "Consensus Forecast",
//     color: "#0E7490",
//     dash: "Dash",
//     seriesIndex: 6,
//   },
//   { key: "holidays", label: "Holidays", color: "#DCFCE7", isOverlay: true },
//   { key: "promotions", label: "Promotions", color: "#FFEDD5", isOverlay: true },
// ];

// /* ---------- tree-menu items ---------- */
// function TreeMenuItem({ item, disabled }) {
//   return (
//     <ListItem
//       sx={{
//         px: 2,
//         py: 0.25,
//         borderRadius: 1,
//         "&:hover": disabled ? {} : { bgcolor: "rgba(0,0,0,0.04)" },
//         minHeight: 28,
//         opacity: disabled ? 0.5 : 1,
//         pointerEvents: disabled ? "none" : "auto",
//       }}
//     >
//       <ListItemIcon sx={{ minWidth: 28 }}>
//         <BlueCheckbox checked={item.checked} disabled />
//       </ListItemIcon>
//       {item.starred && (
//         <StarIcon sx={{ fontSize: 14, color: "warning.main", mr: 0.5 }} />
//       )}
//       <ListItemText
//         primary={
//           <Typography variant="body2" color="text.secondary">
//             {item.label}
//           </Typography>
//         }
//       />
//     </ListItem>
//   );
// }

// /* ---------- tree-menu section ---------- */
// function TreeMenuSection({ section, modelName, setModelName }) {
//   const [expanded, setExpanded] = useState(section.id === 1);
//   const toggle = () => !section.disabled && setExpanded((v) => !v);

//   return (
//     <>
//       <Box
//         onClick={toggle}
//         sx={{
//           px: 1,
//           py: 1,
//           mb: 0.5,
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           borderRadius: 1,
//           bgcolor: section.disabled ? "grey.100" : "primary.lighter",
//           cursor: section.disabled ? "not-allowed" : "pointer",
//           opacity: section.disabled ? 0.6 : 1,
//         }}
//       >
//         {section.id === 1 && section.disabled && (
//           <CircularProgress size={16} sx={{ mr: 1 }} />
//         )}
//         <ExpandMoreIcon
//           sx={{
//             transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
//             transition: "transform 0.2s",
//             color: section.disabled ? "grey.500" : "primary.main",
//           }}
//         />
//         <DescriptionOutlined
//           sx={{ color: section.disabled ? "grey.500" : "primary.main" }}
//         />
//         <Typography
//           variant="subtitle2"
//           fontWeight={600}
//           sx={{
//             flexGrow: 1,
//             color: section.disabled ? "grey.600" : "primary.main",
//           }}
//         >
//           {section.title}
//           {section.id === 1 && section.disabled && " (Loading…)"}
//         </Typography>
//       </Box>

//       {expanded && (
//         <Box
//           sx={{
//             pl: 3,
//             pointerEvents: section.disabled ? "none" : "auto",
//             opacity: section.disabled ? 0.5 : 1,
//           }}
//         >
//           {section.type === "radio" ? (
//             <RadioGroup
//               value={modelName}
//               onChange={(e) => setModelName(e.target.value)}
//               sx={{ display: "flex", gap: 0.5 }}
//             >
//               {section.items.length === 0 ? (
//                 <Typography variant="body2" color="text.secondary">
//                   No models available
//                 </Typography>
//               ) : (
//                 section.items.map((item) => (
//                   <FormControlLabel
//                     key={item.id}
//                     value={item.value}
//                     control={<Radio size="small" />}
//                     label={
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
//                       >
//                         {item.starred && (
//                           <StarIcon
//                             sx={{ fontSize: 14, color: "warning.main" }}
//                           />
//                         )}
//                         <Typography variant="body2">{item.label}</Typography>
//                       </Box>
//                     }
//                     sx={{ mr: 0 }}
//                   />
//                 ))
//               )}
//             </RadioGroup>
//           ) : (
//             <List disablePadding>
//               {section.items.map((item) => (
//                 <TreeMenuItem
//                   key={item.id}
//                   item={item}
//                   disabled={section.disabled}
//                 />
//               ))}
//             </List>
//           )}
//         </Box>
//       )}
//     </>
//   );
// }

// /* ---------- floating tree-menu with dynamic positioning ---------- */
// function TreeMenu({
//   open,
//   onClose,
//   modelName,
//   setModelName,
//   treeData,
//   anchorEl,
// }) {
//   const [menuPosition, setMenuPosition] = useState({ top: 80, right: 40 });

//   useEffect(() => {
//     if (open && anchorEl) {
//       const rect = anchorEl.getBoundingClientRect();
//       const parentRect = anchorEl.offsetParent?.getBoundingClientRect();
//       const menuWidth = 260;
//       const menuHeight = 360;

//       if (!parentRect) return;

//       let top = rect.bottom - parentRect.top + 8;
//       let left = rect.left - parentRect.left;

//       if (top + menuHeight > parentRect.height) {
//         top = rect.top - parentRect.top - menuHeight - 8;
//       }

//       if (left + menuWidth > parentRect.width) {
//         left = parentRect.width - menuWidth - 16;
//       }

//       if (left < 16) {
//         left = 16;
//       }

//       setMenuPosition({ top, left });
//     }
//   }, [open, anchorEl]);

//   useEffect(() => {
//     if (!open) return;
//     const handle = (e) => !e.target.closest(".tree-menu-float") && onClose();
//     window.addEventListener("mousedown", handle);
//     return () => window.removeEventListener("mousedown", handle);
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <Paper
//       className="tree-menu-float"
//       elevation={4}
//       sx={{
//         position: "absolute",
//         top: menuPosition.top,
//         left: menuPosition.left,
//         width: 260,
//         maxHeight: 360,
//         overflowY: "auto",
//         p: 1,
//         zIndex: 2000,
//       }}
//     >
//       <Stack spacing={0.5}>
//         {treeData.map((sec) => (
//           <TreeMenuSection
//             key={sec.id}
//             section={sec}
//             modelName={modelName}
//             setModelName={setModelName}
//           />
//         ))}
//       </Stack>
//     </Paper>
//   );
// }

// /* ---------- custom legend ---------- */
// function CustomLegend({ activeKeys, onToggle }) {
//   return (
//     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
//       {LEGEND_CONFIG.map(({ key, label, color }) => (
//         <Box
//           key={key}
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             if (typeof onToggle === 'function') {
//               onToggle(key);
//             }
//           }}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             cursor: "pointer",
//             opacity: activeKeys.includes(key) ? 1 : 0.5,
//             borderRadius: 1,
//             border: "1px solid",
//             borderColor: "#CBD5E1",
//             px: 1,
//             userSelect: "none",
//             "&:hover": { opacity: 0.8 },
//           }}
//         >
//           <Box
//             sx={{
//               width: 12,
//               height: 12,
//               bgcolor: color,
//               borderRadius: 1,
//               mr: 1,
//             }}
//           />
//           <Typography variant="body2" fontWeight={500}>
//             {label}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   );
// }

// export default function ForecastChart({
//   months,
//   data,
//   modelName,
//   setModelName,
//   models,
//   loadingModels,
//   avgMapeData,
//   countryName, // <- ADD THIS PROP
// }) {
//   const [treeMenuOpen, setTreeMenuOpen] = useState(false);
//   const chartRef = useRef();
//   const gridIconRef = useRef();
//   const [overlays, setOverlays] = useState({
//     holidays: true,
//     promotions: true,
//   });
//   const [hiddenSeries, setHiddenSeries] = useState({});
//   const [events, setEvents] = useState([]);

//   /* ---------- dynamic tree-data (now INSIDE component) ---------- */
//   const treeData = useMemo(() => {
//     const sortedModels = [...models].sort((a, b) => {
//       if (a.model_name === "XGBoost") return -1;
//       if (b.model_name === "XGBoost") return 1;
//       return a.model_name.localeCompare(b.model_name);
//     });

//     return [
//       {
//         id: 1,
//         title: "Model",
//         disabled: loadingModels,
//         type: "radio",
//         items: sortedModels.map((m) => ({
//           id: m.model_id,
//           label: m.model_name,
//           value: m.model_name,
//           starred: m.model_name === "XGBoost",
//         })),
//       },
//       {
//         id: 2,
//         title: "External Factors",
//         disabled: true,
//         type: "checkbox",
//         items: [
//           { id: 21, label: "All", checked: false },
//           { id: 22, label: "CPI", checked: true, starred: true },
//           { id: 23, label: "Interest Rate", checked: false },
//           { id: 24, label: "GDP", checked: true, starred: true },
//           { id: 25, label: "Unemployment Rate", checked: true, starred: true },
//           { id: 26, label: "Average Disposable Income", checked: false },
//         ],
//       },
//       {
//         id: 3,
//         title: "Events",
//         disabled: true,
//         type: "checkbox",
//         items: [
//           { id: 31, label: "All", checked: true, starred: true },
//           { id: 32, label: "Holidays", checked: true },
//           { id: 33, label: "Marketing & Promotion", checked: true },
//         ],
//       },
//     ];
//   }, [models, loadingModels]);

//   /* ---------- fetch events once ---------- */
//   useEffect(() => {
//     fetch(`${API_BASE_URL}/events`)
//       .then((r) => r.json())
//       .then(setEvents)
//       .catch(() => setEvents([]));
//   }, []);

//   /* ---------- country-filtered events ---------- */
//   const filteredEvents = useMemo(() => {
//     if (!events.length) return [];
//     if (!countryName) return events; // show all if none selected

//     const countries = Array.isArray(countryName) ? countryName : [countryName];
//     return events.filter(
//       (ev) =>
//         ev.country_name &&
//         countries.some((c) =>
//           ev.country_name.toLowerCase().includes(c.toLowerCase())
//         )
//     );
//   }, [events, countryName]);

//   /* ---------- ENHANCED helper: plot bands with hover tooltips ---------- */
//   const createPlotBands = useCallback((events, months, overlays) => {
//     return events.reduce((acc, ev) => {
//       const startDate = new Date(ev.start_date);
//       const endDate = new Date(ev.end_date);
      
//       const startMonthLabel = startDate.toLocaleString("default", {
//         month: "short",
//         year: "2-digit",
//       });
//       const endMonthLabel = endDate.toLocaleString("default", {
//         month: "short",
//         year: "2-digit",
//       });
      
//       const sIdx = months.indexOf(startMonthLabel);
//       const eIdx = months.indexOf(endMonthLabel);
      
//       if (sIdx === -1) return acc;
      
//       const isHoliday = ev.event_type === "Holiday";
//       const show = isHoliday ? overlays.holidays : overlays.promotions;
//       if (!show) return acc;
      
//       const calculateMonthPosition = (date, monthIndex) => {
//         const year = date.getFullYear();
//         const month = date.getMonth();
//         const day = date.getDate();
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
//         const positionInMonth = (day - 1) / daysInMonth;
//         return monthIndex + positionInMonth - 0.5;
//       };
      
//       let fromPos, toPos;
      
//       if (sIdx === eIdx || eIdx === -1) {
//         fromPos = calculateMonthPosition(startDate, sIdx);
//         toPos = eIdx === -1 ? sIdx + 0.5 : calculateMonthPosition(endDate, sIdx);
//       } else {
//         fromPos = calculateMonthPosition(startDate, sIdx);
//         toPos = calculateMonthPosition(endDate, eIdx);
//       }
      
//       const minWidth = 0.05;
//       if (toPos - fromPos < minWidth) {
//         const center = (fromPos + toPos) / 2;
//         fromPos = center - minWidth / 2;
//         toPos = center + minWidth / 2;
//       }
      
//       // **ADD: Event handlers for hover tooltips**
//       const plotBandConfig = {
//         id: `${ev.event_type.toLowerCase()}_${ev.event_id}`,
//         from: fromPos,
//         to: toPos,
//         color: isHoliday ? "#DCFCE7" : "#FFEDD5",
//         events: {
//           mouseover: function(e) {
//             const chart = chartRef.current?.chart;
//             if (!chart) return;
            
//             if (chart.customTooltip) {
//               chart.customTooltip.destroy();
//             }
            
//             const tooltipText = `
//               <div style="padding: 8px; line-height: 1.4; font-family: Inter, sans-serif; font-size: 12px;">
//                 <b>${isHoliday ? 'Holiday' : 'Promotion'}:</b> ${ev.event_name}<br/>
//                 <b>Start:</b> ${startDate.toLocaleDateString()}<br/>
//                 <b>End:</b> ${endDate.toLocaleDateString()}<br/>
//                 <b>Country:</b> ${ev.country_name || 'N/A'}
//               </div>
//             `;
            
//             const containerRect = chart.container.getBoundingClientRect();
//             const mouseX = (e.pageX || e.clientX) - containerRect.left;
//             const mouseY = (e.pageY || e.clientY) - containerRect.top;
            
//             const tooltipWidth = 200;
//             const tooltipHeight = 100;
//             const finalX = Math.min(mouseX + 10, chart.plotWidth - tooltipWidth + chart.plotLeft);
//             const finalY = Math.max(mouseY - tooltipHeight, chart.plotTop + 10);
            
//             chart.customTooltip = chart.renderer.label(
//               tooltipText,
//               finalX,
//               finalY,
//               'round',
//               null,
//               null,
//               true
//             )
//             .attr({
//               fill: 'rgba(247, 247, 247, 0.95)',
//               stroke: 'rgba(51, 51, 51, 0.3)',
//               'stroke-width': 1,
//               r: 3,
//               padding: 8,
//               zIndex: 999
//             })
//             .css({
//               fontSize: '12px',
//               fontFamily: 'Inter, sans-serif',
//               color: '#333',
//               boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
//             })
//             .add();
//           },
//           mouseout: function() {
//             const chart = chartRef.current?.chart;
//             if (chart && chart.customTooltip) {
//               chart.customTooltip.destroy();
//               chart.customTooltip = null;
//             }
//           }
//         }
//       };
      
//       acc.push(plotBandConfig);
//       return acc;
//     }, []);
//   }, []);

//   /* ---------- split hist/forecast for stepped joins ---------- */
//   const todayIdx = months.indexOf(
//     new Date().toLocaleString("default", { month: "short", year: "2-digit" })
//   );

//   function onlyFirstFutureValue(arr, todayIdx) {
//     let found = false;
//     return arr.map((v, i) => {
//       if (i > todayIdx && v != null && !found) {
//         found = true;
//         return v;
//       }
//       return null;
//     });
//   }

//   const join = (hist, fc) => {
//     const out = [...fc];
//     for (let i = 1; i < out.length; i++) {
//       if (out[i] != null && out[i - 1] == null) {
//         out[i - 1] = hist[todayIdx];
//         break;
//       }
//     }
//     return out;
//   };

//   /* ---------- series data (Consensus joined to first forecast) ---------- */
//   const seriesData = useMemo(() => {
//     const get = (row) =>
//       months.map((m) => {
//         const v = data?.[m]?.[row];
//         return v == null || v === "-" ? null : +v;
//       });

//     const baseFull = get("Baseline Forecast");
//     const mlFull = get("ML Forecast");
//     const consFull = get("Consensus");
//     const actual = get("Actual");

//     const histCut = (arr) => arr.map((v, i) => (i <= todayIdx ? v : null));
//     const fcCut = (arr) => arr.map((v, i) => (i > todayIdx ? v : null));

//     return {
//       actual,
//       baseline: histCut(baseFull),
//       baseline_forecast: join(histCut(baseFull), fcCut(baseFull)),
//       ml: histCut(mlFull),
//       ml_forecast: join(histCut(mlFull), fcCut(mlFull)),
//       consensus: histCut(consFull),
//       consensus_forecast: join(
//         histCut(consFull),
//         onlyFirstFutureValue(consFull, todayIdx)
//       ),
//     };
//   }, [months, data, todayIdx]);

//   /* ---------- highcharts options with CONSISTENT label styling ---------- */
//   const options = useMemo(
//     () => ({
//       chart: {
//         backgroundColor: "#fafafa",
//         style: { fontFamily: "Inter" },
//         zoomType: "x",
//       },
//       title: { text: "" },
//       xAxis: {
//         categories: months,
//         gridLineWidth: 1,
//         gridLineColor: "#e0e0e0",
//         title: {
//           text: "",
//           style: AXIS_TITLE_STYLE,
//         },
//         labels: {
//           rotation: 0,
//           style: AXIS_LABEL_STYLE,
//           overflow: "justify",
//           crop: false,
//         },
//         // **USE FILTERED EVENTS HERE**
//         plotBands: createPlotBands(filteredEvents, months, overlays),
//       },
//       yAxis: {
//         title: {
//           text: "Units (in thousands)",
//           style: AXIS_TITLE_STYLE,
//         },
//         labels: {
//           align: "center",
//           style: AXIS_LABEL_STYLE,
//           formatter: function () {
//             if (this.value === 0) return "0";
//             return this.value / 1000;
//           },
//         },
//         gridLineDashStyle: "ShortDash",
//         gridLineColor: "#e0e0e0",
//         min: null,
//       },
//       tooltip: { shared: true },
//       legend: { enabled: false },
//       credits: { enabled: false },
//       series: [
//         {
//           name: "Actual",
//           data: seriesData.actual,
//           color: "#EF4444",
//           visible: !hiddenSeries[0],
//           marker: { enabled: false },
//         },
//         {
//           name: "Baseline",
//           data: seriesData.baseline,
//           color: "#60A5FA",
//           visible: !hiddenSeries[1],
//           marker: { enabled: false },
//         },
//         {
//           name: "ML",
//           data: seriesData.ml,
//           color: "#EAB308",
//           visible: !hiddenSeries[2],
//           marker: { enabled: false },
//         },
//         {
//           name: "Consensus",
//           data: seriesData.consensus,
//           color: "#0E7490",
//           visible: !hiddenSeries[3],
//           marker: { enabled: false },
//         },
//         {
//           name: "Baseline Forecast",
//           data: seriesData.baseline_forecast,
//           color: "#60A5FA",
//           dashStyle: "Dash",
//           visible: !hiddenSeries[4],
//           marker: { enabled: false },
//         },
//         {
//           name: "ML Forecast",
//           data: seriesData.ml_forecast,
//           color: "#EAB308",
//           dashStyle: "Dash",
//           visible: !hiddenSeries[5],
//           marker: { enabled: false },
//         },
//         {
//           name: "Consensus Forecast",
//           data: seriesData.consensus_forecast,
//           color: "#0E7490",
//           dashStyle: "Dash",
//           visible: !hiddenSeries[6],
//           marker: { enabled: false },
//         },
//       ],
//     }),
//     [months, seriesData, filteredEvents, overlays, hiddenSeries, createPlotBands]
//   );

//   /* ---------- legend click handler ---------- */
//   const handleLegendClick = useCallback((item) => {
//     const chart = chartRef.current?.chart;
//     if (!chart) return;

//     if (item.isOverlay) {
//       setOverlays((prev) => {
//         const newOverlays = { ...prev, [item.key]: !prev[item.key] };
//         setTimeout(() => {
//           chart.xAxis[0].update({
//             // **USING FILTERED EVENTS HERE**
//             plotBands: createPlotBands(filteredEvents, months, newOverlays),
//           });
//         }, 0);
//         return newOverlays;
//       });
//     } else {
//       const s = chart.series[item.seriesIndex];
//       s.visible ? s.hide() : s.show();
//       setHiddenSeries((prev) => ({ ...prev, [item.seriesIndex]: !s.visible }));
//     }
//   }, [createPlotBands, filteredEvents, months]);

//   /* ---------- sync hidden series state on first render ---------- */
//   useEffect(() => {
//     const chart = chartRef.current?.chart;
//     if (!chart) return;
//     const init = {};
//     chart.series.forEach((s, i) => (init[i] = !s.visible));
//     setHiddenSeries(init);
//   }, []);

//   /* ---------- cleanup tooltips on unmount ---------- */
//   useEffect(() => {
//     return () => {
//       const chart = chartRef.current?.chart;
//       if (chart && chart.customTooltip) {
//         chart.customTooltip.destroy();
//       }
//     };
//   }, []);

//   /* ---------- mape with color coding only ---------- */
//   const mape = avgMapeData ? Number(avgMapeData).toFixed(1) : "-";
//   const mapeColor = getMapeColor(mape);

//   /* ---------- active legend keys ---------- */
//   const activeKeys = LEGEND_CONFIG.filter((it) =>
//     it.isOverlay ? overlays[it.key] : !hiddenSeries[it.seriesIndex]
//   ).map((it) => it.key);

//   return (
//     <Box
//       sx={{
//         mt: 3,
//         p: 2,
//         bgcolor: "#fff",
//         borderRadius: 1,
//         boxShadow: 1,
//         position: "relative",
//       }}
//     >
//       {/* header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Typography variant="body2" fontWeight={700}>
//             Demand Forecast
//           </Typography>
//           <Typography variant="body2" fontWeight={700} color="#555">
//             MAPE:&nbsp;
//             <Box component="span" sx={{ color: mapeColor, fontWeight: 700 }}>
//               {mape}
//             </Box>
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
//           <IconButton
//             ref={gridIconRef}
//             size="small"
//             onClick={() => setTreeMenuOpen((v) => !v)}
//           >
//             <GridViewIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <ChatBubbleOutlineIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <ShareIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <SettingsIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* legend */}
//       <CustomLegend
//         activeKeys={activeKeys}
//         onToggle={(k) =>
//           handleLegendClick(LEGEND_CONFIG.find((i) => i.key === k))
//         }
//       />

//       {/* chart */}
//       <Box sx={{ height: 400 }}>
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           ref={chartRef}
//         />
//       </Box>

//       {/* floating tree-menu */}
//       <TreeMenu
//         open={treeMenuOpen}
//         onClose={() => setTreeMenuOpen(false)}
//         modelName={modelName}
//         setModelName={setModelName}
//         treeData={treeData}
//         anchorEl={gridIconRef.current}
//       />
//     </Box>
//   );
// }



import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
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

const API_BASE_URL = `http://localhost:5000/api`;

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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {item.starred && (
                          <StarIcon sx={{ fontSize: 14, color: "warning.main" }} />
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
function TreeMenu({ open, onClose, modelName, setModelName, treeData, anchorEl }) {
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

/* ---------- UPDATED: Pill legend with longer dashed line indicator for forecast items ---------- */
const CustomLegend = ({ activeKeys, onToggle, showForecast }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
    {LEGEND_CONFIG.filter(({ key }) => {
      if (!showForecast) {
        // Hide forecast-related legends when showForecast is false
        return !["baseline_forecast", "ml_forecast", "consensus_forecast"].includes(key);
      }
      return true;
    }).map(({ key, label, color, dash }) => {
      // Check if this is a forecast item that should have dashed indicator
      const isForecast = ["baseline_forecast", "ml_forecast", "consensus_forecast"].includes(key);
      
      return (
        <Box
          key={key}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle(key);
          }}
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
          {/* Conditional indicator based on whether it's a forecast item */}
          {isForecast ? (
            // Longer dashed line indicator for forecast items
            <Box
              sx={{
                width: 16, // Increased from 12px to 16px
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
                  )`, // Increased dash segments from 2px to 4px, gaps from 4px to 6px
                }}
              />
            </Box>
          ) : (
            // Solid dot indicator for non-forecast items
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
          <Typography variant="body2" fontWeight={500}>
            {label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

/* **********************************************************************
 *                          MAIN COMPONENT
 * *********************************************************************/
export default function ForecastChart({
  /* filters & data */
  months,
  data,
  /* model radio */
  modelName,
  setModelName,
  models,
  loadingModels,
  /* metrics */
  avgMapeData,
  /* geo filter */
  countryName,
  /* NEW: sync flag from table */
  showForecast,
}) {
  /* ---------- refs & simple state ---------- */
  const chartRef = useRef();
  const gridIconRef = useRef();
  const [treeOpen, setTreeOpen] = useState(false);
  const [overlays, setOverlays] = useState({ holidays: true, promotions: true });
  const [hiddenSeries, setHiddenSeries] = useState({});
  const [events, setEvents] = useState([]);

  /* ---------- tree-data (sorted models) ---------- */
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
  }, [models, loadingModels]);

  /* ---------- Load events (one-off) ---------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  /* ---------- Country-filtered events ---------- */
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

  /* ---------- Plot band factory (memoised) ---------- */
  const createPlotBands = useCallback(
    (evts, monthsArr, overlayState) =>
      evts.reduce((acc, ev) => {
        const s = new Date(ev.start_date);
        const e = new Date(ev.end_date);
        const sm = s.toLocaleString("default", { month: "short", year: "2-digit" });
        const em = e.toLocaleString("default", { month: "short", year: "2-digit" });
        const sIdx = monthsArr.indexOf(sm);
        const eIdx = monthsArr.indexOf(em);

        if (sIdx === -1) return acc;
        const holiday = ev.event_type === "Holiday";
        if (holiday ? !overlayState.holidays : !overlayState.promotions) return acc;

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
              const tip = `
                <div style="padding:8px;font-size:12px;font-family:Inter">
                  <b>${holiday ? "Holiday" : "Promotion"}:</b> ${ev.event_name}<br/>
                  <b>Start:</b> ${s.toLocaleDateString()}<br/>
                  <b>End&nbsp;&nbsp;:</b> ${e.toLocaleDateString()}<br/>
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

  /* ---------- Derive series arrays ---------- */
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
  const firstFutureOnly = (arr) => {
    let found = false;
    return arr.map((v, i) => {
      if (i > todayIdx && v != null && !found) {
        found = true;
        return v;
      }
      return null;
    });
  };

  const seriesData = useMemo(() => {
    const getRow = (row) =>
      months.map((m) => {
        const v = data?.[m]?.[row];
        return v == null || v === "-" ? null : +v;
      });

    const baselineFull = getRow("Baseline Forecast");
    const mlFull = getRow("ML Forecast");
    const consFull = getRow("Consensus");
    const actual = getRow("Actual");

    const hist = (arr) => arr.map((v, i) => (i <= todayIdx ? v : null));
    const fut = (arr) => arr.map((v, i) => (i > todayIdx ? v : null));

    return {
      actual,
      baseline: hist(baselineFull),
      baseline_forecast: join(hist(baselineFull), fut(baselineFull)),
      ml: hist(mlFull),
      ml_forecast: join(hist(mlFull), fut(mlFull)),
      consensus: hist(consFull),
      consensus_forecast: join(hist(consFull), firstFutureOnly(consFull)),
    };
  }, [months, data, todayIdx]);

  /* ---------- Highcharts option object ---------- */
  const options = useMemo(
    () => ({
      chart: { backgroundColor: "#fafafa", style: { fontFamily: "Inter" }, zoomType: "x" },
      title: { text: "" },
      xAxis: {
        categories: months,
        gridLineWidth: 1,
        gridLineColor: "#e0e0e0",
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
      tooltip: { shared: true },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [
        { name: "Actual", data: seriesData.actual, color: "#EF4444", marker: { enabled: false }, visible: !hiddenSeries[0] },
        { name: "Baseline", data: seriesData.baseline, color: "#60A5FA", marker: { enabled: false }, visible: !hiddenSeries[1] },
        { name: "ML", data: seriesData.ml, color: "#EAB308", marker: { enabled: false }, visible: !hiddenSeries[2] },
        { name: "Consensus", data: seriesData.consensus, color: "#0E7490", marker: { enabled: false }, visible: !hiddenSeries[3] },
        { name: "Baseline Forecast", data: seriesData.baseline_forecast, color: "#60A5FA", dashStyle: "Dash", marker: { enabled: false }, visible: !hiddenSeries[4] },
        { name: "ML Forecast", data: seriesData.ml_forecast, color: "#EAB308", dashStyle: "Dash", marker: { enabled: false }, visible: !hiddenSeries[5] },
        { name: "Consensus Forecast", data: seriesData.consensus_forecast, color: "#0E7490", dashStyle: "Dash", marker: { enabled: false }, visible: !hiddenSeries[6] },
      ],
    }),
    [months, seriesData, filteredEvents, overlays, hiddenSeries, createPlotBands]
  );

  /* ---------- Legend pill click handler ---------- */
  const handleLegendClick = useCallback(
    (key) => {
      const cfg = LEGEND_CONFIG.find((i) => i.key === key);
      if (!cfg) return;
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
        s.visible ? s.hide() : s.show();
        setHiddenSeries((prev) => ({ ...prev, [cfg.seriesIndex]: !s.visible }));
      }
    },
    [createPlotBands, filteredEvents, months]
  );

  /* ---------- Initialise hiddenSeries after first render ---------- */
  useEffect(() => {
    const ch = chartRef.current?.chart;
    if (!ch) return;
    const init = {};
    ch.series.forEach((s, i) => {
      init[i] = !s.visible;
    });
    setHiddenSeries(init);
  }, []);

  /* ---------- NEW: Sync with showForecast flag ---------- */
  useEffect(() => {
    if (showForecast === undefined) return; // guard for legacy callers
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

  /* ---------- Destroy stray tooltips on unmount ---------- */
  useEffect(
    () => () => {
      const ch = chartRef.current?.chart;
      if (ch?.customTooltip) ch.customTooltip.destroy();
    },
    []
  );

  /* ---------- Active legend pill bookkeeping ---------- */
  const activeKeys = LEGEND_CONFIG.filter((cfg) =>
    cfg.isOverlay ? overlays[cfg.key] : !hiddenSeries[cfg.seriesIndex]
  ).map((i) => i.key);

  /* ---------- Render ---------- */
  const mapeStr = avgMapeData ? Number(avgMapeData).toFixed(1) : "-";
  const mapeColor = getMapeColor(mapeStr);

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: "#fff", borderRadius: 1, boxShadow: 1, position: "relative" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" fontWeight={700}>
            Demand Forecast
          </Typography>
          <Typography variant="body2" fontWeight={700} color="#555">
            MAPE:&nbsp;
            <Box component="span" sx={{ color: mapeColor, fontWeight: 700 }}>
              {mapeStr}
            </Box>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
          <IconButton ref={gridIconRef} size="small" onClick={() => setTreeOpen((v) => !v)}>
            <GridViewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small"><ChatBubbleOutlineIcon fontSize="small" /></IconButton>
          <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
          <IconButton size="small"><SettingsIcon fontSize="small" /></IconButton>
        </Box>
      </Box>

      {/* Legend */}
      <CustomLegend activeKeys={activeKeys} onToggle={handleLegendClick} showForecast={showForecast} />

      {/* Chart */}
      <Box sx={{ height: 400 }}>
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </Box>

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

