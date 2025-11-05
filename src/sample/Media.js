import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { Avatar, Badge, Divider } from '@mui/material';

// ✅ 화면 전환 예시용 — 실제로는 원하는 컴포넌트로 교체
// import SchedulePage from './SchedulePage';
// import CategoryPage from './CategoryPage';

// 단일 카드 컴포넌트
export default function Media({ loading = false, data, selected, onSelect }) {
  const Icon = data?.icon;

  const handleClick = () => {
    onSelect(data); // ✅ 클릭 시 해당 데이터 전달
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        backgroundColor: selected ? "#cecfd1ff" : "white",
        border: selected ? "1px solid #141414ff" : "1px solid #ddd",
        color: selected ? "#000" : "inherit",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: 4 },
        width: "100%", // grid 셀에 맞춰 자동
        height: "auto", // 내용에 맞게 높이 자동
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        sx={{
          backgroundColor: '#f5f5f5',
          color: 'text.primary',
          '& .MuiCardHeader-title': { fontWeight: 'bold' },
          '& .MuiCardHeader-subheader': { color: 'text.secondary' },
        }}
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" width={45} height={45} />
          ) : (
            <Badge overlap="circular" badgeContent={4} color="error">
              <Avatar alt="icon" sx={{ width: 45, height: 45 }}>
                {Icon && <Icon sx={{ fontSize: 45 }} />}
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
      <Divider sx={{ my: 0, borderBottomWidth: 2, borderColor: '#bdbdbd' }} />


      <CardContent sx={{ flexGrow: 1 }}>
        {loading ? (
          <>
            <Skeleton animation="wave" height={10} sx={{ mb: 1 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </>
        ) : (
          <Typography variant="body2" sx={{ color: selected ? '#f5f7f8ff' : 'inherit', whiteSpace: 'pre-line' }}>
            {data.content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}