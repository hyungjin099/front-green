import api from "./axiosInstance";

//직종 목록 조회 API
export const selectTeacherList = async () => {
  try {
    const response = await api.get('/staff');
    return response;
  } catch (e) {
    console.error('강사 목록 조회(selectStaffList) 중 오류 발생');
    console.log(e);
  }
};