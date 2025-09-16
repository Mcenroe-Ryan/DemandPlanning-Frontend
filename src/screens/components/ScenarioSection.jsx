// import React, { useMemo, useState } from "react";
// import MoreVert from "@mui/icons-material/MoreVert";
// import Search from "@mui/icons-material/Search";
// import HelpOutline from "@mui/icons-material/HelpOutline";
// import TrendingUp from "@mui/icons-material/TrendingUp";
// import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
// import MoreHoriz from "@mui/icons-material/MoreHoriz";
// import ErrorOutline from "@mui/icons-material/ErrorOutline";
// import Tune from "@mui/icons-material/Tune";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Badge,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   IconButton,
//   List,
//   ListItem,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   Stack,
//   Tab,
//   Tabs,
//   TextField,
//   Typography,
//   useTheme,
//   useMediaQuery,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CssBaseline,
//   Popover,
//   Tooltip,
//   Slider,
// } from "@mui/material";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RTooltip,
//   ReferenceLine,
//   LabelList,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";

// // 🔗 Compare view (default export)
// import NewRecommendationScreen from "./ScenarioSimulation";

// /* ===== Shared sizing for both graphs ===== */
// const GRAPH_HEIGHT = 220;

// /* =====================  DATA & UTILS  ===================== */

// const scenariosData = [
//   {
//     id: 1,
//     title: "Sudden Spike in Demand",
//     description: "30% increase due to marketing campaign",
//     type: "Demand",
//     change: "+30%",
//     duration: "3 Months",
//     isSelected: true,
//     typeColor: "info",
//   },
//   {
//     id: 2,
//     title: "Sudden Drop in Demand",
//     description: "20% drop due to economic slowdown",
//     type: "Demand",
//     change: "-20%",
//     duration: "6 Months",
//     isSelected: false,
//     typeColor: "info",
//   },
//   {
//     id: 3,
//     title: "New Market Expansion",
//     description: "Launch in new region with 40% uplift",
//     type: "Demand",
//     change: "+40%",
//     duration: "12 Months",
//     isSelected: false,
//     typeColor: "info",
//   },
//   {
//     id: 4,
//     title: "Supplier Disruption",
//     description: "Unfulfilled demand due to raw material shortage",
//     type: "Supply",
//     change: "-15%",
//     duration: "4 Months",
//     isSelected: false,
//     typeColor: "error",
//   },
//   {
//     id: 5,
//     title: "Price Change Impact",
//     description: "10% price increase affects demand",
//     type: "Price",
//     change: "-12%",
//     duration: "6 Months",
//     isSelected: false,
//     typeColor: "success",
//   },
//   {
//     id: 6,
//     title: "New Product Introduction",
//     description: "25% cannibalization + 35% new demand",
//     type: "Product",
//     change: "+10%",
//     duration: "9 Months",
//     isSelected: false,
//     typeColor: "primary",
//   },
//   {
//     id: 7,
//     title: "Promotions & Discount",
//     description: "Flash sale increases demand by 50%",
//     type: "Demand",
//     change: "+50%",
//     duration: "1 Months",
//     isSelected: false,
//     typeColor: "info",
//   },
//   {
//     id: 8,
//     title: "Change in Lead Time",
//     description: "Lead time increase affects availability",
//     type: "Supply",
//     change: "-8%",
//     duration: "8 Months",
//     isSelected: false,
//     typeColor: "error",
//   },
//   {
//     id: 9,
//     title: "Production Constraints",
//     description: "30% capacity reduction",
//     type: "Supply",
//     change: "-30%",
//     duration: "2 Months",
//     isSelected: false,
//     typeColor: "error",
//   },
// ];

// const card = {
//   backgroundColor: "#fff",
//   border: 1,
//   borderColor: "grey.300",
//   borderRadius: 1,
//   overflow: "hidden",
// };

// const locationData = [
//   { label: "Location:", value: "Rajkot" },
//   { label: "Current Inventory:", value: "4567" },
//   { label: "Next week demand:", value: "5879" },
// ];

// const legendItems = [
//   {
//     id: "actual",
//     label: "Actual",
//     indicator: <FiberManualRecord sx={{ fontSize: 10, color: "#0891b2" }} />,
//   },
//   {
//     id: "forecast",
//     label: "Forecast",
//     indicator: <MoreHoriz sx={{ fontSize: 15, color: "#64748b" }} />,
//   },
// ];

// const disruptionSeed = [
//   {
//     id: 101,
//     checked: false,
//     date: new Date(2025, 7, 22, 12, 34),
//     message:
//       "Rajkot (RAJ182) - Sweet Mixes (C5050500D): Unexpected regional event.",
//   },
//   {
//     id: 102,
//     checked: true,
//     date: new Date(2025, 6, 18, 16, 30),
//     message:
//       "Hyderabad (HYD543) - RTE - Soup Pack (Veg) (C46602008): Weather event.",
//   },
// ];

// const formatDateTime = (d) => {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mon = months[d.getMonth()];
//   const yyyy = d.getFullYear();
//   let hh = d.getHours();
//   const mm = String(d.getMinutes()).padStart(2, "0");
//   const ampm = hh >= 12 ? "PM" : "AM";
//   hh = hh % 12;
//   if (hh === 0) hh = 12;
//   const hhStr = String(hh).padStart(2, "0");
//   return `${dd} ${mon}, ${yyyy} ${hhStr}:${mm}${ampm}`;
// };

// const fmtNum = (n) => n.toLocaleString("en-IN");

// /* =====================  SIDEBAR  ===================== */

// function SidebarBox({ selectedScenario, setSelectedScenario }) {
//   const getTypeChipColor = (typeColor) => {
//     switch (typeColor) {
//       case "info":
//         return { backgroundColor: "#2196f3", color: "white" };
//       case "error":
//         return { backgroundColor: "#ff9800", color: "white" };
//       case "success":
//         return { backgroundColor: "#4caf50", color: "white" };
//       case "primary":
//         return { backgroundColor: "#9c27b0", color: "white" };
//       default:
//         return { backgroundColor: "#f5f5f5", color: "#424242" };
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: { xs: 280, sm: 300, md: 320 },
//         ...card,
//         flexShrink: 0,
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Box
//         sx={{
//           p: 1.5,
//           backgroundColor: "#f8f9fa",
//           borderBottom: 1,
//           borderColor: "grey.300",
//         }}
//       >
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Stack spacing={0.5}>
//             <Stack direction="row" spacing={0.5} alignItems="center">
//               <HelpOutline sx={{ fontSize: 14, color: "#666" }} />
//               <Typography variant="body2" fontSize={13} fontWeight={600}>
//                 What-If Scenarios?
//               </Typography>
//             </Stack>
//             <Typography variant="caption" color="#999" sx={{ fontSize: 11 }}>
//               Select a scenario to analyze its impact on demand planning.
//             </Typography>
//           </Stack>
//           <IconButton size="small">
//             <MoreVert sx={{ fontSize: 16, color: "#1976d2" }} />
//           </IconButton>
//         </Stack>
//       </Box>

//       <Box sx={{ p: 1, borderBottom: 1, borderColor: "grey.300" }}>
//         <TextField
//           placeholder="Search scenarios"
//           variant="outlined"
//           size="small"
//           fullWidth
//           InputProps={{
//             startAdornment: (
//               <Search sx={{ fontSize: 16, color: "#999", mr: 1 }} />
//             ),
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": { borderRadius: 2 },
//             "& input": { fontSize: 12 },
//           }}
//         />
//       </Box>

//       <Box sx={{ flex: 1, overflow: "auto" }}>
//         <List sx={{ p: 0 }}>
//           {scenariosData.map((s) => (
//             <ListItem
//               key={s.id}
//               onClick={() => setSelectedScenario(s)}
//               sx={{
//                 cursor: "pointer",
//                 backgroundColor:
//                   selectedScenario?.id === s.id ? "#e3f2fd" : "transparent",
//                 borderLeft:
//                   selectedScenario?.id === s.id ? "3px solid #1976d2" : "none",
//                 "&:hover": { backgroundColor: "#f5f5f5" },
//                 borderBottom: "1px solid #f0f0f0",
//                 alignItems: "flex-start",
//                 p: 1,
//               }}
//             >
//               <Stack sx={{ flex: 1 }} spacing={0.5}>
//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   alignItems="flex-start"
//                 >
//                   <Stack spacing={0.5} sx={{ flex: 1 }}>
//                     <Stack direction="row" spacing={0.5} alignItems="center">
//                       <TrendingUp sx={{ fontSize: 12, color: "#666" }} />
//                       <Typography
//                         variant="body2"
//                         sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}
//                       >
//                         {s.title}
//                       </Typography>
//                     </Stack>
//                     <Typography
//                       variant="caption"
//                       color="#666"
//                       sx={{ fontSize: 11, lineHeight: 1.2 }}
//                     >
//                       {s.description}
//                     </Typography>
//                   </Stack>
//                   <IconButton size="small" sx={{ mt: -0.5 }}>
//                     <MoreVert sx={{ fontSize: 14 }} />
//                   </IconButton>
//                 </Stack>
//                 <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
//                   <Chip
//                     label={s.type}
//                     size="small"
//                     sx={{
//                       ...getTypeChipColor(s.typeColor),
//                       fontSize: 9,
//                       fontWeight: 500,
//                       height: 18,
//                     }}
//                   />
//                   <Chip
//                     label={s.change}
//                     size="small"
//                     sx={{
//                       backgroundColor: "#f5f5f5",
//                       color: "#424242",
//                       fontSize: 9,
//                       fontWeight: 500,
//                       height: 18,
//                     }}
//                   />
//                   <Chip
//                     label={s.duration}
//                     size="small"
//                     sx={{
//                       backgroundColor: "#f5f5f5",
//                       color: "#424242",
//                       fontSize: 9,
//                       fontWeight: 500,
//                       height: 18,
//                     }}
//                   />
//                 </Stack>
//               </Stack>
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//     </Box>
//   );
// }

