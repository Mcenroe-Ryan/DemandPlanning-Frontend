import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
  VolumeUp as VolumeUpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import chatbot from "../assets/chatbot1.png";

const ChatBot = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPrefilledFirst, setHasPrefilledFirst] = useState(false);
  const [scriptFinished, setScriptFinished] = useState(false);
  const [botIsTyping, setBotIsTyping] = useState(false); 

  const fullMessages = [
    {
      id: 1,
      text: "Hello..! John, how can I help you?",
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "What is the forecasted demand for SKU C5240200A in the next month?",
      isBot: false,
      timestamp: new Date(),
    },
    {
      id: 3,
      text: "The Projected demand for SKU C5240200A in the next month is 12150 units, based on historical trends, seasonality, and external factors.",
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: 4,
      text: "How would a 5% increase in marketing spend affect demand?",
      isBot: false,
      timestamp: new Date(),
    },
    {
      id: 5,
      text: "An increase in marketing spend of 5% is projected to boost demand by 12%, based on previous campaigns.",
      isBot: true,
      timestamp: new Date(),
    },
  ];

  const [visibleMessages, setVisibleMessages] = useState([fullMessages[0]]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isSendBlocked = scriptFinished && message.trim() === "";

  const handleSendMessage = () => {
    if (isSendBlocked || botIsTyping) return;

    if (!hasPrefilledFirst) {
      setMessage(fullMessages[1].text);
      setHasPrefilledFirst(true);
      return;
    }

    if (hasPrefilledFirst && currentIndex === 0) {
      const userMessage = {
        ...fullMessages[1],
        text: message,
      };
      setVisibleMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setCurrentIndex(1);

      setBotIsTyping(true);
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, fullMessages[2]]);
        setCurrentIndex(2);
        setBotIsTyping(false);
      }, 800);
      return;
    }

    if (currentIndex < fullMessages.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextMsg = fullMessages[nextIndex];

      if (!nextMsg.isBot) {
        setMessage(nextMsg.text);
        return;
      } else {
        setBotIsTyping(true);
        setVisibleMessages((prev) => [...prev, nextMsg]);
        setCurrentIndex(nextIndex);
        if (nextIndex === fullMessages.length - 1) {
          setScriptFinished(true);
        }
        setBotIsTyping(false);
        return;
      }
    }

    if (message.trim() === "") return;

    const newMessage = {
      id: visibleMessages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date(),
    };
    setVisibleMessages([...visibleMessages, newMessage]);
    setMessage("");

    setBotIsTyping(true);
    setTimeout(() => {
      const responses = [
        "I'm analyzing the data to provide you with accurate demand forecasting insights...",
        "Based on historical trends and market analysis, I can provide you with detailed projections...",
        "Let me process your request and generate relevant business insights for you...",
        "I'm accessing the latest market data to give you precise forecasting information...",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const botResponse = {
        id: visibleMessages.length + 2,
        text: randomResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setVisibleMessages((prev) => [...prev, botResponse]);
      setBotIsTyping(false);
    }, 1000);
  };

  const handleSendPrefilledMessage = () => {
    if (isSendBlocked || botIsTyping || message.trim() === "") return;

    let userMessageIndex = -1;
    for (let i = currentIndex; i < fullMessages.length; i++) {
      if (!fullMessages[i].isBot) {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex !== -1) {
      const userMessage = {
        ...fullMessages[userMessageIndex],
        text: message,
      };
      setVisibleMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setCurrentIndex(userMessageIndex);

      if (userMessageIndex + 1 < fullMessages.length) {
        setBotIsTyping(true);
        setTimeout(() => {
          setVisibleMessages((prev) => [
            ...prev,
            fullMessages[userMessageIndex + 1],
          ]);
          setCurrentIndex(userMessageIndex + 1);
          if (userMessageIndex + 1 === fullMessages.length - 1) {
            setScriptFinished(true);
          }
          setBotIsTyping(false);
        }, 800);
      } else {
        setScriptFinished(true);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isSendBlocked || botIsTyping) return;
      if (
        hasPrefilledFirst &&
        message.trim() !== "" &&
        currentIndex < fullMessages.length - 1
      ) {
        handleSendPrefilledMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleSendClick = () => {
    if (isSendBlocked || botIsTyping) return;
    if (
      hasPrefilledFirst &&
      message.trim() !== "" &&
      currentIndex < fullMessages.length - 1
    ) {
      handleSendPrefilledMessage();
    } else {
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: 680,
          height: 1080,
          bgcolor: "#4285f4",
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
          src={chatbot}
          alt="Planner Assistant"
          sx={{
            width: 262,
            height: 262,
            objectFit: "cover",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.7, transform: "scale(1)" },
              "50%": { opacity: 1, transform: "scale(1.05)" },
              "100%": { opacity: 0.7, transform: "scale(1)" },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 680,
        height: 1080,
        bgcolor: "#f8f9fa",
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
          bgcolor: "white",
          color: "#333",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton size="small" sx={{ color: "#666" }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            sx={{
              bgcolor: "#4285f4",
              color: "white",
              width: 40,
              height: 40,
            }}
          >
            🤖
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "600", color: "#4285f4" }}>
            Planner Assistant
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" sx={{ color: "#666" }}>
            <VolumeUpIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "#666" }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {visibleMessages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.isBot ? "flex-start" : "flex-end",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            {msg.isBot && (
              <Avatar
                sx={{
                  bgcolor: "#4285f4",
                  color: "white",
                  width: 32,
                  height: 32,
                  fontSize: "16px",
                }}
              >
                🤖
              </Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                maxWidth: "75%",
                bgcolor: msg.isBot ? "#f1f3f4" : "#4285f4",
                color: msg.isBot ? "#333" : "white",
                borderRadius: msg.isBot
                  ? "0 20px 20px 20px"
                  : "20px 0 20px 20px",
                fontSize: "14px",
                lineHeight: 1.4,
                boxShadow: msg.isBot
                  ? "none"
                  : "0 2px 10px rgba(66, 133, 244, 0.3)",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "14px" }}>
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Ask your question here...!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" sx={{ color: "#666" }}>
                  <AttachFileIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "#666" }}>
                  <MicIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleSendClick}
                  sx={{
                    bgcolor: "#4285f4",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#3367d6",
                    },
                    ml: 1,
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "25px",
              bgcolor: "#f8f9fa",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4285f4",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4285f4",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatBot;
