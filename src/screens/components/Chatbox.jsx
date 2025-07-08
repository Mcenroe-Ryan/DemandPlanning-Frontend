import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Chip,
  InputAdornment,
  Slide,
} from "@mui/material";
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const ChatBot = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  // Handle loading screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Thank you for your message! I'm processing your request...",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Loading Screen Component
  if (isLoading) {
    return (
      <Box
        sx={{
          width: 680,
          height: 1080,
          bgcolor: "#1976d2",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="/path/to/blueRobotMascotLogoIconDesign675467551Traced.png" // Replace with your actual image path
          alt="Blue robot mascot"
          sx={{
            width: 262,
            height: 262,
            objectFit: "cover",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": {
                opacity: 0.7,
                transform: "scale(1)",
              },
              "50%": {
                opacity: 1,
                transform: "scale(1.05)",
              },
              "100%": {
                opacity: 0.7,
                transform: "scale(1)",
              },
            },
          }}
        />
      </Box>
    );
  }

  // Main ChatBot Interface
  return (
    <Box
      sx={{
        width: 680,
        height: 1080,
        bgcolor: "#f5f5f5",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "white",
              color: "#1976d2",
              width: 40,
              height: 40,
            }}
          >
            🤖
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Online • Ready to help
            </Typography>
          </Box>
        </Box>
        <IconButton sx={{ color: "white" }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Quick Actions */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Chip
          label="Get Started"
          size="small"
          clickable
          sx={{ bgcolor: "#e3f2fd" }}
        />
        <Chip
          label="How can you help?"
          size="small"
          clickable
          sx={{ bgcolor: "#e3f2fd" }}
        />
        <Chip
          label="Documentation"
          size="small"
          clickable
          sx={{ bgcolor: "#e3f2fd" }}
        />
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.isBot ? "flex-start" : "flex-end",
              mb: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: "70%",
                bgcolor: msg.isBot ? "white" : "#1976d2",
                color: msg.isBot ? "black" : "white",
                borderRadius: msg.isBot
                  ? "0 16px 16px 16px"
                  : "16px 0 16px 16px",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  opacity: 0.7,
                  fontSize: "0.7rem",
                }}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e0e0e0",
          bgcolor: "white",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <AttachFileIcon />
                </IconButton>
                <IconButton size="small">
                  <MicIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={message.trim() === ""}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "20px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            color: "text.secondary",
          }}
        >
          Powered by AI • Press Enter to send
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatBot;
