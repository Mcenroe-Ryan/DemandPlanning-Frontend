// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import CloseIcon from "@mui/icons-material/Close";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DescriptionIcon from "@mui/icons-material/Description";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import NewspaperIcon from "@mui/icons-material/Newspaper";
// import SettingsIcon from "@mui/icons-material/Settings";
// import {
//   Box,
//   Divider,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Stack,
//   Typography,
//   IconButton,
// } from "@mui/material";

// const SideNavBar = ({ open, onClose }) => {
//   const navigate = useNavigate();
//   if (!open) return null;

//   const menuItems = [
//     { icon: <BarChartIcon fontSize="small" />, text: "Demand" },
//     { icon: <InventoryIcon fontSize="small" />, text: "Procurement" },
//     { icon: <AssignmentIcon fontSize="small" />, text: "Inventory" },
//     { icon: <NewspaperIcon fontSize="small" />, text: "Promotion & Marketing" },
//     { icon: <AccountBalanceWalletIcon fontSize="small" />, text: "Finance" },
//     { icon: <CloudUploadIcon fontSize="small" />, text: "Import / Load Data" },
//     { icon: <DescriptionIcon fontSize="small" />, text: "Reports" },
//     { icon: <SettingsIcon fontSize="small" />, text: "Settings" },
//   ];

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: 260,
//         height: "100vh",
//         bgcolor: "background.paper",
//         boxShadow: 4,
//         zIndex: 1200,
//         transition: "transform 0.3s",
//         transform: open ? "translateX(0)" : "translateX(-100%)",
//         display: "flex",
//         flexDirection: "column",
//         p: 1,
//         gap: 1.5,
//       }}
//     >
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         width="100%"
//       >
//         <Stack direction="row" alignItems="center" spacing={0.5}>
//           {/* Logo */}
//           <Box
//             component="img"
//             src="https://c.animaapp.com/m9Wmzq2S/img/image-3@2x.png"
//             alt="Logo"
//             sx={{ width: 40, height: 36 }}
//           />
//           <Box>
//             <Typography
//               variant="subtitle2"
//               sx={{
//                 fontWeight: 600,
//                 color: "#626262",
//                 lineHeight: "16px",
//               }}
//             >
//               Demand Planning
//             </Typography>
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "text.secondary",
//                 fontSize: "10px",
//               }}
//             >
//               Business Planner
//             </Typography>
//           </Box>
//         </Stack>
//         <IconButton onClick={onClose} sx={{ p: 0.5 }}>
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </Stack>

//       <Divider />

//       <List disablePadding sx={{ width: "100%" }}>
//         {menuItems.map((item, index) => (
//           <ListItem
//             key={index}
//             button
//             sx={{
//               py: 0.5,
//               px: 1,
//               borderRadius: 1,
//               "&:hover": {
//                 bgcolor: "action.hover",
//               },
//             }}
//             onClick={() => navigate(item.path)}}
//           >
//             <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
//             <ListItemText
//               primary={item.text}
//               primaryTypographyProps={{
//                 fontSize: 14,
//                 fontWeight: 500,
//                 color: "text.primary",
//               }}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default SideNavBar;
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
    },
    { icon: <InventoryIcon fontSize="small" />, text: "Procurement" },
    { icon: <AssignmentIcon fontSize="small" />, text: "Inventory" },
    { icon: <NewspaperIcon fontSize="small" />, text: "Promotion & Marketing" },
    { icon: <AccountBalanceWalletIcon fontSize="small" />, text: "Finance" },
    {
      icon: <CloudUploadIcon fontSize="small" />,
      text: "Import / Load Data",
      path: "/import-load-data",
    },
    { icon: <DescriptionIcon fontSize="small" />, text: "Reports" },
    { icon: <SettingsIcon fontSize="small" />, text: "Settings" },
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
            button
            onClick={() => item.path && navigate(item.path)}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
                color: "text.primary",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideNavBar;
