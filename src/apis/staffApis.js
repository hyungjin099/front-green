import api from "./axiosInstance";

//직종 목록 조회 API
export const selectTeacherList = async () => {
  const response = await api.get('/staff');
  return response;
};