import api from "./axiosInstance";

//직종 목록 조회 API
export const selectClassTypeList = async () => {
  try {
    const response = await api.get('/class-type');
    return response;
  } catch (e) {
    console.error('과정 유형 목록 조회(selectClassTypeList) 중 오류 발생');
    console.log(e);
  }
};