// /* =====================  TOP CHARTS CARD  ===================== */

// function ChartSection({ selectedSku, setSelectedSku }) {
//   const labelSx = { fontWeight: 600, color: "#475569", fontSize: 12 };
//   const valueSx = { color: "#475569", fontSize: 12, ml: 0.5 };
//   const pillGap = 1.25;

//   return (
//     <Stack spacing={1.25} sx={{ p: 1.25 }}>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: pillGap,
//           flexWrap: "nowrap",
//           overflowX: "auto",
//           pb: 0.25,
//         }}
//       >
//         {locationData.map((item, idx) => (
//           <Box
//             key={idx}
//             sx={{
//               display: "inline-flex",
//               alignItems: "center",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {idx > 0 && (
//               <Divider
//                 orientation="vertical"
//                 flexItem
//                 sx={{ mx: 1, height: 16, alignSelf: "center" }}
//               />
//             )}
//             <Typography variant="body2" sx={labelSx}>
//               {item.label}
//             </Typography>
//             <Typography variant="body2" sx={valueSx}>
//               {item.value}
//             </Typography>
//           </Box>
//         ))}

//         <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16 }} />

//         <Box
//           sx={{
//             display: "inline-flex",
//             alignItems: "center",
//             whiteSpace: "nowrap",
//             gap: 0.5,
//           }}
//         >
//           <Typography variant="body2" sx={labelSx}>
//             SKU:
//           </Typography>
//           <FormControl size="small">
//             <Select
//               value={selectedSku}
//               onChange={(e) => setSelectedSku(e.target.value)}
//               sx={{
//                 height: 24,
//                 width: 110,
//                 "& .MuiSelect-select": {
//                   p: "2px 8px",
//                   fontSize: 12,
//                   color: "#2563eb",
//                   textDecoration: "underline",
//                 },
//                 "& .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#cbd5e1",
//                   borderRadius: "3px",
//                 },
//               }}
//             >
//               <MenuItem value="C5020160">C5020160</MenuItem>
//               <MenuItem value="C5050500D">C5050500D</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//       </Box>

//       <Stack direction="row" spacing={1} flexWrap="wrap">
//         {legendItems.map((item) => (
//           <Chip
//             key={item.id}
//             icon={item.indicator}
//             label={item.label}
//             variant="outlined"
//             sx={{
//               backgroundColor: "#eff6ff",
//               borderColor: "#cbd5e1",
//               borderRadius: "5px",
//               height: 26,
//               "& .MuiChip-label": { fontSize: 12, color: "#475569" },
//               "& .MuiChip-icon": { ml: "8px", "& svg": { fontSize: 12 } },
//             }}
//           />
//         ))}
//       </Stack>
//     </Stack>
//   );
// }

// function DisruptionList() {
//   const [rows, setRows] = useState(disruptionSeed);
//   const toggle = (id) =>
//     setRows((prev) =>
//       prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
//     );

//   return (
//     <Box sx={{ px: 1.25, py: 1 }}>
//       <Stack spacing={0.5}>
//         {rows.map((r) => (
//           <Box
//             key={r.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               px: 1,
//               py: 0.75,
//               borderRadius: 1,
//               "&:hover": { backgroundColor: "rgba(2,6,23,0.03)" },
//             }}
//           >
//             <Checkbox
//               size="small"
//               checked={r.checked}
//               onChange={() => toggle(r.id)}
//               sx={{ p: 0.5, mr: 0.5 }}
//             />
//             <Typography
//               variant="body2"
//               sx={{
//                 fontWeight: 600,
//                 color: "#334155",
//                 minWidth: 175,
//                 fontSize: 12.5,
//                 textDecoration: r.checked ? "line-through" : "none",
//               }}
//             >
//               {formatDateTime(r.date)}
//             </Typography>
//             <ErrorOutline sx={{ color: "#ef4444", fontSize: 18, mr: 0.5 }} />
//             <Typography
//               variant="body2"
//               sx={{
//                 color: "#334155",
//                 fontSize: 13,
//                 textDecoration: r.checked ? "line-through" : "none",
//               }}
//             >
//               {r.message}
//             </Typography>
//           </Box>
//         ))}
//       </Stack>
//     </Box>
//   );
// }

// function ForecastChartBox() {
//   const [selectedSku, setSelectedSku] = useState("C5050500D");
//   const [mainTabValue, setMainTabValue] = useState(0);

//   const weekData = {
//     categories: [
//       "Week 33",
//       "Week 34",
//       "Week 35",
//       "Week 36",
//       "Week 37",
//       "Week 38",
//       "Week 39",
//       "Week 40",
//     ],
//     actual: [4, 5, 11, 15, null, null, null, null],
//     forecast: [null, null, null, 28, 12, 11, 7, 13],
//     highlightIndex: 3,
//   };

//   const options = useMemo(
//     () => ({
//       chart: {
//         type: "line",
//         spacing: [4, 6, 6, 6],
//         reflow: true,
//         height: GRAPH_HEIGHT,
//       },
//       title: { text: "" },
//       credits: { enabled: false },
//       exporting: { enabled: false },
//       legend: { enabled: false },
//       xAxis: {
//         categories: weekData.categories,
//         tickLength: 0,
//         lineColor: "#e5e7eb",
//         gridLineWidth: 1,
//         gridLineColor: "#eef2f7",
//         crosshair: { width: 1, color: "#94a3b8" },
//         plotBands: [
//           {
//             from: weekData.highlightIndex - 0.3,
//             to: weekData.highlightIndex + 0.3,
//             color: "rgba(244,63,94,0.25)",
//             zIndex: 0,
//           },
//         ],
//         labels: { style: { fontSize: "11px" } },
//       },
//       yAxis: {
//         title: {
//           text: "Units (in thousands)",
//           style: { color: "#64748b", fontSize: "12px" },
//         },
//         min: 0,
//         tickInterval: 5,
//         gridLineColor: "#e5e7eb",
//         labels: { style: { fontSize: "11px" } },
//       },
//       tooltip: {
//         shared: true,
//         borderRadius: 6,
//         padding: 8,
//         backgroundColor: "#fff",
//         borderColor: "#e5e7eb",
//       },
//       plotOptions: { series: { animation: false, marker: { radius: 3 } } },
//       series: [
//         {
//           name: "Actual",
//           data: weekData.actual,
//           color: "#0f766e",
//           lineWidth: 2.5,
//           dashStyle: "Solid",
//           zIndex: 2,
//         },
//         {
//           name: "Forecast",
//           data: weekData.forecast,
//           color: "#0f766e",
//           lineWidth: 2.5,
//           dashStyle: "ShortDot",
//           marker: { enabled: false },
//           opacity: 0.9,
//           zIndex: 1,
//         },
//       ],
//       accessibility: { enabled: false },
//     }),
//     []
//   );

//   return (
//     <Box
//       sx={{
//         ...card,
//         width: "100%",
//         minWidth: 0,
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Box
//         sx={{
//           borderBottom: 1,
//           borderColor: "grey.300",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           sx={{ px: 2, py: 1 }}
//         >
//           <Tabs value={mainTabValue} onChange={(_, v) => setMainTabValue(v)}>
//             <Tab
//               label="Demand"
//               sx={{
//                 textTransform: "none",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 minHeight: 36,
//                 px: 2,
//               }}
//             />
//             <Tab
//               label={
//                 <Stack direction="row" spacing={0.5} alignItems="center">
//                   <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
//                     Disruption
//                   </Typography>
//                   <Badge
//                     badgeContent={disruptionSeed.length}
//                     color="error"
//                     sx={{
//                       "& .MuiBadge-badge": {
//                         fontSize: 9,
//                         height: 16,
//                         minWidth: 16,
//                       },
//                     }}
//                   />
//                 </Stack>
//               }
//               sx={{ textTransform: "none", minHeight: 36, px: 2 }}
//             />
//           </Tabs>
//           <Stack direction="row" spacing={0.5}>
//             <IconButton size="small">
//               <MoreVert fontSize="small" />
//             </IconButton>
//           </Stack>
//         </Stack>
//       </Box>

//       {mainTabValue === 0 ? (
//         <>
//           <ChartSection
//             selectedSku={selectedSku}
//             setSelectedSku={setSelectedSku}
//           />
//           <Box sx={{ px: 1.25, pb: 2, flex: 1, minHeight: GRAPH_HEIGHT }}>
//             <Box sx={{ width: "100%", height: GRAPH_HEIGHT }}>
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={options}
//                 containerProps={{ style: { width: "100%", height: "100%" } }}
//               />
//             </Box>
//           </Box>
//           <Divider sx={{ mx: 1, mb: 1 }} />
//         </>
//       ) : (
//         <DisruptionList />
//       )}
//     </Box>
//   );
// }

// /* =====================  CITY CARD  ===================== */

// const thCell = {
//   fontWeight: 700,
//   fontSize: 13,
//   color: "#334155",
//   backgroundColor: "#eef2f7",
//   borderColor: "#e5e7eb",
// };
// const tdCell = {
//   fontSize: 13,
//   color: "#374151",
//   borderColor: "#e5e7eb",
//   whiteSpace: "nowrap",
// };
// const tdCellLeft = { ...tdCell, minWidth: 160 };
// const subHdr = {
//   fontWeight: 500,
//   color: "#64748b",
//   fontSize: 11,
//   marginLeft: 4,
// };

