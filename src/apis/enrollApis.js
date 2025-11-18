import api from "./axiosInstance";

//학생 등록 시 기등록 학생 확인을 위한 조회 API
export const selectEnrollListForCheckDuplicate = async (stuInfo) => {
  const response = await api.get('/enroll/list-for-check-duplicate', {params : stuInfo});
  return response;
};