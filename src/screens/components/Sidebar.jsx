import React from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";

const SideNavBar = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  const menuItems = [
    {
      icon: <BarChartIcon fontSize="small" />,
      text: "Demand",
      path: "/demand",
      enabled: true, // Active
    },
    { 
      icon: <InventoryIcon fontSize="small" />, 
      text: "Procurement",
      enabled: false, // Disabled
    },
    { 
      icon: <AssignmentIcon fontSize="small" />, 
      text: "Inventory",
      enabled: false, // Disabled
    },
    { 
      icon: <NewspaperIcon fontSize="small" />, 
      text: "Promotion & Marketing",
      enabled: false, // Disabled
    },
    { 
      icon: <AccountBalanceWalletIcon fontSize="small" />, 
      text: "Finance",
      enabled: false, // Disabled
    },
    {
      icon: <CloudUploadIcon fontSize="small" />,
      text: "Import / Load Data",
      path: "/import-load-data",
      enabled: true, // Active
    },
    { 
      icon: <DescriptionIcon fontSize="small" />, 
      text: "Reports",
      enabled: false, // Disabled
    },
    { 
      icon: <SettingsIcon fontSize="small" />, 
      text: "Settings",
      enabled: false, // Disabled
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        height: "100vh",
        bgcolor: "background.paper",
        boxShadow: 4,
        zIndex: 1200,
        transition: "transform 0.3s",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        display: "flex",
        flexDirection: "column",
        p: 1,
        gap: 1.5,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            component="img"
            src="https://c.animaapp.com/m9Wmzq2S/img/image-3@2x.png"
            alt="Logo"
            sx={{ width: 40, height: 36 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#626262">
              Demand Planning
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize={10}>
              Business Planner
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Divider />

      <List disablePadding sx={{ width: "100%" }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            button={item.enabled} // Only clickable if enabled
            onClick={() => item.enabled && item.path && navigate(item.path)}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              opacity: item.enabled ? 1 : 0.5, // Visual indication of disabled state
              cursor: item.enabled ? "pointer" : "not-allowed",
              "&:hover": item.enabled ? { bgcolor: "action.hover" } : {},
              pointerEvents: item.enabled ? "auto" : "none", // Disable mouse events for disabled items
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 32,
                color: item.enabled ? "inherit" : "text.disabled" // Gray out icons for disabled items
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
                color: item.enabled ? "text.primary" : "text.disabled", // Gray out text for disabled items
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideNavBar;
