import api from "./axiosInstance";

//직종 목록 조회 API
export const selectClassTypeList = async () => {
  const response = await api.get('/class-type');
  return response;
};