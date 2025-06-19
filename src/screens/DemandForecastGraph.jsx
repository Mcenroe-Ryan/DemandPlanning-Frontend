// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import { Box, Typography } from "@mui/material";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const DemandForecastChart = ({ rowData, months }) => {
//   // Convert your table data to chart format
//   const chartData = {
//     labels: months,
//     datasets: [
//       {
//         label: "Actual",
//         data: rowData.find((row) => row.name === "Actual")?.values || [],
//         borderColor: "#ef4444",
//         backgroundColor: "#ef4444",
//         pointBackgroundColor: "#ef4444",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       {
//         label: "Baseline",
//         data:
//           rowData.find((row) => row.name === "Baseline Forecast")?.values || [],
//         borderColor: "#06b6d4",
//         backgroundColor: "#06b6d4",
//         pointBackgroundColor: "#06b6d4",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       {
//         label: "ML",
//         data: rowData.find((row) => row.name === "ML Forecast")?.values || [],
//         borderColor: "#f59e0b",
//         backgroundColor: "#f59e0b",
//         pointBackgroundColor: "#f59e0b",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       {
//         label: "Consensus",
//         data: rowData.find((row) => row.name === "Consensus")?.values || [],
//         borderColor: "#8b5cf6",
//         backgroundColor: "#8b5cf6",
//         pointBackgroundColor: "#8b5cf6",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       // Forecast versions (dashed lines for future periods)
//       {
//         label: "Baseline Forecast",
//         data:
//           rowData
//             .find((row) => row.name === "Baseline Forecast")
//             ?.values.map((val, idx) => (idx >= 7 ? val : null)) || [], // Show forecast from Nov onwards
//         borderColor: "#06b6d4",
//         backgroundColor: "transparent",
//         pointBackgroundColor: "#06b6d4",
//         borderWidth: 2,
//         pointRadius: 3,
//         borderDash: [5, 5],
//         tension: 0.1,
//         spanGaps: true,
//       },
//       {
//         label: "ML Forecast",
//         data:
//           rowData
//             .find((row) => row.name === "ML Forecast")
//             ?.values.map((val, idx) => (idx >= 7 ? val : null)) || [],
//         borderColor: "#f59e0b",
//         backgroundColor: "transparent",
//         pointBackgroundColor: "#f59e0b",
//         borderWidth: 2,
//         pointRadius: 3,
//         borderDash: [5, 5],
//         tension: 0.1,
//         spanGaps: true,
//       },
//       {
//         label: "Consensus Forecast",
//         data:
//           rowData
//             .find((row) => row.name === "Consensus")
//             ?.values.map((val, idx) => (idx >= 6 ? val : null)) || [],
//         borderColor: "#8b5cf6",
//         backgroundColor: "transparent",
//         pointBackgroundColor: "#8b5cf6",
//         borderWidth: 2,
//         pointRadius: 3,
//         borderDash: [5, 5],
//         tension: 0.1,
//         spanGaps: true,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         align: "start",
//         labels: {
//           usePointStyle: true,
//           pointStyle: "line",
//           padding: 10,
//           font: {
//             size: 12,
//           },
//         },
//       },
//       title: {
//         display: true,
//         text: "Demand Forecast | MAPE: 12",
//         align: "start",
//         font: {
//           size: 14,
//           weight: "bold",
//         },
//         padding: {
//           bottom: 5,
//         },
//       },
//       tooltip: {
//         mode: "index",
//         intersect: false,
//         callbacks: {
//           label: function (context) {
//             let label = context.dataset.label || "";
//             if (label) {
//               label += ": ";
//             }
//             if (context.parsed.y !== null) {
//               label += context.parsed.y.toLocaleString();
//             }
//             return label;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         display: true,
//         grid: {
//           display: true,
//           color: "#f1f5f9",
//         },
//         ticks: {
//           font: {
//             size: 11,
//           },
//         },
//       },
//       y: {
//         display: true,
//         title: {
//           display: true,
//           text: "Units (in Thousands)",
//           font: {
//             size: 12,
//           },
//         },
//         grid: {
//           display: true,
//           color: "#f1f5f9",
//         },
//         ticks: {
//           font: {
//             size: 11,
//           },
//           callback: function (value) {
//             return (value / 1000).toFixed(0);
//           },
//         },
//         min: 6000,
//         max: 15000,
//       },
//     },
//     interaction: {
//       mode: "nearest",
//       axis: "x",
//       intersect: false,
//     },
//   };

