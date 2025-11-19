import api from "./axiosInstance";

//직종 목록 조회 API
export const selectStaffList = async (staffTask) => {
  staffTask = staffTask === undefined ? '' : staffTask
  const response = await api.get('/staff', {params : {staffTask : staffTask }});
  return response;
};