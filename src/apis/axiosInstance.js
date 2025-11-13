import axios from "axios";

// 공통 설정을 가진 axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  //baseURL: window.env?.SPRING_SERVER_URL, // 백엔드 주소
  timeout: 5000, // 요청 제한 시간
  headers: {
    "Content-Type": "application/json",
  },
});



export default api;