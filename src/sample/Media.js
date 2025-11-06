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
} from "@mui/material";

export default function Media({ loading = false, data, selected, onSelect, expanded }) {
  const Icon = data?.icon;

  const handleClick = () => {
    onSelect?.(data);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        backgroundColor: "white",
        border: selected ? "1px solid #b9b8b8ff" : "1px solid #ddd",
        color: selected ? "#000" : "inherit",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: 0 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "none", // 기본 그림자 제거

      }}
    >
     <CardHeader
        sx={{
          backgroundColor: selected ?  "#cecfd1ff" : "white",
          "& .MuiCardHeader-title": { fontWeight: "bold" },
          borderBottom: "1px solid #fab2b2ff", // ← 여기서 border 지정
          py: 1,
          px: 2,
          minHeight: 48,
          display: "flex",
          alignItems: "center", // CardHeader 전체 세로 중앙
          userSelect: "none", // 텍스트 선택 방지
        }}
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" width={45} height={45} />
          ) : (
            <Badge
              overlap="circular"
              badgeContent={4}
              color="error"
              sx={{
                display: "flex",        // Badge 자체를 flex로
                alignItems: "center",   // 세로 중앙
                justifyContent: "center",
              }}
            >
              <Avatar alt="icon" sx={{ width: 40, height: 40 }}>
                {Icon && <Icon sx={{ fontSize: 30 }} />}
              </Avatar>
            </Badge>
          )
        }
        title={
          loading ? (
            <Skeleton animation="wave" height={10} width="80%" sx={{ mb: 1 }} />
          ) : (
            data.label
          )
        }
      />
      

      {/* ✅ Collapse로 열림/닫힘 제어*/}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ flexGrow: 1 }}>
          {loading ? (
            <>
              <Skeleton animation="wave" height={10} sx={{ mb: 1 }} />
              <Skeleton animation="wave" height={10} width="80%" />
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: selected ? "#000" : "inherit",
                whiteSpace: "pre-line",
                userSelect: "none", // 텍스트 선택 방지
              }}
            >
              {data.content}
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