//   // Add holiday/promotion highlighting
//   const plugins = [
//     {
//       id: "backgroundHighlight",
//       beforeDraw: (chart) => {
//         const ctx = chart.ctx;
//         const chartArea = chart.chartArea;

//         // Holiday periods (green bars)
//         const holidayPeriods = [
//           { start: 4, end: 5 }, // May-Jun
//           { start: 8, end: 9 }, // Sep-Oct
//         ];

//         // Promotion periods (orange bars)
//         const promotionPeriods = [
//           { start: 3, end: 4 }, // Apr-May
//           { start: 7, end: 8 }, // Aug-Sep
//         ];

//         const xScale = chart.scales.x;
//         const yScale = chart.scales.y;

//         // Draw holiday periods
//         ctx.fillStyle = "rgba(34, 197, 94, 0.2)";
//         holidayPeriods.forEach((period) => {
//           const startX = xScale.getPixelForValue(period.start);
//           const endX = xScale.getPixelForValue(period.end);
//           ctx.fillRect(
//             startX,
//             chartArea.top,
//             endX - startX,
//             chartArea.bottom - chartArea.top
//           );
//         });

//         // Draw promotion periods
//         ctx.fillStyle = "rgba(251, 146, 60, 0.2)";
//         promotionPeriods.forEach((period) => {
//           const startX = xScale.getPixelForValue(period.start);
//           const endX = xScale.getPixelForValue(period.end);
//           ctx.fillRect(
//             startX,
//             chartArea.top,
//             endX - startX,
//             chartArea.bottom - chartArea.top
//           );
//         });
//       },
//     },
//   ];

//   return (
//     <Box sx={{ mt: 3, height: 400, bgcolor: "white", p: 2, borderRadius: 1 }}>
//       <Line data={chartData} options={options} plugins={plugins} />
//     </Box>
//   );
// };

// // export default DemandForecastChart;
// import React, { useRef, useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Card,
//   CardContent,
//   Paper,
//   Stack,
//   Checkbox,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ClickAwayListener,
// } from "@mui/material";
// import GridViewIcon from "@mui/icons-material/GridView";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import ShareIcon from "@mui/icons-material/Share";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ChevronDownIcon from "@mui/icons-material/ExpandMore";
// import FileTextIcon from "@mui/icons-material/Description";
// import StarIcon from "@mui/icons-material/Star";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// // Legend config and plugin (same as your previous working version)
// const LEGEND_CONFIG = [
//   { key: "actual", label: "Actual", color: "#ef4444", datasetIndex: 0 },
//   { key: "baseline", label: "Baseline", color: "#06b6d4", datasetIndex: 1 },
//   { key: "ml", label: "ML", color: "#f59e0b", datasetIndex: 2 },
//   { key: "consensus", label: "Consensus", color: "#8b5cf6", datasetIndex: 3 },
//   { key: "holidays", label: "Holidays", color: "#22c55e", isOverlay: true },
//   { key: "promotions", label: "Promotions", color: "#fb923c", isOverlay: true },
//   { key: "baseline_forecast", label: "Baseline Forecast", color: "#06b6d4", datasetIndex: 4, isDashed: true },
//   { key: "ml_forecast", label: "ML Forecast", color: "#f59e0b", datasetIndex: 5, isDashed: true },
//   { key: "consensus_forecast", label: "Consensus Forecast", color: "#8b5cf6", datasetIndex: 6, isDashed: true },
// ];

// const htmlLegendPlugin = {
//   id: "htmlLegend",
//   afterUpdate(chart, args, options) {
//     const legendContainer = document.getElementById(options.containerID);
//     if (!legendContainer) return;
//     while (legendContainer.firstChild) {
//       legendContainer.firstChild.remove();
//     }
//     const chartItems = chart.options.plugins.legend.labels.generateLabels(chart);

