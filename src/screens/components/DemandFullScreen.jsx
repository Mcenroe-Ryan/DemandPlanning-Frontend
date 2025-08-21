import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DashSquareFillIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

/* ---------- helpers ---------- */
const parseMonth = (label) => {
  // "April 2025" => Date(2025,3,1)
  const [monthName, yearStr] = label.split(" ");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const monthIdx = months.findIndex((m) => m === monthName);
  const year = Number(yearStr);
  return new Date(year, monthIdx, 1);
};
const fmtHeader = (d) =>
  new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit" })
    .format(d)
    .replace(" ", " ");

const sumNums = (arr) =>
  arr.reduce((s, v) => (v == null || v === "" ? s : s + Number(v)), 0);

const avgNums = (arr) => {
  const nums = arr.filter((v) => v != null && v !== "").map(Number);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : "";
};

/* transform API → headers + tableData + monthsMeta */
const buildFromApi = (apiData) => {
  if (!apiData?.length) {
    return { headerColumns: ["City", "Plant", "Category", ""], tableData: [], monthsMeta: [] };
  }

  // 1) unique months (sorted asc)
  const monthSet = new Map(); // map label -> Date
  apiData.forEach((r) => {
    const lbl = r.month_name; // e.g., "April 2025"
    if (!monthSet.has(lbl)) monthSet.set(lbl, parseMonth(lbl));
  });
  const uniqueMonths = [...monthSet.entries()]
    .sort((a, b) => a[1] - b[1]) // sort by Date
    .map(([lbl]) => lbl);

  // 2) headers
  const dynamicHeaders = [
    "City",
    "Plant",
    "Category",
    "",
    ...uniqueMonths.map((m) => fmtHeader(parseMonth(m))), // e.g., "Apr 25"
  ];

  // 3) past/future map for styling
  const today = new Date();
  const monthsMeta = uniqueMonths.map((m) => {
    const d = parseMonth(m);
    // future if first day of month > first day of current month
    const isFuture =
      d.getFullYear() > today.getFullYear() ||
      (d.getFullYear() === today.getFullYear() && d.getMonth() > today.getMonth());
    return { label: m, isFuture };
  });

  // 4) group by city-plant-category, then aggregate across SKUs per month
  const groups = {};
  apiData.forEach((item) => {
    const key = `${item.city_name}__${item.plant_name}__${item.category_name}`;
    if (!groups[key]) {
      groups[key] = {
        city: item.city_name,
        plant: item.plant_name,
        category: item.category_name,
        months: {}, // month_label -> array of sku rows
      };
    }
    if (!groups[key].months[item.month_name]) groups[key].months[item.month_name] = [];
    groups[key].months[item.month_name].push(item);
  });

  const sections = Object.values(groups).map((section) => {
    const byMonthAgg = (picker, how = "sum") =>
      uniqueMonths.map((m) => {
        const rows = section.months[m] || [];
        if (!rows.length) return "";
        const values = rows.map((r) => r[picker]);
        if (how === "avg") return values.every((v) => v == null) ? "" : avgNums(values).toFixed(2);
        if (how === "sumFloat") {
          const s = sumNums(values);
          return s === 0 ? "" : Number(s).toFixed(2);
        }
        // default sum integers
        const s = sumNums(values);
        return s === 0 ? "" : String(s);
      });

    const rows = [
      { type: "Actual", values: byMonthAgg("actual_units"), isActual: true },
      { type: "Baseline Forecast", values: byMonthAgg("baseline_forecast") },
      { type: "ML Forecast", values: byMonthAgg("ml_forecast") },
      { type: "Sales", values: byMonthAgg("sales_units") },
      { type: "Promotion / Marketing", values: byMonthAgg("promotion_marketing") },
      { type: "Consensus", values: byMonthAgg("consensus_forecast"), hasEditIcons: true },
      {
        type: "Revenue Forecast",
        subtext: "(In Lakhs)",
        values: byMonthAgg("revenue_forecast_lakhs", "sumFloat"),
        hasInfoIcon: true,
      },
      { type: "Inventory Level (%)", values: byMonthAgg("inventory_level_pct", "avg") },
      { type: "Stock Out Days", values: byMonthAgg("stock_out_days", "avg") },
      { type: "On Hand", values: byMonthAgg("on_hand_units") },
    ];

    return { ...section, categoryLink: true, rows };
  });

  return { headerColumns: dynamicHeaders, tableData: sections, monthsMeta };
};

