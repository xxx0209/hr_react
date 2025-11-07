import axios from "axios";
import { API_BASE_URL } from "../config/config";

//Axios 인스턴스 생성 
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, //쿠키를 자동으로 포함 JWT를 HttpOnly 쿠키에 저장했다면 필수 설정 서버 응답 쿠키도 자동으로 저장됨
});

//서버 응답을 가로채서 전처리/후처리하는 로직

 



//로그인 세션 자동 연장 기능
api.interceptors.response.use(
  response => response,
  async error => {
    
    //현재 실패한 요청의 설정을 저장합니다.(URL, 헤더, 본문 등 포함)
    const originalRequest = error.config;
    
    //AccessToken 만료 시 재발급
    //401 Unauthorized → Access Token이 만료됐다는 뜻
    //_retry → 같은 요청이 무한 반복되지 않도록 체크하는 플래그
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      //재발급 시도  
      originalRequest._retry = true;
      try {
        // refresh 요청은 기본 axios 사용 (무한루프 방지)
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    //토큰 만료가 아닌 다른 오류는 그냥 일반 에러로 전달합니다.
    return Promise.reject(error);
  }
);

export default api;