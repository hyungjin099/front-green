import axios from "axios";
import api from "./axiosInstance";

//과정 등록 API
export const insertClassInfo = async (classData) => {
  const response = await api.post('/cls', classData);
  return response;
};

//모집 중인 과정 목록 API
export const selectClassListRecruiting = async () => {
  const response = await api.get('/cls/recruiting');
  return response;
};

//공공데이터 공휴일 목록 조회 API
export const getHolidayList = async () => {
  const SERVICE_KEY = 'FMrpIzg0+ITj9WySp4x25d6Oh54CcjUBczr8GQ4/gsuRCmC9ybThYuhVqRN+WBDkQF3EleFDtX6LbzJmZjxf0w==';
  const nowYear = new Date().getFullYear();
  const prevYear = nowYear - 1;
  const nextvYear = nowYear + 1;

  try{
    const [response1, response2, response3] = await Promise.all([
      axios.get(
        'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo',
        {
          params: {
            serviceKey: SERVICE_KEY,
            solYear: prevYear,
            numOfRows : 30,
            _type: 'json'
          }
        }
      ),
      axios.get(
        'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo',
        {
          params: {
            serviceKey: SERVICE_KEY,
            solYear: nowYear,
            numOfRows : 30,
            _type: 'json'
          }
        }
      ),
      axios.get(
        'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo', 
        {
          params: {
            serviceKey: SERVICE_KEY,
            solYear: nextvYear,
            numOfRows : 30,
            _type: 'json'
          }
        }
      )
    ]);

    const preList = response1.data.response.body.items.item.map(item => 
      `${item.locdate.toString().slice(0, 4)}-${item.locdate.toString().slice(4, 6)}-${item.locdate.toString().slice(6, 8)}`
    );

    const nowList = response2.data.response.body.items.item.map(item => 
      `${item.locdate.toString().slice(0, 4)}-${item.locdate.toString().slice(4, 6)}-${item.locdate.toString().slice(6, 8)}`
    );

    const nextList = response3.data.response.body.items.item.map(item => 
      `${item.locdate.toString().slice(0, 4)}-${item.locdate.toString().slice(4, 6)}-${item.locdate.toString().slice(6, 8)}`
    );

    const holidayList = [
      ...preList,
      ...nowList,
      ...nextList
    ];

    return holidayList || [];
  }catch(e){
    console.error(e);
    throw e;
  }
}