// /* Match first graph’s legend look here too */
// const LegendSwatch = ({ type, color }) => {
//   if (type === "dot")
//     return (
//       <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
//     );
//   return (
//     <Box
//       sx={{
//         width: 18,
//         height: 2,
//         background: `repeating-linear-gradient(to right, ${color} 0px, ${color} 4px, transparent 4px, transparent 6px)`,
//       }}
//     />
//   );
// };

// const CityLegendChip = ({ label, color, type = "dot" }) => (
//   <Chip
//     icon={
//       <Box
//         sx={{
//           width: 16,
//           height: 12,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <LegendSwatch type={type} color={color} />
//       </Box>
//     }
//     label={label}
//     variant="outlined"
//     sx={{
//       backgroundColor: "#eff6ff",
//       borderColor: "#cbd5e1",
//       borderRadius: "5px",
//       height: 26,
//       "& .MuiChip-label": { fontSize: 12, color: "#475569" },
//       "& .MuiChip-icon": { ml: "8px" },
//     }}
//   />
// );

// function DemandByCityCard() {
//   const [tab, setTab] = useState(0);
//   const yellow = "#fbbf24",
//     red = "#ef4444",
//     green = "#22c55e";
//   const categories = [
//     "Week 1",
//     "Week 2",
//     "Week 3",
//     "Week 4",
//     "Week 5",
//     "Week 6",
//     "Week 7",
//     "Week 8",
//   ];

//   const series = [
//     {
//       name: "Bhuj (Actual)",
//       color: yellow,
//       dashStyle: "Solid",
//       data: [6, 7, 11, 18, null, null, null, null],
//       zIndex: 3,
//     },
//     {
//       name: "Ahmedabad (Actual)",
//       color: red,
//       dashStyle: "Solid",
//       data: [12, 10, 6, 12, null, null, null, null],
//       zIndex: 3,
//     },
//     {
//       name: "Bhavnagar (Actual)",
//       color: green,
//       dashStyle: "Solid",
//       data: [16, 14, 11, 10, null, null, null, null],
//       zIndex: 3,
//     },
//     {
//       name: "Bhuj (Forecast)",
//       color: yellow,
//       dashStyle: "ShortDot",
//       data: [null, null, null, 18, 8, 12, 9, 14],
//       marker: { enabled: false },
//       zIndex: 2,
//     },
//     {
//       name: "Ahmedabad (Forecast)",
//       color: red,
//       dashStyle: "ShortDot",
//       data: [null, null, null, 11, 12, 16, 14, 16],
//       marker: { enabled: false },
//       zIndex: 2,
//     },
//     {
//       name: "Bhavnagar (Forecast)",
//       color: green,
//       dashStyle: "ShortDot",
//       data: [null, null, null, 10, 12, 11, 13, 20],
//       marker: { enabled: false },
//       zIndex: 2,
//     },
//   ];

//   const options = {
//     chart: {
//       type: "line",
//       spacing: [4, 6, 6, 6],
//       reflow: true,
//       height: GRAPH_HEIGHT,
//     },
//     title: { text: "" },
//     credits: { enabled: false },
//     exporting: { enabled: false },
//     legend: { enabled: false },
//     xAxis: {
//       categories,
//       tickLength: 0,
//       lineColor: "#e5e7eb",
//       gridLineWidth: 1,
//       gridLineColor: "#eef2f7",
//       labels: { style: { color: "#64748b", fontSize: "11px" } },
//     },
//     yAxis: {
//       title: {
//         text: "Units (in thousands)",
//         style: { color: "#64748b", fontSize: "12px" },
//       },
//       min: 0,
//       max: 35,
//       tickInterval: 5,
//       gridLineColor: "#e5e7eb",
//       labels: { style: { fontSize: "11px" } },
//     },
//     tooltip: {
//       shared: true,
//       borderRadius: 6,
//       padding: 8,
//       backgroundColor: "#fff",
//       borderColor: "#e5e7eb",
//     },
//     plotOptions: {
//       series: { animation: false, lineWidth: 2.5, marker: { radius: 3 } },
//     },
//     series,
//     accessibility: { enabled: false },
//   };

//   const cityDefs = [
//     { label: "Bhuj", color: yellow },
//     { label: "Ahmedabad", color: red },
//     { label: "Bhavnagar", color: green },
//   ];

//   const tableRows = [
//     {
//       id: "bhuj",
//       location: "Bhuj",
//       recommended: true,
//       distance: 197,
//       available: 15617,
//       demand: 7112,
//       safety: 10668,
//       excess: 4949,
//       eta: 4,
//     },
//     {
//       id: "ahm",
//       location: "Ahmedabad",
//       recommended: false,
//       distance: 263,
//       available: 16873,
//       demand: 7891,
//       safety: 11836,
//       excess: 5036,
//       eta: 6,
//     },
//     {
//       id: "bhv",
//       location: "Bhavnagar",
//       recommended: false,
//       distance: 317,
//       available: 18555,
//       demand: 8943,
//       safety: 13414,
//       excess: 5140,
//       eta: 8,
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         ...card,
//         width: "100%",
//         minWidth: 0,
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Box sx={{ px: 1.5, pt: 1, borderBottom: 1, borderColor: "grey.200" }}>
//         <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36 }}>
//           <Tab
//             label="Graph"
//             sx={{ textTransform: "none", minHeight: 36, fontSize: 13 }}
//           />
//           <Tab
//             label="Data Table"
//             sx={{ textTransform: "none", minHeight: 36, fontSize: 13 }}
//           />
//         </Tabs>
//       </Box>

//       <Box
//         sx={{
//           p: 2,
//           flex: 1,
//           minHeight: 0,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
//           Demand
//         </Typography>

//         {tab === 0 ? (
//           <>
//             <Stack
//               direction="row"
//               spacing={1}
//               alignItems="center"
//               flexWrap="wrap"
//               sx={{ mb: 1 }}
//             >
//               {cityDefs.map((c) => (
//                 <CityLegendChip
//                   key={`${c.label}-actual`}
//                   label={c.label}
//                   color={c.color}
//                   type="dot"
//                 />
//               ))}
//               {cityDefs.map((c) => (
//                 <CityLegendChip
//                   key={`${c.label}-forecast`}
//                   label={c.label}
//                   color={c.color}
//                   type="dash"
//                 />
//               ))}
//             </Stack>

//             <Box sx={{ flex: 1, minHeight: GRAPH_HEIGHT }}>
//               <Box sx={{ width: "100%", height: GRAPH_HEIGHT }}>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={options}
//                   containerProps={{ style: { width: "100%", height: "100%" } }}
//                 />
//               </Box>
//             </Box>
//           </>
//         ) : (
//           <TableContainer
//             sx={{
//               border: 1,
//               borderColor: "#e5e7eb",
//               borderRadius: 1,
//               flex: 1,
//               overflow: "auto",
//             }}
//           >
//             <Table size="small" stickyHeader>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#eef2f7" }}>
//                   <TableCell sx={thCell}>Location</TableCell>
//                   <TableCell sx={thCell} align="right">
//                     Distance<span style={subHdr}>(km)</span>
//                   </TableCell>
//                   <TableCell sx={thCell} align="right">
//                     Available Qty
//                   </TableCell>
//                   <TableCell sx={thCell} align="right">
//                     Demand <span style={subHdr}>(Next Week)</span>
//                   </TableCell>
//                   <TableCell sx={thCell} align="right">
//                     Safety Stock
//                   </TableCell>
//                   <TableCell sx={thCell} align="right">
//                     Excess Qty
//                   </TableCell>
//                   <TableCell sx={thCell} align="right">
//                     ETA <span style={subHdr}>(Hours)</span>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {tableRows.map((r) => (
//                   <TableRow
//                     key={r.id}
//                     sx={{
//                       "& td": { borderColor: "#e5e7eb" },
//                       backgroundColor: r.recommended
//                         ? "rgba(37,99,235,0.08)"
//                         : "transparent",
//                     }}
//                   >
//                     <TableCell sx={tdCellLeft}>
//                       <Typography sx={{ fontSize: 13, color: "#111827" }}>
//                         {r.location}
//                         {r.recommended && (
//                           <Typography
//                             component="span"
//                             sx={{ color: "#2563eb", fontSize: 12, ml: 0.5 }}
//                           >
//                             (Recommended)
//                           </Typography>
//                         )}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={tdCell} align="right">
//                       {fmtNum(r.distance)}
//                     </TableCell>
//                     <TableCell sx={tdCell} align="right">
//                       {fmtNum(r.available)}
//                     </TableCell>
//                     <TableCell sx={tdCell} align="right">
//                       {fmtNum(r.demand)}
//                     </TableCell>
//                     <TableCell sx={tdCell} align="right">
//                       {fmtNum(r.safety)}
//                     </TableCell>
//                     <TableCell sx={tdCell} align="right">
//                       {fmtNum(r.excess)}
//                     </TableCell>
//                     <TableCell sx={tdCell} align="right">
//                       {fmtNum(r.eta)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// }

// /* =====================  RIGHT PANEL (helpers)  ===================== */

// // === Clean rounding helpers ===
// const to1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
// const lakhLabel = (n) => `₹${to1(n)}L`;

// function buildWaterfall(
//   steps,
//   includeTotal = true,
//   totalLabel = "Simulated Revenue"
// ) {
//   let running = 0;
//   const out = [];
//   steps.forEach((st, idx) => {
//     const val = to1(st.value);
//     if (idx === 0) {
//       running = val;
//       out.push({
//         name: st.name,
//         base: 0,
//         delta: Math.abs(val),
//         raw: val,
//         kind: "base",
//         cumulative: to1(running),
//       });
//       return;
//     }
//     const next = to1(running + val);
//     const base = Math.min(running, next);
//     out.push({
//         name: st.name,
//         base,
//         delta: Math.abs(val),
//         raw: val,
//         kind: val >= 0 ? "pos" : "neg",
//         cumulative: next,
//       });
//     running = next;
//   });
//   if (includeTotal) {
//     const total = to1(running);
//     out.push({
//       name: totalLabel,
//       base: 0,
//       delta: Math.abs(total),
//       raw: total,
//       kind: "total",
//       cumulative: total,
//     });
//   }
//   return out;
// }
// const barFill = (d) =>
//   d.kind === "total" ? "#60a5fa" : d.raw >= 0 ? "#22c55e" : "#ef4444";

