import api from "./axiosInstance";

//신규 상담 등록 API
export const insertNewConsult = async (consultInfo) => {
  const response = await api.post('/consult', consultInfo);
  return response;
};

//신규 학생 등록 시 상담 이력 조회 API
export const selectConsulttHistory = async (stuNum) => {
  const response = await api.get(`/consult/history/${stuNum}`);
  return response;
};

//동일 학생이 한 과정에 중복 상담 체크인지 확인 API
export const getIsPossibleAdd = async (consultInfo) => {
  const response = await api.get('/consult/is-possible-add', {params : consultInfo});
  return response;
};