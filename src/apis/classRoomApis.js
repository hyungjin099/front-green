import api from "./axiosInstance";

//직종 목록 조회 API
export const selectClassRoomList = async () => {
  try {
    const response = await api.get('/class-room');
    return response;
  } catch (e) {
    console.error('강의실 목록 조회(selectClassRoomList) 중 오류 발생');
    console.log(e);
  }
};