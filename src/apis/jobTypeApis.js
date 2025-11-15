import api from "./axiosInstance";

//직종 목록 조회 API
export const selectJobTypeList = async () => {
  const response = await api.get('/job-type'); 
  return response;
};