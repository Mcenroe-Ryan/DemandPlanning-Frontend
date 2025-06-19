import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PlusLgIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TrashIcon from "@mui/icons-material/Delete";
import PencilIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import BellIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import ArrowClockwiseIcon from "@mui/icons-material/Star";
import CalendarToday from "@mui/icons-material/CalendarToday";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const ImportProfilesData = () => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const tableData = [
    {
      id: 1,
      projectName: "Historical Sales Demand Entity",
      description: "Historical sales from Demand Planning",
      importedBy: {
        name: "Konda Vamshi Das",
        avatar: "https://c.animaapp.com/QiGZUQ6N/img/ellipse@2x.png",
      },
      createdOn: "12 Feb 2025, 7:45 PM",
      importType: "Microsoft Excel",
    },
  ];

  const profileData = {
    title: "Historical Sales Demand Entity",
    subtitle: "Import Data Profile",
    uploadDate: "12 Feb 2025, 7:45 PM",
    importType: "Microsoft Excel",
    fileSize: "1.4 MB",
  };

  const tabs = ["Summary", "Run Schedule", "Jobs"];

  const actionButtons = [
    { icon: <ArrowClockwiseIcon />, label: "Refresh" },
    { icon: <PlusLgIcon />, label: "Import Data" },
    { icon: <PlusLgIcon />, label: "Export Data" },
  ];
  const renderSubmitActions = () => (
    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
      <Button variant="outlined" sx={{ borderColor: '#cbd5e1', color: '#1e293b' }}>Cancel</Button>
      <Button variant="contained" sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}>Submit</Button>
    </Stack>
  );
  const renderRunSchedule = () => (
    <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "100%", p: 2, borderRadius: "5px", bgcolor: "background.paper" }}>
      <Stack spacing={3.75} maxWidth="1259px">
        <Box display="flex" flexDirection="column" gap={2} width="100%">
          <Typography variant="h6" fontWeight={600} color="#1f2937">
            Set run schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure when the import profile will run (run date), based on a recurring schedule.
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" width="100%" gap={2}>
          <Typography variant="h6" fontWeight={600} color="text.primary">Run schedule</Typography>
          <FormControl fullWidth variant="outlined" size="medium">
            <Select value="recurring" displayEmpty sx={{ borderRadius: 1, backgroundColor: "background.paper" }}>
              <MenuItem value="recurring">Recurring</MenuItem>
              <MenuItem value="onetime">One-time</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={600} color="text.primary">Daily</Typography>
          <FormGroup row sx={{ gap: 2 }}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <FormControlLabel key={day} control={<Checkbox checked={day === "Monday" || day === "Tuesday"} size="small" />} label={<Typography variant="body1" color="text.secondary">{day}</Typography>} />
            ))}
          </FormGroup>
        </Box>
        <Stack direction="row" spacing={3.75} width="100%">
          <FormControl fullWidth>
            <Typography variant="h6" fontWeight={600} color="#1f2937" gutterBottom>At</Typography>
            <Select value="12:45 AM" displayEmpty sx={{ bgcolor: "white", borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: "grey.300" } }}>
              <MenuItem value="12:45 AM">12:45 AM</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Typography variant="h6" fontWeight={600} color="#1f2937" gutterBottom>Time zone</Typography>
            <Select value="(UTC/GMT+05:30 AM) India, Asia, Kolkata" displayEmpty sx={{ bgcolor: "white", borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: "grey.300" } }}>
              <MenuItem value="(UTC/GMT+05:30 AM) India, Asia, Kolkata">(UTC/GMT+05:30 AM) India, Asia, Kolkata</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={3.75} width="100%">
          {["Start date", "End date"].map((label, idx) => (
            <Stack key={label} spacing={1} flex={1}>
              <Typography variant="h6" fontWeight={600} color="#1f2937" sx={{ mt: "-1px" }}>{label}</Typography>
              <TextField fullWidth value={idx === 0 ? "Mon, Dec 22 2024" : "Select"} variant="outlined" InputProps={{ endAdornment: idx === 0 ? <KeyboardArrowDown /> : <CalendarToday fontSize="small" />, sx: { padding: "9px 16px", backgroundColor: "#fff", borderRadius: "6px", '& .MuiOutlinedInput-notchedOutline': { borderColor: "#d1d5db" } } }} sx={{ '& .MuiInputBase-input': { color: "#374151", fontWeight: 400, fontSize: "16px" } }} />
            </Stack>
          ))}
        </Stack>
       {renderSubmitActions()}
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: "#eff6ff", height: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#0288d1" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "40px", px: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit"><ListIcon /></IconButton>
            <Box component="img" src="https://c.animaapp.com/QiGZUQ6N/img/image-3@2x.png" sx={{ width: 40, height: 35.69 }} />
            <Stack>
              <Typography variant="subtitle2" fontWeight={600} color="white">Demand Planning</Typography>
              <Typography variant="caption" color="white">Business Planner</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="white">Import Profiles</Typography>
              {showDetails && <><ChevronRightIcon fontSize="small" sx={{ color: "white" }} /><Typography variant="body2" color="white">Project Details</Typography></>}
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit"><SearchIcon /></IconButton>
            <IconButton color="inherit"><BellIcon /></IconButton>
            <Avatar src="https://c.animaapp.com/QiGZUQ6N/img/ellipse-1@2x.png" sx={{ width: 35, height: 35 }} />
          </Stack>
        </Toolbar>
        <Toolbar variant="dense" sx={{ bgcolor: "#455a64", minHeight: "41px", px: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <IconButton color="inherit" size="small" onClick={() => setShowDetails(false)}>
              <img src="https://c.animaapp.com/QiGZUQ6N/img/union.svg" alt="Back" style={{ width: 20, height: 20 }} />
            </IconButton> */}
                    <IconButton
                      size="small"
                      onClick={() => navigate("/dashboard")}
                      aria-label="Back to Dashboard"
                    >
                      <img
                        src="https://c.animaapp.com/Jwk7dHU9/img/union.svg"
                        alt="Back"
                        style={{ width: 20, height: 20 }}
                      />
                    </IconButton>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
            <IconButton color="inherit" size="small"><PencilIcon fontSize="small" /></IconButton>
            <IconButton color="inherit" size="small"><TrashIcon fontSize="small" /></IconButton>
            <Box position="relative" sx={{ width: 24, height: 20 }}>
              <ChatBubbleOutlineIcon sx={{ position: "absolute", width: 20, height: 20 }} />
              <img src="https://c.animaapp.com/QiGZUQ6N/img/ellipse-309--stroke-.svg" alt="Notification" style={{ position: "absolute", width: 12, height: 12, top: 0, left: 12 }} />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {!showDetails ? (
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Import Profiles</Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover", borderBottom: 1, borderColor: "grey.300" }}>
                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                    <TableCell width={476}><Typography variant="subtitle1" fontWeight={600} color="text.secondary">Project Name</Typography></TableCell>
                    <TableCell><Typography variant="subtitle1" fontWeight={600} color="text.secondary">Description</Typography></TableCell>
                    <TableCell><Typography variant="subtitle1" fontWeight={600} color="text.secondary">Imported By</Typography></TableCell>
                    <TableCell><Typography variant="subtitle1" fontWeight={600} color="text.secondary">Created On</Typography></TableCell>
                    <TableCell><Typography variant="subtitle1" fontWeight={600} color="text.secondary">Import Type</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id} sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                      <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                      <TableCell width={476}>
                        <Link component="button" underline="always" color="primary" variant="body2" onClick={() => setShowDetails(true)}>{row.projectName}</Link>
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{row.description}</Typography></TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar src={row.importedBy.avatar} alt={row.importedBy.name} sx={{ width: 35, height: 35 }} />
                          <Link href="#" underline="always" color="primary" variant="body2">{row.importedBy.name}</Link>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{row.createdOn}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{row.importType}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1, mb: 2 }}>Profile Details</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ '& .MuiTab-root': { minWidth: 127 }, '& .Mui-selected': { borderBottom: 2, borderColor: "#3b82f6" } }}>
                {tabs.map((tab, index) => (<Tab key={index} label={tab} />))}
              </Tabs>
              <Stack direction="row" spacing={2}>
                {actionButtons.map((button, index) => (
                  <Button key={index} variant="outlined" startIcon={button.icon} size="small" sx={{ color: "#64748b", borderColor: "#94a3b8" }}>{button.label}</Button>
                ))}
              </Stack>
            </Stack>
            {tabValue === 0 && (
              <Card sx={{ p: 2, boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" fontWeight={600}>{profileData.title}</Typography>
                    <Typography variant="body2">{profileData.subtitle}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={600}>Upload on:</Typography>
                    <Typography variant="body2">{profileData.uploadDate}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={600}>Import Type:</Typography>
                    <Typography variant="body2">{profileData.importType}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={600}>File Size:</Typography>
                    <Typography variant="body2">{profileData.fileSize}</Typography>
                  </Stack>
                </Stack>
              </Card>
            )}
            {tabValue === 1 && renderRunSchedule()}
          </Box>
        )}
      </Box>
    </Box>
  );
};
