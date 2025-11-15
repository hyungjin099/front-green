import api from "./axiosInstance";

//직종 목록 조회 API
export const insertClassInfo = async (classData) => {
    const response = await api.post('/cls', classData);
    return response;
};