//     LEGEND_CONFIG.forEach((item) => {
//       const li = document.createElement("span");
//       li.style.display = "inline-flex";
//       li.style.alignItems = "center";
//       li.style.cursor = "pointer";
//       li.style.marginRight = "16px";
//       const circle = document.createElement("span");
//       circle.style.display = "inline-block";
//       circle.style.width = "12px";
//       circle.style.height = "12px";
//       circle.style.borderRadius = "50%";
//       circle.style.marginRight = "8px";
//       circle.style.background = item.color;
//       let isVisible = true;
//       if (item.isOverlay) {
//         isVisible = item.key === "holidays"
//           ? window.__showHolidays !== false
//           : window.__showPromos !== false;
//       } else if (typeof item.datasetIndex === "number") {
//         const chartItem = chartItems[item.datasetIndex];
//         isVisible = chartItem && !chartItem.hidden;
//       }
//       circle.style.opacity = isVisible ? "1" : "0.3";
//       if (item.isDashed) {
//         circle.style.border = `2px dashed ${item.color}`;
//         circle.style.background = "transparent";
//       }
//       const label = document.createElement("span");
//       label.style.fontSize = "13px";
//       label.style.fontWeight = "500";
//       label.style.color = "#222";
//       label.style.opacity = isVisible ? "1" : "0.3";
//       label.textContent = item.label;
//       li.onclick = () => {
//         if (item.isOverlay) {
//           if (item.key === "holidays") {
//             window.__showHolidays = !isVisible;
//           } else if (item.key === "promotions") {
//             window.__showPromos = !isVisible;
//           }
//         } else if (typeof item.datasetIndex === "number") {
//           chart.setDatasetVisibility(item.datasetIndex, !isVisible);
//         }
//         chart.update();
//       };
//       li.appendChild(circle);
//       li.appendChild(label);
//       legendContainer.appendChild(li);
//     });
//   },
// };

// // TreeMenu component (from your code, with minor tweaks)
// const treeData = [
//   {
//     id: 1,
//     title: "Model",
//     items: [
//       { id: 11, label: "XGBoost", checked: true, starred: true },
//       { id: 12, label: "LightGBM", checked: false },
//       { id: 13, label: "ARIMA", checked: false }
//     ]
//   },
//   {
//     id: 2,
//     title: "External Factors",
//     items: [
//       { id: 21, label: "All", checked: false },
//       { id: 22, label: "CPI", checked: true, starred: true },
//       { id: 23, label: "Interest Rate", checked: false },
//       { id: 24, label: "GDP", checked: true, starred: true },
//       { id: 25, label: "Unemployment Rate", checked: true, starred: true },
//       { id: 26, label: "Average Disposable Income", checked: false }
//     ]
//   },
//   {
//     id: 3,
//     title: "Events",
//     items: [
//       { id: 31, label: "All", checked: true, starred: true },
//       { id: 32, label: "Holidays", checked: true },
//       { id: 33, label: "Marketing and Promotion", checked: true }
//     ]
//   }
// ];

// function TreeMenu({ open, onClose }) {
//   const [expandedSections, setExpandedSections] = useState([1, 2, 3]);
//   const [checkedItems, setCheckedItems] = useState(
//     treeData.flatMap(section =>
//       section.items.filter(item => item.checked).map(item => item.id)
//     )
//   );

//   const handleToggleSection = (sectionId) => {
//     setExpandedSections(prev =>
//       prev.includes(sectionId)
//         ? prev.filter(id => id !== sectionId)
//         : [...prev, sectionId]
//     );
//   };

//   const handleToggleItem = (itemId) => {
//     setCheckedItems(prev =>
//       prev.includes(itemId)
//         ? prev.filter(id => id !== itemId)
//         : [...prev, itemId]
//     );
//   };

//   if (!open) return null;

