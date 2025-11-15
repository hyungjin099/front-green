import api from "./axiosInstance";

//직종 목록 조회 API
export const selectClassRoomList = async () => {
  const response = await api.get('/class-room');
  return response;
};