// // Split label after the first word (rest goes to line 2)
// const WfTick = ({ x, y, payload }) => {
//   const value = String(payload.value || "");
//   const [first, ...rest] = value.split(" ");
//   const second = rest.join(" ");
//   const lines = second ? [first, second] : [first];

//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text textAnchor="middle" fill="#475569" fontSize={11}>
//         {lines.map((ln, i) => (
//           <tspan key={i} x="0" dy={i === 0 ? 0 : 12}>
//             {ln}
//           </tspan>
//         ))}
//       </text>
//     </g>
//   );
// };

// /* Small metric tiles used inside cards */
// function MetricTile({ title, value, delta }) {
//   const isDown = (delta || "").trim().startsWith("-");
//   return (
//     <Card
//       sx={{ boxShadow: 0, border: "1px solid #e5e7eb", background: "#fff" }}
//     >
//       <CardContent sx={{ p: 1.25 }}>
//         <Typography
//           variant="body2"
//           sx={{ fontSize: 11, color: "#64748b", mb: 0.5 }}
//         >
//           {title}
//         </Typography>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
//             {value}
//           </Typography>
//           {delta && (
//             <Typography
//               sx={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: isDown ? "#b91c1c" : "#16a34a",
//               }}
//             >
//               {isDown ? "▼" : "▲"} {delta.replace("-", "")}
//             </Typography>
//           )}
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// /* =====================  RIGHT PANEL (component)  ===================== */

// function RecommendationBox({ onCompare }) {
//   const [recommendationType, setRecommendationType] = useState("recommended");
//   const [summaryTabValue, setSummaryTabValue] = useState(0);

//   // ▶︎ settings popover state (only for Customize)
//   const [anchorEl, setAnchorEl] = useState(null);
//   const settingsOpen = Boolean(anchorEl);

//   // ▶︎ customize values (live mirror of the sliders)
//   const [custom, setCustom] = useState({ bhuj: 2000, ahm: 456, bhv: 0 });
//   const LIMITS = {
//     bhuj: { min: 500, max: 5036, label: "Bhuj" },
//     ahm: { min: 500, max: 5036, label: "Ahmedabad" },
//     bhv: { min: 500, max: 5036, label: "Bhavnagar" },
//   };

//   // Recommended baseline (what your left card shows)
//   const RECO_QTY = 2456;

//   // Baseline step values (in ₹ Lakhs) corresponding to RECO_QTY
//   const BASELINE_STEPS = [
//     { name: "Projected Revenue", value: 4 },
//     { name: "Additional Revenue", value: 2.5 },
//     { name: "Logistic Cost", value: -1 },
//     { name: "Handling Cost", value: -0.5 },
//     { name: "Transaction Cost", value: -0.5 },
//   ];

//   // Scale baseline steps by a quantity multiplier so the waterfall reflects total Qty
//   const stepsForQty = (qty) => {
//     const mult = qty <= 0 ? 0 : qty / RECO_QTY;
//     return BASELINE_STEPS.map((s) => ({ ...s, value: to1(s.value * mult) }));
//   };

//   const openSettings = (e) => setAnchorEl(e.currentTarget);
//   const closeSettings = () => setAnchorEl(null);

//   // close popover if switching away from customize
//   useMemo(() => {
//     if (recommendationType !== "customize") closeSettings();
//   }, [recommendationType]);

//   const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString("en-IN") : "");
//   const parse = (val) => {
//     const cleaned = String(val).replace(/,/g, "");
//     const num = Number(cleaned);
//     return Number.isFinite(num) ? num : 0;
//   };

//   // ===== Waterfall data source (Recommended vs Customized) =====
//   const totalCustomQty = custom.bhuj + custom.ahm + custom.bhv;
//   const usingCustomized = recommendationType === "customize";
//   const qtyFeedingChart = usingCustomized ? totalCustomQty : RECO_QTY;
//   const stepsFeedingChart = useMemo(
//     () => stepsForQty(qtyFeedingChart),
//     [qtyFeedingChart]
//   );
//   const wfData = useMemo(
//     () => buildWaterfall(stepsFeedingChart, true, "Simulated Revenue"),
//     [stepsFeedingChart]
//   );
//   const yDomain = useMemo(() => {
//     const mins = wfData.map((d) => Math.min(d.base, d.base + d.delta));
//     const maxs = wfData.map((d) => Math.max(d.base, d.base + d.delta));
//     const min = Math.min(0, ...mins);
//     const max = Math.max(0, ...maxs);
//     return [min, max];
//   }, [wfData]);

//   // show customized card only when user is on "customize"
//   const showCustomizedCard = usingCustomized;

//   return (
//     <Box
//       sx={{
//         width: { xs: 300, sm: 350, md: 400, lg: 565 },
//         ...card,
//         borderColor: "#cfe1ff",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         flexShrink: 0,
//       }}
//     >
//       <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "grey.300" }}>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           flexWrap="wrap"
//           gap={1}
//         >
//           <Stack direction="row" alignItems="center" gap={0.5}>
//             <RadioGroup
//               value={recommendationType}
//               onChange={(e) => setRecommendationType(e.target.value)}
//               row
//             >
//               <FormControlLabel
//                 value="recommended"
//                 control={<Radio size="small" />}
//                 label={<Typography fontSize={12}>Recommended</Typography>}
//               />
//               <FormControlLabel
//                 value="customize"
//                 control={<Radio size="small" />}
//                 label={<Typography fontSize={12}>Customize</Typography>}
//               />
//             </RadioGroup>

//             {usingCustomized && (
//               <Tooltip title="Adjust quantities">
//                 <IconButton
//                   aria-label="Adjust quantities"
//                   size="small"
//                   onClick={openSettings}
//                   sx={{ ml: 0.5 }}
//                 >
//                   <Tune fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             )}
//           </Stack>

//           <Stack direction="row" spacing={1}>
//             <Button
//               variant="outlined"
//               size="small"
//               sx={{ fontSize: 11, textTransform: "none", py: 0.5, px: 1.5 }}
//               onClick={onCompare}
//             >
//               Compare Simulation
//             </Button>
//             <Button
//               variant="contained"
//               size="small"
//               sx={{ fontSize: 11, textTransform: "none", py: 0.5, px: 1.5 }}
//             >
//               Request Transfer
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>

//       {/* Sliders Popover */}
//       <Popover
//         open={settingsOpen}
//         anchorEl={anchorEl}
//         onClose={closeSettings}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         PaperProps={{
//           sx: {
//             p: 1,
//             borderRadius: 2,
//             boxShadow: "0 8px 24px rgba(0,0,0,.12)",
//             width: 300,
//           },
//         }}
//       >
//         {/* Bhuj */}
//         <Box sx={{ p: 1 }}>
//           <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
//             Bhuj
//           </Typography>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             sx={{ mb: 0.25 }}
//           >
//             <Typography sx={{ fontSize: 11, color: "#64748b" }}>
//               {LIMITS.bhuj.min}
//             </Typography>
//             <Typography sx={{ fontSize: 11, color: "#64748b" }}>
//               {LIMITS.bhuj.max}
//             </Typography>
//           </Stack>
//           <Slider
//             size="small"
//             value={Math.min(
//               Math.max(custom.bhuj, LIMITS.bhuj.min),
//               LIMITS.bhuj.max
//             )}
//             min={LIMITS.bhuj.min}
//             max={LIMITS.bhuj.max}
//             onChange={(_, v) => setCustom((c) => ({ ...c, bhuj: Number(v) }))}
//             sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
//           />
//           <TextField
//             size="small"
//             value={fmt(custom.bhuj)}
//             onChange={(e) =>
//               setCustom((c) => ({ ...c, bhuj: parse(e.target.value) }))
//             }
//             fullWidth
//             sx={{
//               mt: 0.5,
//               "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
//             }}
//           />
//         </Box>

//         <Divider />

//         {/* Ahmedabad */}
//         <Box sx={{ p: 1 }}>
//           <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
//             Ahmedabad
//           </Typography>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             sx={{ mb: 0.25 }}
//           >
//             <Typography sx={{ fontSize: 11, color: "#64748b" }}>
//               {LIMITS.ahm.min}
//             </Typography>
//             <Typography sx={{ fontSize: 11, color: "#64748b" }}>
//               {LIMITS.ahm.max}
//             </Typography>
//           </Stack>
//           <Slider
//             size="small"
//             value={Math.min(
//               Math.max(custom.ahm, LIMITS.ahm.min),
//               LIMITS.ahm.max
//             )}
//             min={LIMITS.ahm.min}
//             max={LIMITS.ahm.max}
//             onChange={(_, v) => setCustom((c) => ({ ...c, ahm: Number(v) }))}
//             sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
//           />
//           <TextField
//             size="small"
//             value={fmt(custom.ahm)}
//             onChange={(e) =>
//               setCustom((c) => ({ ...c, ahm: parse(e.target.value) }))
//             }
//             fullWidth
//             sx={{
//               mt: 0.5,
//               "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
//             }}
//           />
//         </Box>

//         <Divider />

