import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

const ellipse = "https://c.animaapp.com/dFM9GSxT/img/ellipse@2x.png";
const image3 = "https://c.animaapp.com/dFM9GSxT/img/image-3@2x.png";

const UnifiedDashboardPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [projects, setProjects] = useState([
    {
      id: 1,
      letter: "M",
      letterColor: "#C2410C",
      name: "Project 1",
      isCloned: false,
      selected: false,
    },
    {
      id: 2,
      letter: "C",
      letterColor: "#0EA5E9",
      name: "Project 2",
      isCloned: false,
      selected: false,
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleCheckboxChange = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleClone = () => {
    const selected = projects.filter((p) => p.selected);
    const clones = selected.map((p) => ({
      ...p,
      id: Date.now() + Math.random(),
      name: `${p.name} - Cloned`,
      isCloned: true,
      selected: false,
    }));
    setProjects((prev) => [...prev, ...clones]);
  };

  const handleEditOpen = () => {
    const selected = projects.find((p) => p.selected);
    if (selected) {
      setEditProject(selected);
      setEditDialogOpen(true);
    }
  };

  const handleEditSave = () => {
    setProjects((prev) =>
      prev.map((p) => (p.id === editProject.id ? editProject : p))
    );
    setEditDialogOpen(false);
  };

  const workItems = [
    {
      id: 1,
      title: "Data Migration Support and data entry",
      workItemNo: "283912",
      projectName: "M Project 1",
      dateTime: "29 Jan, 2024 - 12:00 PM",
      status: { text: "New", color: "#000" },
      statusIconUrl: "https://c.animaapp.com/dFM9GSxT/img/record-fill.svg",
      assignedTo: "K V Vamshi Das",
      completed: false,
    },
    {
      id: 2,
      title: "Data Migration Support and data entry",
      workItemNo: "283912",
      projectName: "M Project 1",
      dateTime: "29 Jan, 2024 - 12:00 PM",
      status: { text: "Active", color: "#000" },
      statusIconUrl: "https://c.animaapp.com/dFM9GSxT/img/record-fill-1.svg",
      assignedTo: "Satish Kumar",
      completed: false,
    },
    {
      id: 3,
      title: "Data Migration Support and data entry",
      workItemNo: "283912",
      projectName: "C Project 2",
      dateTime: "29 Jan, 2024 - 12:00 PM",
      status: { text: "Pending", color: "#000" },
      statusIconUrl: "https://c.animaapp.com/dFM9GSxT/img/record-fill-2.svg",
      assignedTo: "Me",
      completed: false,
    },
    {
      id: 4,
      title: "Data Migration Support and data entry",
      workItemNo: "283912",
      projectName: "C Project 2",
      dateTime: "29 Jan, 2024 - 12:00 PM",
      status: { text: "Completed", color: "#000" },
      statusIconUrl: "https://c.animaapp.com/dFM9GSxT/img/record-fill-3.svg",
      assignedTo: "Supreet",
      completed: true,
    },
  ];

  return (
    <Box sx={{ bgcolor: "#E2E8F0", minHeight: "100vh" }}>
      {/* NavBar */}
      <AppBar
        position="static"
        sx={{ bgcolor: "#0284C7", borderBottom: 1, borderColor: "#78909c" }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", minHeight: "unset", p: 0 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit" edge="start">
              <ListIcon />
            </IconButton>
            <Box
              component="img"
              src={image3}
              sx={{ width: 40, height: 35.69 }}
            />
            <Stack>
              <Typography variant="subtitle2" fontWeight={600} color="white">
                Demand Planning
              </Typography>
              <Typography variant="caption" color="white">
                Business Planner
              </Typography>
            </Stack>
            <Breadcrumbs
              separator={<ChevronRightIcon fontSize="small" />}
              sx={{ color: "white" }}
            >
              <Typography variant="body2" color="inherit">
                M Project 1
              </Typography>
              <Typography variant="body2" color="inherit">
                {tabValue === 0 ? "Projects" : "My Work Items"}
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <Avatar src={ellipse} alt="User" sx={{ width: 35, height: 35 }} />
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Tabs and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          px: 2,
          pt: 1,
          pb: 0.5,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { bgcolor: "#3f83f8" } }}
        >
          <Tab
            label={
              <Typography variant="body2" color="text.secondary">
                Projects
              </Typography>
            }
            sx={{ minWidth: 127, px: 2.5 }}
          />
          <Tab
            label={
              <Typography variant="body2" color="text.secondary">
                My Work Items
              </Typography>
            }
            sx={{ minWidth: 127, px: 2.5 }}
          />
        </Tabs>
        {tabValue === 0 ? (
          <Stack direction="row" spacing={2}>
            <IconButton>
              <ListIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
            <IconButton sx={{ bgcolor: "#BFDBFE", borderRadius: 1 }}>
              <GridViewIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleClone}
            >
              Clone
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate("/addNewProject")}
            >
              Add New Project
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1} alignItems="flex-end" sx={{ minWidth: 170 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate("/addNewProject")}
                sx={{ textTransform: "none" }}
              >
                Add New Project
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
      <Divider sx={{ bgcolor: "#E5E7EB", height: 1, width: "100%", my: 0 }} />
      {tabValue === 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, pt: 1 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ width: 170 }}
              onClick={handleEditOpen}
            >
              EDIT
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              sx={{ width: 170 }}
              onClick={() => {
              }}
            >
              DELETE
            </Button>
          </Stack>
        </Box>
      )}
      {tabValue === 0 ? (
        <Stack direction="row" spacing={4} sx={{ p: 3 }}>
          {projects.map((p) => (
            <Card
              key={p.id}
              sx={{
                width: 308,
                height: 142,
                p: 2,
                border: 1,
                borderColor: "#94A3B8",
                borderRadius: 1,
                position: "relative",
                transition: "box-shadow 0.2s",
                boxShadow: hoveredProjectId === p.id ? 4 : 1,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredProjectId(p.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              onClick={() => {
                if (p.name === "Project 1" && p.letter === "M") {
                  navigate("/demand");
                }
              }}
            >
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={p.selected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleCheckboxChange(p.id)}
                  sx={{ width: 16, height: 16, p: 0 }}
                />
                <Typography sx={{ ml: 1 }}>
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, fontSize: 40, color: p.letterColor }}
                  >
                    {p.letter}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1E293B",
                    }}
                  >
                    {p.name}
                  </Box>
                </Typography>
              </Stack>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                {hoveredProjectId === p.id ? (
                  <Stack direction="row" spacing={2}>
                    <ShowChartIcon sx={{ color: "#64748B" }} />
                    <LocalShippingIcon sx={{ color: "#64748B" }} />
                    <AssignmentIcon sx={{ color: "#64748B" }} />
                    <DeleteOutlineIcon sx={{ color: "#EF4444" }} />
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1.5}>
                    {[1, 2, 3, 4].map((dot) => (
                      <Box
                        key={dot}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#CBD5E1",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>
          ))}
        </Stack>
      ) : (
        <Box sx={{ px: 2, pt: 2 }}>
          {workItems.map((item, index) => (
            <Paper
              key={item.id}
              sx={{
                mb: 1,
                borderTop: index === 0 ? 1 : 0,
                borderColor: "grey.300",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="img"
                      src="https://c.animaapp.com/dFM9GSxT/img/clipboard-3.svg"
                      sx={{ width: 16, height: 16 }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                      sx={{
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body2" color="text.disabled">
                      Work Item No: {item.workItemNo}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Project Name: {item.projectName}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Date & Time: {item.dateTime}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="img"
                      src={item.statusIconUrl}
                      sx={{ width: 16, height: 16 }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={item.status.color}
                    >
                      {item.status.text}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="img"
                      src="https://c.animaapp.com/dFM9GSxT/img/person-circle-3.svg"
                      sx={{ width: 13, height: 13 }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {item.assignedTo}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Letter"
            value={editProject?.letter || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, letter: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Letter Color"
            value={editProject?.letterColor || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, letterColor: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Project Name"
            value={editProject?.name || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnifiedDashboardPage;