//   return (
//     <ClickAwayListener onClickAway={onClose}>
//       <Paper
//         variant="outlined"
//         sx={{
//           position: "fixed",
//           top: 140,
//           right: 40,
//           width: 320,
//           zIndex: 1500,
//           boxShadow: 4,
//           borderRadius: 2,
//           p: 0,
//         }}
//       >
//         <Stack spacing={1} sx={{ p: 2, width: "100%" }}>
//           {treeData.map((section) => (
//             <Box key={section.id}>
//               {/* Section Header */}
//               <Box
//                 sx={{
//                   px: 1,
//                   py: 1.25,
//                   bgcolor: "primary.lighter",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   borderRadius: 1,
//                   cursor: "pointer"
//                 }}
//                 onClick={() => handleToggleSection(section.id)}
//               >
//                 <ChevronDownIcon sx={{ color: "primary.main" }} />
//                 <FileTextIcon sx={{ color: "primary.main" }} />
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     flexGrow: 1,
//                     color: "primary.main",
//                     fontWeight: 600
//                   }}
//                 >
//                   {section.title}
//                 </Typography>
//               </Box>
//               {/* Section Items */}
//               {expandedSections.includes(section.id) && (
//                 <List disablePadding>
//                   {section.items.map((item) => (
//                     <ListItem
//                       key={item.id}
//                       sx={{
//                         pl: 3.75,
//                         pr: 0,
//                         py: 0,
//                         "&:hover": { bgcolor: "action.hover" }
//                       }}
//                       onClick={() => handleToggleItem(item.id)}
//                     >
//                       <Box
//                         sx={{
//                           px: 1.5,
//                           py: 0.625,
//                           bgcolor: "background.paper",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                           borderRadius: 1,
//                           width: "100%",
//                           cursor: "pointer"
//                         }}
//                       >
//                         <ListItemIcon sx={{ minWidth: 'auto' }}>
//                           <Checkbox
//                             checked={checkedItems.includes(item.id)}
//                             sx={{
//                               p: 0,
//                               width: 16,
//                               height: 16,
//                               color: "grey.400",
//                               '&.Mui-checked': {
//                                 color: "primary.main",
//                               }
//                             }}
//                           />
//                         </ListItemIcon>
//                         {item.starred && (
//                           <StarIcon
//                             sx={{
//                               width: 16,
//                               height: 16,
//                               color: "warning.main"
//                             }}
//                           />
//                         )}
//                         <ListItemText
//                           primary={item.label}
//                           primaryTypographyProps={{
//                             variant: "body2",
//                             color: "text.secondary",
//                             sx: { mt: "-1px" }
//                           }}
//                         />
//                       </Box>
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </Box>
//           ))}
//         </Stack>
//       </Paper>
//     </ClickAwayListener>
//   );
// }

// // Main graph component
// const DemandForecastChart = ({ rowData, months }) => {
//   const chartRef = useRef();
//   const [treeMenuOpen, setTreeMenuOpen] = useState(false);

//   // Initialize overlay flags
//   useEffect(() => {
//     if (window.__showHolidays === undefined) window.__showHolidays = true;
//     if (window.__showPromos === undefined) window.__showPromos = true;
//   }, []);

//   // Chart.js data
//   const chartData = {
//     labels: months,
//     datasets: [
//       {
//         label: "Actual",
//         data: rowData.find((row) => row.name === "Actual")?.values || [],
//         borderColor: "#ef4444",
//         backgroundColor: "#ef4444",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       {
//         label: "Baseline",
//         data: rowData.find((row) => row.name === "Baseline Forecast")?.values || [],
//         borderColor: "#06b6d4",
//         backgroundColor: "#06b6d4",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       {
//         label: "ML",
//         data: rowData.find((row) => row.name === "ML Forecast")?.values || [],
//         borderColor: "#f59e0b",
//         backgroundColor: "#f59e0b",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       {
//         label: "Consensus",
//         data: rowData.find((row) => row.name === "Consensus")?.values || [],
//         borderColor: "#8b5cf6",
//         backgroundColor: "#8b5cf6",
//         borderWidth: 2,
//         pointRadius: 4,
//         borderDash: [],
//         tension: 0.1,
//       },
//       // Forecast versions (dashed lines)
//       {
//         label: "Baseline Forecast",
//         data: rowData.find((row) => row.name === "Baseline Forecast")?.values.map((val, idx) => (idx >= 7 ? val : null)) || [],
//         borderColor: "#06b6d4",
//         backgroundColor: "transparent",
//         borderWidth: 2,
//         pointRadius: 3,
//         borderDash: [5, 5],
//         tension: 0.1,
//         spanGaps: true,
//       },
//       {
//         label: "ML Forecast",
//         data: rowData.find((row) => row.name === "ML Forecast")?.values.map((val, idx) => (idx >= 7 ? val : null)) || [],
//         borderColor: "#f59e0b",
//         backgroundColor: "transparent",
//         borderWidth: 2,
//         pointRadius: 3,
//         borderDash: [5, 5],
//         tension: 0.1,
//         spanGaps: true,
//       },
//       {
//         label: "Consensus Forecast",
//         data: rowData.find((row) => row.name === "Consensus")?.values.map((val, idx) => (idx >= 6 ? val : null)) || [],
//         borderColor: "#8b5cf6",
//         backgroundColor: "transparent",
//         borderWidth: 2,
//         pointRadius: 3,
//         borderDash: [5, 5],
//         tension: 0.1,
//         spanGaps: true,
//       },
//     ],
//   };