//         {/* Bhavnagar */}
//         <Box sx={{ p: 1 }}>
//           <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
//             Bhavnagar
//           </Typography>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             sx={{ mb: 0.25 }}
//           >
//             <Typography sx={{ fontSize: 11, color: "#64748b" }}>
//               {LIMITS.bhv.min}
//             </Typography>
//             <Typography sx={{ fontSize: 11, color: "#64748b" }}>
//               {LIMITS.bhv.max}
//             </Typography>
//           </Stack>
//           <Slider
//             size="small"
//             value={Math.min(
//               Math.max(custom.bhv, LIMITS.bhv.min),
//               LIMITS.bhv.max
//             )}
//             min={LIMITS.bhv.min}
//             max={LIMITS.bhv.max}
//             onChange={(_, v) => setCustom((c) => ({ ...c, bhv: Number(v) }))}
//             sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
//           />
//           <TextField
//             size="small"
//             value={fmt(custom.bhv)}
//             onChange={(e) =>
//               setCustom((c) => ({ ...c, bhv: parse(e.target.value) }))
//             }
//             fullWidth
//             sx={{
//               mt: 0.5,
//               "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
//             }}
//           />
//         </Box>
//       </Popover>

//       <Box sx={{ borderBottom: 1, borderColor: "grey.300" }}>
//         <Tabs
//           value={summaryTabValue}
//           onChange={(_, v) => setSummaryTabValue(v)}
//         >
//           <Tab
//             label={<Typography fontSize={12}>Summary</Typography>}
//             sx={{ textTransform: "none", minHeight: 36 }}
//           />
//           <Tab
//             label={<Typography fontSize={12}>Details</Typography>}
//             sx={{ textTransform: "none", minHeight: 36 }}
//           />
//         </Tabs>
//       </Box>

//       {/* ===== Summary with side-by-side cards ===== */}
//       <Box sx={{ p: 1.5, overflow: "auto", flex: 1 }}>
//         {summaryTabValue === 0 ? (
//           <Stack direction="row" spacing={1.25} sx={{ alignItems: "stretch" }}>
//             {/* Recommended card (left, blue bg) */}
//             <Card
//               sx={{
//                 flex: 1,
//                 backgroundColor: "#e7f0ff",
//                 border: "1px solid #cfe1ff",
//                 boxShadow: 0,
//               }}
//             >
//               <CardContent sx={{ p: 1.25 }}>
//                 <Typography
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: 14,
//                     color: "#1d4ed8",
//                     mb: 1,
//                   }}
//                 >
//                   Recommended
//                 </Typography>

//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   sx={{ mb: 1 }}
//                 >
//                   <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
//                     Bhuj:
//                   </Typography>
//                   <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
//                     {fmt(RECO_QTY)} Qty
//                   </Typography>
//                 </Stack>

//                 <Stack spacing={1}>
//                   <MetricTile title="Profit" value="₹ 55,750" delta="24%" />
//                   <MetricTile title="ETA" value="22 Jan 25" />
//                 </Stack>
//               </CardContent>
//             </Card>

//             {/* Customized card (right) — appears when Customize is active */}
//             {showCustomizedCard && (
//               <Card
//                 sx={{
//                   flex: 1,
//                   backgroundColor: "#fff",
//                   border: "1px solid #bfdbfe",
//                   boxShadow: 0,
//                 }}
//               >
//                 <CardContent sx={{ p: 1.25 }}>
//                   <Typography
//                     sx={{
//                       fontWeight: 700,
//                       fontSize: 14,
//                       color: "#0f172a",
//                       mb: 1,
//                     }}
//                   >
//                     Customized
//                   </Typography>

//                   <Stack spacing={0.5} sx={{ mb: 1 }}>
//                     {custom.bhuj > 0 && (
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
//                           Bhuj:
//                         </Typography>
//                         <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
//                           {fmt(custom.bhuj)} Qty
//                         </Typography>
//                       </Stack>
//                     )}
//                     {custom.ahm > 0 && (
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
//                           Ahmedabad:
//                         </Typography>
//                         <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
//                           {fmt(custom.ahm)} Qty
//                         </Typography>
//                       </Stack>
//                     )}
//                     {custom.bhv > 0 && (
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
//                           Bhavnagar:
//                         </Typography>
//                         <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
//                           {fmt(custom.bhv)} Qty
//                         </Typography>
//                       </Stack>
//                     )}
//                   </Stack>

//                   <Stack spacing={1}>
//                     <MetricTile title="Profit" value="₹ 55,750" delta="-14%" />
//                     <MetricTile title="ETA" value="22 Jan 25" />
//                   </Stack>
//                 </CardContent>
//               </Card>
//             )}
//           </Stack>
//         ) : (
//           <>
//             {/* Waterfall */}
//             <Card sx={{ mb: 1.5 }}>
//               <CardContent sx={{ p: 1.25 }}>
//                 <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1 }}>
//                   Waterfall • {usingCustomized ? "Customized" : "Recommended"}{" "}
//                   plan • Total Qty: <strong>{fmt(qtyFeedingChart)}</strong>
//                 </Typography>

//                 <Box sx={{ width: "100%", height: 260, mt: 1 }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={wfData}
//                       margin={{ top: 28, right: 16, bottom: 8, left: 12 }}
//                       barCategoryGap={8}
//                     >
//                       <CartesianGrid stroke="#eef2f7" vertical />
//                       <XAxis
//                         dataKey="name"
//                         interval={0}
//                         minTickGap={0}
//                         tickMargin={12}
//                         height={44}
//                         tick={<WfTick />}
//                         axisLine={{ stroke: "#e5e7eb" }}
//                         tickLine={false}
//                       />
//                       <YAxis
//                         domain={yDomain}
//                         tick={{ fontSize: 11, fill: "#475569" }}
//                         axisLine={{ stroke: "#e5e7eb" }}
//                         tickLine={false}
//                         tickFormatter={(v) => `${to1(v)}`}
//                         label={{
//                           value: "₹ in Lakhs",
//                           angle: -90,
//                           position: "insideLeft",
//                           offset: 10,
//                           fill: "#64748b",
//                           fontSize: 11,
//                         }}
//                       />
//                       <ReferenceLine y={0} stroke="#94a3b8" />
//                       <RTooltip
//                         content={({ active, payload, label }) => {
//                           if (!active || !payload?.[0]) return null;
//                           const p = payload[0].payload;
//                           return (
//                             <Box
//                               sx={{
//                                 p: 1,
//                                 bgcolor: "#fff",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: 1,
//                               }}
//                             >
//                               <Typography
//                                 sx={{ fontWeight: 700, fontSize: 12, mb: 0.5 }}
//                               >
//                                 {label}
//                               </Typography>
//                               <Typography sx={{ fontSize: 12, color: "#334155" }}>
//                                 Change: {lakhLabel(p.raw)}
//                               </Typography>
//                               <Typography sx={{ fontSize: 12, color: "#64748b" }}>
//                                 Cumulative: {lakhLabel(p.cumulative)}
//                               </Typography>
//                             </Box>
//                           );
//                         }}
//                       />
//                       <Bar
//                         dataKey="base"
//                         stackId="wf"
//                         fill="transparent"
//                         isAnimationActive={false}
//                         barSize={26}
//                       />
//                       <Bar
//                         dataKey="delta"
//                         stackId="wf"
//                         isAnimationActive={false}
//                         barSize={26}
//                       >
//                         {wfData.map((d, i) => (
//                           <Cell key={i} fill={barFill(d)} />
//                         ))}
//                         <LabelList
//                           dataKey="raw"
//                           position="top"
//                           offset={6}
//                           formatter={(v) => lakhLabel(v)}
//                           style={{
//                             fontSize: 12,
//                             fill: "#111827",
//                             fontWeight: 700,
//                           }}
//                         />
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Big summary card below waterfall */}
//             <Card sx={{ border: 1, borderColor: "#dbeafe", boxShadow: 0 }}>
//               {/* Header strip */}
//               <Box
//                 sx={{
//                   px: 1.5,
//                   py: 1,
//                   bgcolor: "#eaf2ff",
//                   borderBottom: "1px solid #dbeafe",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
//                   Bhuj{" "}
//                   <Typography
//                     component="span"
//                     sx={{ color: "#2563eb", ml: 0.5, fontWeight: 700 }}
//                   >
//                     (Recommended)
//                   </Typography>
//                 </Typography>
//                 <Typography sx={{ fontSize: 13, color: "#334155" }}>
//                   Qty: <strong>{fmt(RECO_QTY)}</strong>
//                 </Typography>
//               </Box>

//               {/* Tiles grid */}
//               <CardContent sx={{ p: 1.25 }}>
//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
//                     gap: 1,
//                   }}
//                 >
//                   <MetricTile title="Profit" value="₹ 55,750" delta="24%" />
//                   <MetricTile title="ETA" value="22 Jan 25" />
//                   <MetricTile title="Logistic Cost" value="₹ 1,02,100" delta="-15%" />
//                   <MetricTile title="Labor/Handling" value="₹ 73,000" delta="-15%" />
//                   <MetricTile title="Transaction Cost" value="₹ 2,55,650" delta="24%" />
//                   <MetricTile title="Total Cost" value="₹ 1,78,650" delta="10%" />
//                   <MetricTile title="Revenue" value="₹ 2,55,650" delta="24%" />
//                 </Box>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// }

// /* =====================  MAIN LAYOUT  ===================== */

// function MainContentSection() {
//   const [selectedScenario, setSelectedScenario] = useState(scenariosData[0]);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // 🔁 Toggle simulation view
//   const [showSim, setShowSim] = useState(false);

//   if (isMobile) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           minHeight: "100vh",
//           p: 1,
//           gap: 1,
//           overflowY: "auto",
//         }}
//       >
//         <SidebarBox
//           selectedScenario={selectedScenario}
//           setSelectedScenario={setSelectedScenario}
//         />
//         {showSim ? (
//           <NewRecommendationScreen onBack={() => setShowSim(false)} />
//         ) : (
//           <>
//             <ForecastChartBox />
//             <DemandByCityCard />
//             <RecommendationBox onCompare={() => setShowSim(true)} />
//           </>
//         )}
//       </Box>
//     );
//   }

