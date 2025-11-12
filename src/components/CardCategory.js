import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Skeleton,
  Avatar,
  Badge,
  Collapse,
  Box,
} from "@mui/material";

export default function CardCa({ loading = false, data, selected, onSelect, expanded }) {
  const Icon = data?.icon;

  const handleClick = () => {
    onSelect?.(data);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        backgroundColor: "#f0f2f3",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
        borderRadius: 2,
        overflow: "hidden", // border-radius가 안쪽 박스에도 적용
      }}
    >
      {/* 🔹 바깥쪽 헤더 박스 */}
      <Box
        sx={{
          backgroundColor: selected ? "#cecfd1" : "#d9d9d9", // 헤더 전체 배경
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          p: 0.7,
        }}
      >
        <Avatar sx={{ width: 40, height: 40, mr: 1, background: 'white' }}>
          {/* {Icon && <Icon sx={{ fontSize: 30 }} />} */}
          {React.cloneElement(data.icon)}
        </Avatar>
        <Typography sx={{ fontWeight: "bold", fontSize: 13, color: selected ? "#fcfcfcff" : "#5e5d5dff" }}>
          {data.label}
        </Typography>
      </Box>

      {/* 🔹 Collapse + Content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>

        <Box sx={{ flexGrow: 1, pt: 0.5, px: 0.5, pb: 0.5 }}>
          {/* 🔹 Collapse + Content */}
          <Box
            sx={{
              p: 0.5,
              backgroundColor: "#ffffff",
              borderRadius: 1.5,
              display: "flex",
              flexDirection: "column",
              //gap: 0.5,              
              fontSize: 12,
              color: "#333",
            }}
          >
            {data.content.split("\n").map((line, idx) => (
              <Box
                key={idx}
                sx={{
                  fontWeight: idx === 0 ? "bold" : "normal",
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: 12,
                  gap: 0.5,
                  //mt: 0.5
                }}
              >
                {line}&nbsp;
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}
