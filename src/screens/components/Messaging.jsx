import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
const activities = [
  {
    id: 1,
    title: "Planning Team",
    members: [
      { id: 1, avatar: "ellipse.png", alt: "Team Member 1" },
      { id: 2, avatar: "image.png", alt: "Team Member 2" },
      { id: 3, avatar: "ellipse-2.png", alt: "Team Member 3" },
    ],
    event: {
      title: "Event",
      description:
        "Demand Constraint: 30% sales increase for the product category Sweet Mixes for Jul, Aug and Sep 2025",
    },
    currentUser: { id: 4, avatar: "ellipse-3.png", alt: "Current User" },
    comments: [
      {
        id: 1,
        user: {
          id: 5,
          name: "Pavan Jayant",
          role: "Sales Planner",
          avatar: "ellipse-4.png",
          time: "12:30PM",
        },
        text: "@PratikPatel as discussed, I have added 5495 units preplanning to constraint Sweet Mixes category. The overload issue has been solved by adding supplier 1 and supplier 2 for Jul, Aug, Sep 2024 months.",
        mentions: ["@PratikPatel"],
      },
      {
        id: 2,
        user: {
          id: 6,
          name: "Pratik Patel",
          role: "Aggregate Supply Planner",
          avatar: "ellipse-5.png",
          time: "12:30PM",
        },
        text: "@PavanJayant sounds good demand surge scenario working fine",
        mentions: ["@PavanJayant"],
      },
    ],
  },
  {
    id: 2,
    title: "Planning Team",
    members: [
      { id: 7, avatar: "ellipse-6.png", alt: "Team Member 4" },
      { id: 8, avatar: "ellipse-7.png", alt: "Team Member 5" },
      { id: 9, avatar: "ellipse-8.png", alt: "Team Member 6" },
    ],
    event: {
      title: "Event",
      description:
        "Bottleneck Analysis: 80% of production break down for the product category Sweet Mixes for Sep 2025",
    },
    currentUser: { id: 10, avatar: "ellipse-9.png", alt: "Current User" },
    comments: [
      {
        id: 3,
        user: {
          id: 11,
          name: "Pavan Jayant",
          role: "Sales Planner",
          avatar: "ellipse-10.png",
          time: "12:30PM",
        },
        text: "@PratikPatel as discussed, I have added and adjusted black log 9000 units preplanning to constraint Sweet Mixes category. The overload issue has been solved by sifted to next Oct and Nov months for Sep 2024 break down.",
        mentions: ["@PratikPatel"],
      },
      {
        id: 4,
        user: {
          id: 12,
          name: "Pratik Patel",
          role: "Aggregate Supply Planner",
          avatar: "ellipse-11.png",
          time: "12:30PM",
        },
        text: "@PavanJayant sounds good bottleneck analysis looks good",
        mentions: ["@PavanJayant"],
      },
    ],
  },
];

const Comment = ({ comment }) => {
  const renderText = (text, mentions) => {
    if (!mentions?.length) return text;
    let parts = [text];
    mentions.forEach((mention) => {
      parts = parts.flatMap((part) =>
        typeof part === "string"
          ? part.split(mention).flatMap((seg, i) =>
              i > 0
                ? [
                    <Typography
                      key={`mention-${mention}-${i}`}
                      component="span"
                      color="primary"
                      sx={{ textDecoration: "underline" }}
                    >
                      {mention}
                    </Typography>,
                    seg,
                  ]
                : [seg]
            )
          : [part]
      );
    });
    return parts;
  };

  return (
    <Box sx={{ px: 2.5, py: 2, borderTop: 1, borderColor: "grey.300" }}>
      <Stack direction="row" spacing={2} mb={2}>
        <Avatar src={comment.user.avatar} alt={comment.user.name} />
        <Box>
          <Typography fontWeight={600}>{comment.user.name}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {comment.user.role}
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: "grey.500",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {comment.user.time}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Typography variant="body1">
        {renderText(comment.text, comment.mentions)}
      </Typography>
    </Box>
  );
};

const ActivityCard = ({ activity }) => (
  <Paper
    elevation={3}
    sx={{
      width: "100%",
      maxWidth: 680,
      borderRadius: 3,
      mb: 2,
      bgcolor: "grey.50",
    }}
  >
    <Box
      sx={{
        px: 2.5,
        py: 1.5,
        bgcolor: "grey.200",
        display: "flex",
        justifyContent: "space-between",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      <Typography fontWeight={600}>{activity.title}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small">
          <AddIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">Add</Typography>
        <IconButton size="small">
          <KeyboardArrowDownIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>

    <Box px={2.5} py={1.25}>
      <AvatarGroup
        max={3}
        sx={{ "& .MuiAvatar-root": { width: 40, height: 40 } }}
      >
        {activity.members.map((member) => (
          <Avatar key={member.id} src={member.avatar} alt={member.alt} />
        ))}
      </AvatarGroup>
    </Box>

    <Box px={2.5} pb={1.5}>
      <Typography fontWeight={600} gutterBottom>
        {activity.event.title}
      </Typography>
      <Typography variant="body2">{activity.event.description}</Typography>
    </Box>

    <Box px={2.5} pb={2} display="flex" alignItems="center" gap={1}>
      <Avatar src={activity.currentUser.avatar} alt="Current User" />
      <TextField
        fullWidth
        placeholder="Write your comment here..."
        size="small"
        sx={{ bgcolor: "white", borderRadius: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" color="primary">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <Box>
      {activity.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Box>
  </Paper>
);

const Chart = ({ onClose }) => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      bgcolor: "grey.100",
      p: 2,
    }}
  >
    <Box width="100%" maxWidth={680} mb={2}>
      <AppBar position="static" color="inherit" sx={{ bgcolor: "grey.800" }}>
        <Toolbar variant="dense" sx={{ minHeight: 42 }}>
          <ChatIcon sx={{ mr: 2, color: "white" }} fontSize="small" />
          <Typography
            variant="subtitle2"
            sx={{ flexGrow: 1, color: "white", fontWeight: 600 }}
          >
            Activities
          </Typography>
          <IconButton edge="end" size="small" onClick={onClose}>
            <CloseIcon sx={{ color: "white" }} fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>

    <Box
      sx={{
        width: "100%",
        maxWidth: 680,
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        p: 1,
        borderRadius: 2,
        bgcolor: "grey.200",
      }}
    >
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </Box>
  </Box>
);

export default Chart;