//   // Desktop: Sidebar persists; right panel swaps
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "row",
//         minHeight: "100vh",
//         p: 1,
//         gap: 1,
//         overflowY: "auto",
//       }}
//     >
//       <SidebarBox
//         selectedScenario={selectedScenario}
//         setSelectedScenario={setSelectedScenario}
//       />

//       {showSim ? (
//         <Box
//           sx={{
//             flex: 1,
//             minWidth: 0,
//             display: "flex",
//             flexDirection: "column",
//             gap: 1,
//           }}
//         >
//           <NewRecommendationScreen onBack={() => setShowSim(false)} />
//         </Box>
//       ) : (
//         <>
//           <Box
//             sx={{
//               flex: 1,
//               minWidth: 0,
//               display: "flex",
//               flexDirection: "column",
//               gap: 1,
//             }}
//           >
//             <ForecastChartBox />
//             <DemandByCityCard />
//           </Box>
//           <RecommendationBox onCompare={() => setShowSim(true)} />
//         </>
//       )}
//     </Box>
//   );
// }

// /* =====================  ROOT  ===================== */

// export default function DemandMProject() {
//   return (
//     <Box
//       sx={{
//         backgroundColor: "#CBD5E1",
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <CssBaseline />
//       <MainContentSection />
//     </Box>
//   );
// }
import React, { useMemo, useState } from "react";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import HelpOutline from "@mui/icons-material/HelpOutline";
import TrendingUp from "@mui/icons-material/TrendingUp";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Tune from "@mui/icons-material/Tune";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CssBaseline,
  Popover,
  Tooltip,
  Slider,
} from "@mui/material";

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

// 🔗 Compare view (default export)
import NewRecommendationScreen from "./ScenarioSimulation";

/* ===== Shared sizing for both graphs ===== */
const GRAPH_HEIGHT = 220;

/* =====================  DATA & UTILS  ===================== */

const scenariosData = [
  {
    id: 1,
    title: "Sudden Spike in Demand",
    description: "30% increase due to marketing campaign",
    type: "Demand",
    change: "+30%",
    duration: "3 Months",
    isSelected: true,
    typeColor: "info",
  },
  {
    id: 2,
    title: "Sudden Drop in Demand",
    description: "20% drop due to economic slowdown",
    type: "Demand",
    change: "-20%",
    duration: "6 Months",
    isSelected: false,
    typeColor: "info",
  },
  {
    id: 3,
    title: "New Market Expansion",
    description: "Launch in new region with 40% uplift",
    type: "Demand",
    change: "+40%",
    duration: "12 Months",
    isSelected: false,
    typeColor: "info",
  },
  {
    id: 4,
    title: "Supplier Disruption",
    description: "Unfulfilled demand due to raw material shortage",
    type: "Supply",
    change: "-15%",
    duration: "4 Months",
    isSelected: false,
    typeColor: "error",
  },
  {
    id: 5,
    title: "Price Change Impact",
    description: "10% price increase affects demand",
    type: "Price",
    change: "-12%",
    duration: "6 Months",
    isSelected: false,
    typeColor: "success",
  },
  {
    id: 6,
    title: "New Product Introduction",
    description: "25% cannibalization + 35% new demand",
    type: "Product",
    change: "+10%",
    duration: "9 Months",
    isSelected: false,
    typeColor: "primary",
  },
  {
    id: 7,
    title: "Promotions & Discount",
    description: "Flash sale increases demand by 50%",
    type: "Demand",
    change: "+50%",
    duration: "1 Months",
    isSelected: false,
    typeColor: "info",
  },
  {
    id: 8,
    title: "Change in Lead Time",
    description: "Lead time increase affects availability",
    type: "Supply",
    change: "-8%",
    duration: "8 Months",
    isSelected: false,
    typeColor: "error",
  },
  {
    id: 9,
    title: "Production Constraints",
    description: "30% capacity reduction",
    type: "Supply",
    change: "-30%",
    duration: "2 Months",
    isSelected: false,
    typeColor: "error",
  },
];

const card = {
  backgroundColor: "#fff",
  border: 1,
  borderColor: "grey.300",
  borderRadius: 1,
  overflow: "hidden",
};

const locationData = [
  { label: "Location:", value: "Rajkot" },
  { label: "Current Inventory:", value: "4567" },
  { label: "Next week demand:", value: "5879" },
];

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

const disruptionSeed = [
  {
    id: 101,
    checked: false,
    date: new Date(2025, 7, 22, 12, 34),
    message:
      "Rajkot (RAJ182) - Sweet Mixes (C5050500D): Unexpected regional event.",
  },
  {
    id: 102,
    checked: true,
    date: new Date(2025, 6, 18, 16, 30),
    message:
      "Hyderabad (HYD543) - RTE - Soup Pack (Veg) (C46602008): Weather event.",
  },
];

const formatDateTime = (d) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dd = String(d.getDate()).padStart(2, "0");
  const mon = months[d.getMonth()];
  const yyyy = d.getFullYear();
  let hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const hhStr = String(hh).padStart(2, "0");
  return `${dd} ${mon}, ${yyyy} ${hhStr}:${mm}${ampm}`;
};

const fmtNum = (n) => n.toLocaleString("en-IN");

/* =====================  SIDEBAR  ===================== */

function SidebarBox({ selectedScenario, setSelectedScenario }) {
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
        width: { xs: 280, sm: 300, md: 320 },
        ...card,
        flexShrink: 0,
        height: "100%",                 // ✨ fill column
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: "#f8f9fa",
          borderBottom: 1,
          borderColor: "grey.300",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
        </Stack>
      </Box>

      <Box sx={{ p: 1, borderBottom: 1, borderColor: "grey.300" }}>
        <TextField
          placeholder="Search scenarios"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <Search sx={{ fontSize: 16, color: "#999", mr: 1 }} />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
            "& input": { fontSize: 12 },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {scenariosData.map((s) => (
            <ListItem
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              sx={{
                cursor: "pointer",
                backgroundColor:
                  selectedScenario?.id === s.id ? "#e3f2fd" : "transparent",
                borderLeft:
                  selectedScenario?.id === s.id ? "3px solid #1976d2" : "none",
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
                        sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}
                      >
                        {s.title}
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
                      ...getTypeChipColor(s.typeColor),
                      fontSize: 9,
                      fontWeight: 500,
                      height: 18,
                    }}
                  />
                  <Chip
                    label={s.change}
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
      </Box>
    </Box>
  );
}

/* =====================  TOP CHARTS CARD  ===================== */

function ChartSection({ selectedSku, setSelectedSku }) {
  const labelSx = { fontWeight: 600, color: "#475569", fontSize: 12 };
  const valueSx = { color: "#475569", fontSize: 12, ml: 0.5 };
  const pillGap = 1.25;

  return (
    <Stack spacing={1.25} sx={{ p: 1.25 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: pillGap,
          flexWrap: "nowrap",
          overflowX: "auto",
          pb: 0.25,
        }}
      >
        {locationData.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            {idx > 0 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, height: 16, alignSelf: "center" }}
              />
            )}
            <Typography variant="body2" sx={labelSx}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={valueSx}>
              {item.value}
            </Typography>
          </Box>
        ))}

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16 }} />

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            gap: 0.5,
          }}
        >
          <Typography variant="body2" sx={labelSx}>
            SKU:
          </Typography>
          <FormControl size="small">
            <Select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              sx={{
                height: 24,
                width: 110,
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
              <MenuItem value="C5020160">C5020160</MenuItem>
              <MenuItem value="C5050500D">C5050500D</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

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

function DisruptionList() {
  const [rows, setRows] = useState(disruptionSeed);
  const toggle = (id) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
    );

  return (
    <Box sx={{ px: 1.25, py: 1 }}>
      <Stack spacing={0.5}>
        {rows.map((r) => (
          <Box
            key={r.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
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
              {formatDateTime(r.date)}
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
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function ForecastChartBox() {
  const [selectedSku, setSelectedSku] = useState("C5050500D");
  const [mainTabValue, setMainTabValue] = useState(0);

  const weekData = {
    categories: [
      "Week 33",
      "Week 34",
      "Week 35",
      "Week 36",
      "Week 37",
      "Week 38",
      "Week 39",
      "Week 40",
    ],
    actual: [4, 5, 11, 15, null, null, null, null],
    forecast: [null, null, null, 28, 12, 11, 7, 13],
    highlightIndex: 3,
  };

  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        spacing: [4, 6, 6, 6],
        reflow: true,
        height: GRAPH_HEIGHT,
      },
      title: { text: "" },
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: weekData.categories,
        tickLength: 0,
        lineColor: "#e5e7eb",
        gridLineWidth: 1,
        gridLineColor: "#eef2f7",
        crosshair: { width: 1, color: "#94a3b8" },
        plotBands: [
          {
            from: weekData.highlightIndex - 0.3,
            to: weekData.highlightIndex + 0.3,
            color: "rgba(244,63,94,0.25)",
            zIndex: 0,
          },
        ],
        labels: { style: { fontSize: "11px" } },
      },
      yAxis: {
        title: {
          text: "Units (in thousands)",
          style: { color: "#64748b", fontSize: "12px" },
        },
        min: 0,
        tickInterval: 5,
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
          data: weekData.actual,
          color: "#0f766e",
          lineWidth: 2.5,
          dashStyle: "Solid",
          zIndex: 2,
        },
        {
          name: "Forecast",
          data: weekData.forecast,
          color: "#0f766e",
          lineWidth: 2.5,
          dashStyle: "ShortDot",
          marker: { enabled: false },
          opacity: 0.9,
          zIndex: 1,
        },
      ],
      accessibility: { enabled: false },
    }),
    []
  );

  return (
    <Box
      sx={{
        ...card,
        width: "100%",
        minWidth: 0,
        height: "100%",                 // ✨ fill grid row
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "grey.300",
          backgroundColor: "#fff",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, py: 1 }}
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
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    Disruption
                  </Typography>
                  <Badge
                    badgeContent={disruptionSeed.length}
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
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small">
              <MoreVert fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {mainTabValue === 0 ? (
        <>
          <ChartSection
            selectedSku={selectedSku}
            setSelectedSku={setSelectedSku}
          />
          <Box sx={{ px: 1.25, pb: 2, flex: 1, minHeight: 0 }}>
            <Box sx={{ width: "100%", height: "100%" }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { width: "100%", height: "100%" } }}
              />
            </Box>
          </Box>
          <Divider sx={{ mx: 1, mb: 1 }} />
        </>
      ) : (
        <DisruptionList />
      )}
    </Box>
  );
}

