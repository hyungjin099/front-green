import api from "./axiosInstance";

//직종 목록 조회 API
export const selectJobTypeList = async () => {
  try {
    const response = await api.get('/job-type'); 
    return response;
  } catch (e) {
    console.error('직종 목록 조회(getJobTypeList) 중 오류 발생');
    console.log(e);
  }
};