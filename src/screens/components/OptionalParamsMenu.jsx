import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Paper,
} from "@mui/material";

const PARAM_OPTIONS = [
  "Sales",
  "Promotion / Marketing",
  "Inventory Level",
  "Stock out days",
  "On Hand",
];

export default function OptionalParamsMenu({
  open,
  onClose,
  selected,
  onChange,
}) {
  const [search, setSearch] = useState("");
  const menuRef = useRef();
 
    useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const filteredOptions = PARAM_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (option) => {
    const newSel = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(newSel);
  };

  const handleSelectAll = () => {
    onChange(selected.length === PARAM_OPTIONS.length ? [] : PARAM_OPTIONS);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
<Paper
  elevation={8}
  ref={menuRef}
  sx={{
    position: "absolute",
    right: -180, 
    mt: 1,
    minWidth: 260,
    maxWidth: 320,
    borderRadius: 2,
    overflow: "hidden",
    zIndex: 1300,
  }}
  onKeyDown={handleKeyDown}
>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: "grey.50",
          borderBottom: 1,
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            mb: 1,
          }}
        >
          Add Data Rows
        </Typography>

        <TextField
          size="small"
          fullWidth
          placeholder="Search rows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.875rem",
              "& fieldset": {
                borderColor: "grey.300",
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Box>
      <List
        dense
        sx={{
          py: 0.5,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSelectAll}
            sx={{
              py: 0.75,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 5 }}>
              <Checkbox
                edge="start"
                checked={selected.length === PARAM_OPTIONS.length}
                indeterminate={
                  selected.length > 0 && selected.length < PARAM_OPTIONS.length
                }
                tabIndex={-1}
                sx={{
                  p: 0.5,
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.25rem",
                    borderRadius: 0.5,
                  },
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="All"
              primaryTypographyProps={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 14,
                lineHeight: "100%",
                letterSpacing: "0.1px",
                color: "#475569",
              }}
            />
          </ListItemButton>
        </ListItem>
        {filteredOptions.length === 0 ? (
          <Box
            sx={{
              py: 3,
              px: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No rows found
            </Typography>
          </Box>
        ) : (
          filteredOptions.map((opt) => (
            <ListItem key={opt} disablePadding>
              <ListItemButton
                onClick={() => handleToggle(opt)}
                sx={{
                  py: 0.75,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 5 }}>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(opt)}
                    tabIndex={-1}
                    sx={{
                      p: 0.5,
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.25rem",
                        borderRadius: 0.5,
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={opt}
                  primaryTypographyProps={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: 14,
                    lineHeight: "100%",
                    letterSpacing: "0.1px",
                    color: "#475569",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}