//   // Chart.js options
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false, // Use custom legend
//       },
//       title: { display: false },
//       tooltip: {
//         mode: "index",
//         intersect: false,
//         callbacks: {
//           label: function (context) {
//             let label = context.dataset.label || "";
//             if (label) label += ": ";
//             if (context.parsed.y !== null) label += context.parsed.y.toLocaleString();
//             return label;
//           },
//         },
//       },
//       htmlLegend: { containerID: "demand-forecast-legend" },
//     },
//     scales: {
//       x: {
//         display: true,
//         grid: { display: true, color: "#f1f5f9" },
//         ticks: { font: { size: 11 } },
//       },
//       y: {
//         display: true,
//         title: { display: true, text: "Units (in thousands)", font: { size: 12 } },
//         grid: { display: true, color: "#f1f5f9" },
//         ticks: {
//           font: { size: 11 },
//           callback: (value) => (value / 1000).toFixed(0),
//         },
//         min: 6000,
//         max: 15000,
//       },
//     },
//     interaction: { mode: "nearest", axis: "x", intersect: false },
//   };

//   // Background highlight plugin for holidays/promotions
//   const plugins = [
//     htmlLegendPlugin,
//     {
//       id: "backgroundHighlight",
//       beforeDraw: (chart) => {
//         const ctx = chart.ctx;
//         const chartArea = chart.chartArea;
//         const showHolidays = window.__showHolidays !== false;
//         const showPromos = window.__showPromos !== false;
//         const holidayPeriods = showHolidays
//           ? [
//               { start: 4, end: 5 },
//               { start: 8, end: 9 },
//             ]
//           : [];
//         const promotionPeriods = showPromos
//           ? [
//               { start: 3, end: 4 },
//               { start: 7, end: 8 },
//             ]
//           : [];
//         const xScale = chart.scales.x;
//         ctx.save();
//         ctx.fillStyle = "rgba(34, 197, 94, 0.2)";
//         holidayPeriods.forEach((period) => {
//           const startX = xScale.getPixelForValue(period.start);
//           const endX = xScale.getPixelForValue(period.end);
//           ctx.fillRect(
//             startX,
//             chartArea.top,
//             endX - startX,
//             chartArea.bottom - chartArea.top
//           );
//         });
//         ctx.fillStyle = "rgba(251, 146, 60, 0.2)";
//         promotionPeriods.forEach((period) => {
//           const startX = xScale.getPixelForValue(period.start);
//           const endX = xScale.getPixelForValue(period.end);
//           ctx.fillRect(
//             startX,
//             chartArea.top,
//             endX - startX,
//             chartArea.bottom - chartArea.top
//           );
//         });
//         ctx.restore();
//       },
//     },
//   ];

//   // Ensure legend renders after mount
//   useEffect(() => {
//     if (chartRef.current) {
//       chartRef.current.update();
//     }
//   }, [rowData, months]);

//   return (
//     <Card sx={{ mt: 3, bgcolor: "white", borderRadius: 1, boxShadow: 1 }}>
//       <CardContent sx={{ p: 2 }}>
//         {/* Title, MAPE, and action buttons row */}
//         <Box sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           mb: 1,
//           flexWrap: "wrap",
//         }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Typography variant="subtitle1" fontWeight={600}>
//               Demand Forecast
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 500, color: "#222" }}>
//               | MAPE: <span style={{ fontWeight: 700, color: "#22c55e" }}>12</span>
//               <span style={{
//                 display: "inline-block",
//                 width: 10,
//                 height: 10,
//                 borderRadius: "50%",
//                 background: "#22c55e",
//                 marginLeft: 4,
//                 marginRight: 8,
//                 verticalAlign: "middle",
//               }} />
//             </Typography>
//           </Box>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <IconButton size="small" onClick={() => setTreeMenuOpen((v) => !v)}>
//               <GridViewIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small"><ChatBubbleOutlineIcon fontSize="small" /></IconButton>
//             <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
//             <IconButton size="small"><SettingsIcon fontSize="small" /></IconButton>
//           </Box>
//         </Box>
//         {/* Custom legend row */}
//         <Box
//           id="demand-forecast-legend"
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             flexWrap: "wrap",
//             mb: 2,
//             minHeight: 28,
//           }}
//         />
//         {/* Chart */}
//         <Box sx={{ height: 400 }}>
//           <Line ref={chartRef} data={chartData} options={options} plugins={plugins} />
//         </Box>
//         {/* TreeMenu - floating on the right */}
//         <TreeMenu open={treeMenuOpen} onClose={() => setTreeMenuOpen(false)} />
//       </CardContent>
//     </Card>
//   );
// };

// export default DemandForecastChart;
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
