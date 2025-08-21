import React, { useState } from "react";
import { DateRange } from "react-date-range";
import {
  Box,
  Button,
  Popover,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { addDays, format, parse, addMonths, subMonths } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateFilter({ onDateChange, disabled = false }) {
  const defaultRange = [
    {
      startDate: subMonths(new Date(), 6), // 6 months historical
      endDate: addMonths(new Date(), 6), // 6 months forecast
      key: "selection",
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState(defaultRange);
  const [tempRange, setTempRange] = useState(defaultRange);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [startInput, setStartInput] = useState(
    format(defaultRange[0].startDate, "MM/dd/yyyy")
  );
  const [endInput, setEndInput] = useState(
    format(defaultRange[0].endDate, "MM/dd/yyyy")
  );

  const handleOpen = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleCancel = () => {
    setTempRange(range);
    setStartInput(format(range[0].startDate, "MM/dd/yyyy"));
    setEndInput(format(range[0].endDate, "MM/dd/yyyy"));
    setAnchorEl(null);
  };

  const handleApply = () => {
    setRange(tempRange);
    setHasUserSelected(true);
    setAnchorEl(null);
    const startDate = format(tempRange[0].startDate, "yyyy-MM-dd");
    const endDate = format(tempRange[0].endDate, "yyyy-MM-dd");
    if (onDateChange) onDateChange({ startDate, endDate });
  };

  const handleStartChange = (e) => {
    const value = e.target.value;
    setStartInput(value);
    const parsed = parse(value, "MM/dd/yyyy", new Date());
    if (!isNaN(parsed)) {
      setTempRange([{ ...tempRange[0], startDate: parsed }]);
    }
  };

  const handleEndChange = (e) => {
    const value = e.target.value;
    setEndInput(value);
    const parsed = parse(value, "MM/dd/yyyy", new Date());
    if (!isNaN(parsed)) {
      setTempRange([{ ...tempRange[0], endDate: parsed }]);
    }
  };

  //This is to show month number after selection
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
          "&:hover": {
            bgcolor: disabled ? "grey.100" : "grey.100",
          },
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
            maxWidth: 360,
            overflow: "hidden",
          },
        }}
        disableRestoreFocus
      >
        {/* Start & End Date Input Row */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Box sx={{ flex: 0.5, minWidth: 100 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.25 }}
            >
              Start date (mm/dd/yy)
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              value={startInput}
              onChange={handleStartChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 30,
                },
                "& input": {
                  padding: "4px 6px",
                  fontSize: 12,
                },
              }}
              fullWidth
              disabled={disabled}
            />
          </Box>
          <Box sx={{ flex: 0.5, minWidth: 100 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.25 }}
            >
              End date (mm/dd/yy)
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              value={endInput}
              onChange={handleEndChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 30,
                },
                "& input": {
                  padding: "4px 6px",
                  fontSize: 12,
                },
              }}
              fullWidth
              disabled={disabled}
            />
          </Box>
        </Stack>

        {/* Calendar */}
        <DateRange
          editableDateInputs={true}
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
            disabled={false}
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