/* ---------- component ---------- */
export const DataTableSection = () => {
  const [headerColumns, setHeaderColumns] = useState(["City", "Plant", "Category", ""]);
  const [tableData, setTableData] = useState([]);
  const [monthsMeta, setMonthsMeta] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = {
          country_name: "India",
          state_name: "Karnataka",
          city_name: "Udupi",
          plant_name: "Kar124",
          category_name: "Sweet Mixes",
        };
        const { data } = await axios.post(
          "http://localhost:5000/api/demand-forecast-full-screen",
          body
        );
        const built = buildFromApi(data);
        setHeaderColumns(built.headerColumns);
        setTableData(built.tableData);
        setMonthsMeta(built.monthsMeta);
      } catch (e) {
        console.error("Error fetching forecast data:", e);
        setHeaderColumns(["City", "Plant", "Category", ""]); // keep UI stable
        setTableData([]);
        setMonthsMeta([]);
      }
    };
    fetchData();
  }, []);

  // index of first month column (after City/Plant/Category/"")
  const firstMonthIdx = 4;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1px",
        flex: 1,
        width: "100%",
        backgroundColor: "white",
        border: "1px solid",
        borderColor: "grey.300",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "895px",
          flex: 1,
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        <TableContainer>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.300" }}>
                {headerColumns.map((header, index) => (
                  <TableCell
                    key={`${header}-${index}`}
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "text.secondary",
                      borderBottom: "1px solid",
                      borderColor: "grey.300",
                      borderLeft: index > 0 ? "1px solid" : "none",
                      borderLeftColor: "grey.300",
                      textAlign: index >= firstMonthIdx ? "right" : "left",
                      minWidth:
                        index === 0
                          ? "120px"
                          : index === 1
                          ? "154px"
                          : index === 2
                          ? "125px"
                          : index === 3
                          ? "240px"
                          : "auto",
                      padding: "5px 10px",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.rows.map((row, rowIndex) => (
                    <TableRow
                      key={`${sectionIndex}-${rowIndex}`}
                      sx={{
                        backgroundColor: rowIndex % 2 === 0 ? "white" : "grey.50",
                        height: "36px",
                      }}
                    >
                      {/* City */}
                      <TableCell
                        sx={{
                          fontWeight: rowIndex === 0 ? 600 : 400,
                          fontSize: "14px",
                          color: "text.primary",
                          borderBottom: "1px solid",
                          borderColor: "grey.300",
                          textAlign: "right",
                          padding: "0 10px",
                          width: "120px",
                        }}
                      >
                        {rowIndex === 0 ? section.city : ""}
                      </TableCell>

                      {/* Plant */}
                      <TableCell
                        sx={{
                          borderBottom: "1px solid",
                          borderLeft: "1px solid",
                          borderColor: "grey.300",
                          padding: "0 10px",
                          width: "154px",
                        }}
                      >
                        {rowIndex === 0 && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "text.primary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {section.plant}
                            </Typography>
                            <DashSquareFillIcon sx={{ width: 16, height: 16 }} />
                          </Stack>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell
                        sx={{
                          borderBottom: "1px solid",
                          borderLeft: "1px solid",
                          borderColor: "grey.300",
                          padding: "0 10px",
                          width: "125px",
                        }}
                      >
                        {rowIndex === 0 && section.categoryLink && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "primary.main",
                              textDecoration: "underline",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                            }}
                          >
                            {section.category}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Row Type */}
                      <TableCell
                        sx={{
                          backgroundColor: "grey.100",
                          borderBottom: "1px solid",
                          borderLeft: "1px solid",
                          borderColor: "grey.300",
                          padding: "0 10px",
                          width: "240px",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              color: "text.secondary",
                              fontWeight: row.type === "Consensus" ? 600 : 400,
                            }}
                          >
                            {row.type}
                          </Typography>
                          {row.hasInfoIcon && (
                            <InfoIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />
                          )}
                          {row.subtext && (
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "12px", color: "text.secondary" }}
                            >
                              {row.subtext}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>

                      {/* Values */}
                      {row.values.map((value, valueIndex) => {
                        const meta = monthsMeta[valueIndex] || { isFuture: false };
                        return (
                          <TableCell
                            key={valueIndex}
                            sx={{
                              backgroundColor: meta.isFuture ? "grey.100" : "white",
                              borderBottom: "1px solid",
                              borderLeft: "1px solid",
                              borderRight:
                                valueIndex === row.values.length - 1 ? "1px solid" : "none",
                              borderColor: "grey.300",
                              padding: "0 10px",
                              textAlign: "right",
                              position: "relative",
                            }}
                          >
                            {row.hasEditIcons && value && !meta.isFuture ? (
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={0.5}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "14px",
                                    color: "text.primary",
                                    fontWeight: 600,
                                  }}
                                >
                                  {value}
                                </Typography>
                                <EditIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />
                              </Stack>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "14px",
                                  color: "text.secondary",
                                  fontWeight: row.isActual || row.type === "Consensus" ? 600 : 500,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Right side divider */}
      <Box
        sx={{
          display: "inline-flex",
          height: "924px",
          alignItems: "flex-start",
          gap: "10px",
          padding: "15px 5px",
          backgroundColor: "grey.300",
          borderRadius: "50px",
        }}
      >
        <Box sx={{ width: "1px", height: "511px", backgroundColor: "grey.400" }} />
      </Box>
    </Box>
  );
};
