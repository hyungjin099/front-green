import api from "./axiosInstance";

//신규 상담 등록 API
export const insertNewConsult = async (consultInfo) => {
  const response = await api.post('/consult', consultInfo);
  return response;
};

//신규 학생 등록 시 상담 이력 조회 API
export const selectConsulttHistory = async (stuInfo) => {
  const response = await api.get('/consult/history', {params : stuInfo});
  return response;
};