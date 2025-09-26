import React, { useState } from "react";
import { DateRange } from "react-date-range";
import {
  Box,
  Button,
  Popover,
  TextField,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { format, parse, addMonths, subMonths, isValid } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateFilter({ onDateChange, disabled = false }) {
  const now = new Date();
  const sixMonthsBack = subMonths(now, 6);
  const sixMonthsAhead = addMonths(now, 6);

  const defaultRange = [
    {
      startDate: sixMonthsBack, 
      endDate: sixMonthsAhead, 
      key: "selection",
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState(defaultRange);
  const [tempRange, setTempRange] = useState(defaultRange);

  // Inputs start empty so placeholders show
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [startInput, setStartInput] = useState(""); 
  const [endInput, setEndInput] = useState(""); 

  const placeholderStart = format(sixMonthsBack, "MM/dd/yyyy");
  const placeholderEnd = format(sixMonthsAhead, "MM/dd/yyyy");
  const placeholderToday = format(now, "MM/dd/yyyy");

  const handleOpen = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleCancel = () => {
    setTempRange(range);
    if (hasUserSelected) {
      setStartInput(format(range[0].startDate, "MM/dd/yyyy"));
      setEndInput(format(range[0].endDate, "MM/dd/yyyy"));
    } else {
      setStartInput("");
      setEndInput("");
    }
    setAnchorEl(null);
  };

  const handleApply = () => {
    setRange(tempRange);
    setHasUserSelected(true);
    setAnchorEl(null);
    const startDate = format(tempRange[0].startDate, "yyyy-MM-dd");
    const endDate = format(tempRange[0].endDate, "yyyy-MM-dd");
    onDateChange?.({ startDate, endDate });
  };

  const handleStartChange = (e) => {
    const value = e.target.value;
    setStartInput(value);
    const parsed = parse(value, "MM/dd/yyyy", new Date());
    if (isValid(parsed)) {
      setTempRange([{ ...tempRange[0], startDate: parsed }]);
    }
  };

  const handleEndChange = (e) => {
    const value = e.target.value;
    setEndInput(value);
    const parsed = parse(value, "MM/dd/yyyy", new Date());
    if (isValid(parsed)) {
      setTempRange([{ ...tempRange[0], endDate: parsed }]);
    }
  };

  const getLabel = () => {
    if (!hasUserSelected) return "Date Filter";
    return `${format(range[0].startDate, "MMM dd, yyyy")} - ${format(
      range[0].endDate,
      "MMM dd, yyyy"
    )}`;
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{
          height: 32,
          minWidth: 110,
          px: 2,
          fontSize: "13px",
          bgcolor: disabled ? "grey.100" : "common.white",
          textTransform: "none",
          borderRadius: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          borderColor: disabled ? "grey.300" : "primary.main",
          "&:hover": { bgcolor: disabled ? "grey.100" : "grey.100" },
        }}
        onClick={handleOpen}
        disabled={disabled}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "13px",
            color: disabled ? "grey.500" : "primary.main",
          }}
        >
          {getLabel()}
        </Typography>
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 2,
            width: "fit-content",
            maxWidth: 380,
            overflow: "hidden",
          },
        }}
        disableRestoreFocus
      >
        <Stack spacing={0.25} sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Today: {placeholderToday}
          </Typography>
        </Stack>

        {/* Start & End Date Input Row */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Box sx={{ flex: 0.5, minWidth: 120 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.25 }}
            >
              Start date (MM/DD/YYYY)
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              value={startInput}
              onChange={handleStartChange}
              placeholder={placeholderStart}
              sx={{
                "& .MuiOutlinedInput-root": { height: 30 },
                "& input": { padding: "4px 6px", fontSize: 12 },
              }}
              fullWidth
              disabled={disabled}
            />
          </Box>
          <Box sx={{ flex: 0.5, minWidth: 120 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.25 }}
            >
              End date (MM/DD/YYYY)
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              value={endInput}
              onChange={handleEndChange}
              placeholder={placeholderEnd} 
              sx={{
                "& .MuiOutlinedInput-root": { height: 30 },
                "& input": { padding: "4px 6px", fontSize: 12 },
              }}
              fullWidth
              disabled={disabled}
            />
          </Box>
        </Stack>

        {/* Calendar */}
        <DateRange
          editableDateInputs
          onChange={(item) => {
            setTempRange([item.selection]);
            setStartInput(format(item.selection.startDate, "MM/dd/yyyy"));
            setEndInput(format(item.selection.endDate, "MM/dd/yyyy"));
          }}
          moveRangeOnFirstSelection={false}
          ranges={tempRange}
          rangeColors={["#2563eb"]}
          showDateDisplay={false}
          disabled={disabled}
        />

        {/* Footer Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <Button
            size="small"
            onClick={handleCancel}
            sx={{ textTransform: "uppercase" }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleApply}
            sx={{ textTransform: "uppercase" }}
            disabled={disabled}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}
