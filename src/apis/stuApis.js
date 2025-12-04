import api from "./axiosInstance";

//학생 등록 시 중복 학생 체크를 위한 학생 목록 정보 조회API
export const selectStuListForCheckDuplicate = async (stuInfo) => {
  const response = await api.get('/stu/list-check-duplicate', {params : stuInfo});
  return response;
};