/* =====================  CITY CARD  ===================== */

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

/* Match first graph’s legend look here too */
const LegendSwatch = ({ type, color }) => {
  if (type === "dot")
    return (
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
    );
  return (
    <Box
      sx={{
        width: 18,
        height: 2,
        background: `repeating-linear-gradient(to right, ${color} 0px, ${color} 4px, transparent 4px, transparent 6px)`,
      }}
    />
  );
};

const CityLegendChip = ({ label, color, type = "dot" }) => (
  <Chip
    icon={
      <Box
        sx={{
          width: 16,
          height: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LegendSwatch type={type} color={color} />
      </Box>
    }
    label={label}
    variant="outlined"
    sx={{
      backgroundColor: "#eff6ff",
      borderColor: "#cbd5e1",
      borderRadius: "5px",
      height: 26,
      "& .MuiChip-label": { fontSize: 12, color: "#475569" },
      "& .MuiChip-icon": { ml: "8px" },
    }}
  />
);

function DemandByCityCard() {
  const [tab, setTab] = useState(0);
  const yellow = "#fbbf24",
    red = "#ef4444",
    green = "#22c55e";
  const categories = [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Week 6",
    "Week 7",
    "Week 8",
  ];

  const series = [
    {
      name: "Bhuj (Actual)",
      color: yellow,
      dashStyle: "Solid",
      data: [6, 7, 11, 18, null, null, null, null],
      zIndex: 3,
    },
    {
      name: "Ahmedabad (Actual)",
      color: red,
      dashStyle: "Solid",
      data: [12, 10, 6, 12, null, null, null, null],
      zIndex: 3,
    },
    {
      name: "Bhavnagar (Actual)",
      color: green,
      dashStyle: "Solid",
      data: [16, 14, 11, 10, null, null, null, null],
      zIndex: 3,
    },
    {
      name: "Bhuj (Forecast)",
      color: yellow,
      dashStyle: "ShortDot",
      data: [null, null, null, 18, 8, 12, 9, 14],
      marker: { enabled: false },
      zIndex: 2,
    },
    {
      name: "Ahmedabad (Forecast)",
      color: red,
      dashStyle: "ShortDot",
      data: [null, null, null, 11, 12, 16, 14, 16],
      marker: { enabled: false },
      zIndex: 2,
    },
    {
      name: "Bhavnagar (Forecast)",
      color: green,
      dashStyle: "ShortDot",
      data: [null, null, null, 10, 12, 11, 13, 20],
      marker: { enabled: false },
      zIndex: 2,
    },
  ];

  const options = {
    chart: {
      type: "line",
      spacing: [4, 6, 6, 6],
      reflow: true,
      height: GRAPH_HEIGHT,
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
      labels: { style: { color: "#64748b", fontSize: "11px" } },
    },
    yAxis: {
      title: {
        text: "Units (in thousands)",
        style: { color: "#64748b", fontSize: "12px" },
      },
      min: 0,
      max: 35,
      tickInterval: 5,
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
      series: { animation: false, lineWidth: 2.5, marker: { radius: 3 } },
    },
    series,
    accessibility: { enabled: false },
  };

  const cityDefs = [
    { label: "Bhuj", color: yellow },
    { label: "Ahmedabad", color: red },
    { label: "Bhavnagar", color: green },
  ];

  const tableRows = [
    {
      id: "bhuj",
      location: "Bhuj",
      recommended: true,
      distance: 197,
      available: 15617,
      demand: 7112,
      safety: 10668,
      excess: 4949,
      eta: 4,
    },
    {
      id: "ahm",
      location: "Ahmedabad",
      recommended: false,
      distance: 263,
      available: 16873,
      demand: 7891,
      safety: 11836,
      excess: 5036,
      eta: 6,
    },
    {
      id: "bhv",
      location: "Bhavnagar",
      recommended: false,
      distance: 317,
      available: 18555,
      demand: 8943,
      safety: 13414,
      excess: 5140,
      eta: 8,
    },
  ];

  return (
    <Box
      sx={{
        ...card,
        width: "100%",
        minWidth: 0,
        height: "100%",               // ✨ fill grid row
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 1.5, pt: 1, borderBottom: 1, borderColor: "grey.200" }}>
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
      </Box>

      <Box
        sx={{
          p: 2,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
          Demand
        </Typography>

        {tab === 0 ? (
          <>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 1 }}
            >
              {cityDefs.map((c) => (
                <CityLegendChip
                  key={`${c.label}-actual`}
                  label={c.label}
                  color={c.color}
                  type="dot"
                />
              ))}
              {cityDefs.map((c) => (
                <CityLegendChip
                  key={`${c.label}-forecast`}
                  label={c.label}
                  color={c.color}
                  type="dash"
                />
              ))}
            </Stack>

            <Box sx={{ flex: 1, minHeight: 0 }}>
              <Box sx={{ width: "100%", height: "100%" }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  containerProps={{ style: { width: "100%", height: "100%" } }}
                />
              </Box>
            </Box>
          </>
        ) : (
          <TableContainer
            sx={{
              border: 1,
              borderColor: "#e5e7eb",
              borderRadius: 1,
              flex: 1,
              overflow: "auto",
              minHeight: 0,
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
                {tableRows.map((r) => (
                  <TableRow
                    key={r.id}
                    sx={{
                      "& td": { borderColor: "#e5e7eb" },
                      backgroundColor: r.recommended
                        ? "rgba(37,99,235,0.08)"
                        : "transparent",
                    }}
                  >
                    <TableCell sx={tdCellLeft}>
                      <Typography sx={{ fontSize: 13, color: "#111827" }}>
                        {r.location}
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
                      {fmtNum(r.distance)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtNum(r.available)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtNum(r.demand)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtNum(r.safety)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtNum(r.excess)}
                    </TableCell>
                    <TableCell sx={tdCell} align="right">
                      {fmtNum(r.eta)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

/* =====================  RIGHT PANEL (helpers)  ===================== */

// === Clean rounding helpers ===
const to1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
const lakhLabel = (n) => `₹${to1(n)}L`;

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
const barFill = (d) =>
  d.kind === "total" ? "#60a5fa" : d.raw >= 0 ? "#22c55e" : "#ef4444";

// Split label after the first word (rest goes to line 2)
const WfTick = ({ x, y, payload }) => {
  const value = String(payload.value || "");
  const [first, ...rest] = value.split(" ");
  const second = rest.join(" ");
  const lines = second ? [first, second] : [first];

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#475569" fontSize={11}>
        {lines.map((ln, i) => (
          <tspan key={i} x="0" dy={i === 0 ? 0 : 12}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  );
};

/* Small metric tiles used inside cards */
function MetricTile({ title, value, delta }) {
  const isDown = (delta || "").trim().startsWith("-");
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
              {isDown ? "▼" : "▲"} {delta.replace("-", "")}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

/* =====================  RIGHT PANEL (component)  ===================== */

function RecommendationBox({ onCompare }) {
  const [recommendationType, setRecommendationType] = useState("recommended");
  const [summaryTabValue, setSummaryTabValue] = useState(0);

  // ▶︎ settings popover state (only for Customize)
  const [anchorEl, setAnchorEl] = useState(null);
  const settingsOpen = Boolean(anchorEl);

  // ▶︎ customize values (live mirror of the sliders)
  const [custom, setCustom] = useState({ bhuj: 2000, ahm: 456, bhv: 0 });
  const LIMITS = {
    bhuj: { min: 500, max: 5036, label: "Bhuj" },
    ahm: { min: 500, max: 5036, label: "Ahmedabad" },
    bhv: { min: 500, max: 5036, label: "Bhavnagar" },
  };

  // Recommended baseline (what your left card shows)
  const RECO_QTY = 2456;

  // Baseline step values (in ₹ Lakhs) corresponding to RECO_QTY
  const BASELINE_STEPS = [
    { name: "Projected Revenue", value: 4 },
    { name: "Additional Revenue", value: 2.5 },
    { name: "Logistic Cost", value: -1 },
    { name: "Handling Cost", value: -0.5 },
    { name: "Transaction Cost", value: -0.5 },
  ];

  const stepsForQty = (qty) => {
    const mult = qty <= 0 ? 0 : qty / RECO_QTY;
    return BASELINE_STEPS.map((s) => ({ ...s, value: to1(s.value * mult) }));
  };

  const openSettings = (e) => setAnchorEl(e.currentTarget);
  const closeSettings = () => setAnchorEl(null);

  useMemo(() => {
    if (recommendationType !== "customize") closeSettings();
  }, [recommendationType]);

  const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString("en-IN") : "");
  const parse = (val) => {
    const cleaned = String(val).replace(/,/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  const totalCustomQty = custom.bhuj + custom.ahm + custom.bhv;
  const usingCustomized = recommendationType === "customize";
  const qtyFeedingChart = usingCustomized ? totalCustomQty : RECO_QTY;
  const stepsFeedingChart = useMemo(
    () => stepsForQty(qtyFeedingChart),
    [qtyFeedingChart]
  );
  const wfData = useMemo(
    () => buildWaterfall(stepsFeedingChart, true, "Simulated Revenue"),
    [stepsFeedingChart]
  );
  const yDomain = useMemo(() => {
    const mins = wfData.map((d) => Math.min(d.base, d.base + d.delta));
    const maxs = wfData.map((d) => Math.max(d.base, d.base + d.delta));
    const min = Math.min(0, ...mins);
    const max = Math.max(0, ...maxs);
    return [min, max];
  }, [wfData]);

  const showCustomizedCard = usingCustomized;

  return (
    <Box
      sx={{
        width: { xs: 300, sm: 350, md: 400, lg: 565 },
        ...card,
        borderColor: "#cfe1ff",
        height: "100%",                   // ✨ fill column
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "grey.300" }}>
        <Stack
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
                control={<Radio size="small" />}
                label={<Typography fontSize={12}>Recommended</Typography>}
              />
              <FormControlLabel
                value="customize"
                control={<Radio size="small" />}
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
            >
              Request Transfer
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Sliders Popover */}
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
            width: 300,
          },
        }}
      >
        {/* Bhuj */}
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
            Bhuj
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.25 }}
          >
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>
              {LIMITS.bhuj.min}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>
              {LIMITS.bhuj.max}
            </Typography>
          </Stack>
          <Slider
            size="small"
            value={Math.min(
              Math.max(custom.bhuj, LIMITS.bhuj.min),
              LIMITS.bhuj.max
            )}
            min={LIMITS.bhuj.min}
            max={LIMITS.bhuj.max}
            onChange={(_, v) => setCustom((c) => ({ ...c, bhuj: Number(v) }))}
            sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
          />
          <TextField
            size="small"
            value={fmt(custom.bhuj)}
            onChange={(e) =>
              setCustom((c) => ({ ...c, bhuj: parse(e.target.value) }))
            }
            fullWidth
            sx={{
              mt: 0.5,
              "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
            }}
          />
        </Box>

        <Divider />

        {/* Ahmedabad */}
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
            Ahmedabad
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.25 }}
          >
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>
              {LIMITS.ahm.min}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>
              {LIMITS.ahm.max}
            </Typography>
          </Stack>
          <Slider
            size="small"
            value={Math.min(
              Math.max(custom.ahm, LIMITS.ahm.min),
              LIMITS.ahm.max
            )}
            min={LIMITS.ahm.min}
            max={LIMITS.ahm.max}
            onChange={(_, v) => setCustom((c) => ({ ...c, ahm: Number(v) }))}
            sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
          />
          <TextField
            size="small"
            value={fmt(custom.ahm)}
            onChange={(e) =>
              setCustom((c) => ({ ...c, ahm: parse(e.target.value) }))
            }
            fullWidth
            sx={{
              mt: 0.5,
              "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
            }}
          />
        </Box>

        <Divider />

        {/* Bhavnagar */}
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
            Bhavnagar
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.25 }}
          >
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>
              {LIMITS.bhv.min}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>
              {LIMITS.bhv.max}
            </Typography>
          </Stack>
          <Slider
            size="small"
            value={Math.min(
              Math.max(custom.bhv, LIMITS.bhv.min),
              LIMITS.bhv.max
            )}
            min={LIMITS.bhv.min}
            max={LIMITS.bhv.max}
            onChange={(_, v) => setCustom((c) => ({ ...c, bhv: Number(v) }))}
            sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
          />
          <TextField
            size="small"
            value={fmt(custom.bhv)}
            onChange={(e) =>
              setCustom((c) => ({ ...c, bhv: parse(e.target.value) }))
            }
            fullWidth
            sx={{
              mt: 0.5,
              "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
            }}
          />
        </Box>
      </Popover>

      <Box sx={{ borderBottom: 1, borderColor: "grey.300" }}>
        <Tabs
          value={summaryTabValue}
          onChange={(_, v) => setSummaryTabValue(v)}
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
      </Box>

      {/* ===== Summary with side-by-side cards ===== */}
      <Box sx={{ p: 1.5, overflow: "auto", flex: 1, minHeight: 0 }}>
        {summaryTabValue === 0 ? (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "stretch" }}>
            <Card
              sx={{
                flex: 1,
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

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography sx={{ fontSize: 12, color: "#0f172a" }}>
                    Bhuj:
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    {fmt(2456)} Qty
                  </Typography>
                </Stack>

                <Stack spacing={1}>
                  <MetricTile title="Profit" value="₹ 55,750" delta="24%" />
                  <MetricTile title="ETA" value="22 Jan 25" />
                </Stack>
              </CardContent>
            </Card>

            {recommendationType === "customize" && (
              <Card
                sx={{
                  flex: 1,
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

                  <Stack spacing={0.5} sx={{ mb: 1 }}>
                    {/* ...custom qty rows... */}
                  </Stack>

                  <Stack spacing={1}>
                    <MetricTile title="Profit" value="₹ 55,750" delta="-14%" />
                    <MetricTile title="ETA" value="22 Jan 25" />
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        ) : (
          <>
            {/* Waterfall */}
            <Card sx={{ mb: 1.5 }}>
              <CardContent sx={{ p: 1.25 }}>

                <Box sx={{ width: "100%", height: 260, mt: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={wfData}
                      margin={{ top: 28, right: 16, bottom: 8, left: 12 }}
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
                      />
                      <YAxis
                        domain={yDomain}
                        tick={{ fontSize: 11, fill: "#475569" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                        tickFormatter={(v) => `${to1(v)}`}
                        label={{
                          value: "₹ in Lakhs",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <RTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.[0]) return null;
                          const p = payload[0].payload;
                          return (
                            <Box
                              sx={{
                                p: 1,
                                bgcolor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                sx={{ fontWeight: 700, fontSize: 12, mb: 0.5 }}
                              >
                                {label}
                              </Typography>
                              <Typography sx={{ fontSize: 12, color: "#334155" }}>
                                Change: {lakhLabel(p.raw)}
                              </Typography>
                              <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                                Cumulative: {lakhLabel(p.cumulative)}
                              </Typography>
                            </Box>
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
                      <Bar
                        dataKey="delta"
                        stackId="wf"
                        isAnimationActive={false}
                        barSize={26}
                      >
                        {wfData.map((d, i) => (
                          <Cell key={i} fill={barFill(d)} />
                        ))}
                        <LabelList
                          dataKey="raw"
                          position="top"
                          offset={6}
                          formatter={(v) => lakhLabel(v)}
                          style={{
                            fontSize: 12,
                            fill: "#111827",
                            fontWeight: 700,
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            {/* Big summary card below waterfall */}
            <Card sx={{ border: 1, borderColor: "#dbeafe", boxShadow: 0 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  bgcolor: "#eaf2ff",
                  borderBottom: "1px solid #dbeafe",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Bhuj{" "}
                  <Typography
                    component="span"
                    sx={{ color: "#2563eb", ml: 0.5, fontWeight: 700 }}
                  >
                    (Recommended)
                  </Typography>
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#334155" }}>
                  Qty: <strong>{fmt(2456)}</strong>
                </Typography>
              </Box>

              <CardContent sx={{ p: 1.25 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: 1,
                  }}
                >
                  <MetricTile title="Profit" value="₹ 55,750" delta="24%" />
                  <MetricTile title="ETA" value="22 Jan 25" />
                  <MetricTile title="Logistic Cost" value="₹ 1,02,100" delta="-15%" />
                  <MetricTile title="Labor/Handling" value="₹ 73,000" delta="-15%" />
                  <MetricTile title="Transaction Cost" value="₹ 2,55,650" delta="24%" />
                  <MetricTile title="Total Cost" value="₹ 1,78,650" delta="10%" />
                  <MetricTile title="Revenue" value="₹ 2,55,650" delta="24%" />
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}

/* =====================  MAIN LAYOUT  ===================== */

function MainContentSection() {
  const [selectedScenario, setSelectedScenario] = useState(scenariosData[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showSim, setShowSim] = useState(false);

  if (isMobile) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",   // ✨ true-viewport
          p: 1,
          gap: 1,
          overflow: "hidden",
        }}
      >
        <SidebarBox
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
        />
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {showSim ? (
            <NewRecommendationScreen onBack={() => setShowSim(false)} />
          ) : (
            <>
              <ForecastChartBox />
              <Box sx={{ height: 8 }} />
              <DemandByCityCard />
              <Box sx={{ height: 8 }} />
              <RecommendationBox onCompare={() => setShowSim(true)} />
            </>
          )}
        </Box>
      </Box>
    );
  }

  // Desktop
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100dvh",  // ✨ fill viewport
        p: 1,
        gap: 1,
        overflow: "hidden",
      }}
    >
      <SidebarBox
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
      />

      {showSim ? (
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            height: "100%",
            overflow: "auto",
          }}
        >
          <NewRecommendationScreen onBack={() => setShowSim(false)} />
        </Box>
      ) : (
        <>
          {/* Middle column becomes a 2-row grid = both cards are viewport-tall halves */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: 1,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <ForecastChartBox />
            <DemandByCityCard />
          </Box>

          {/* Right column fills viewport */}
          <Box sx={{ height: "100%", display: "flex" }}>
            <RecommendationBox onCompare={() => setShowSim(true)} />
          </Box>
        </>
      )}
    </Box>
  );
}

/* =====================  ROOT  ===================== */

export default function DemandMProject() {
  return (
    <Box
      sx={{
        backgroundColor: "#CBD5E1",
        width: "100%",
        height: "100dvh", // ✨ ensure true-viewport height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <MainContentSection />
    </Box>
  );
}
