import React, { useEffect, useState } from 'react'
import styles from './ClacEndDateModalBody.module.css'
import Input from '../common/Input'
import DatePicker from '../common/DatePicker'
import { minArrayLength, number, positiveNumber, required } from '../../util/validationRules'
import BtnCheckbox from '../common/BtnCheckbox'
import { getHolidayList } from '../../apis/classInfoApis'
import Button from '../common/Button'
import { toast } from 'react-toastify'

//과정 종료일 계산 모달 바디
const ClacEndDateModalBody = ({onClose}) => {
  //계산 기본 데이터
  const [calcData, setCalcData] = useState({
    totalStudyHour: '',
    studyHour: '',
    startDate: '',
    endDate: '',
    studyDay: [],
  });

  //계산 결과 데이터
  const [periods, setPeriods] = useState([]);

  console.log(calcData)

  //종료일 및 단위기간 세팅 함수
  const calcResult = async () => {
    const holidays = await getHolidayList();
    const calcedEndData = calculateEndDate(
      parseInt(calcData.totalStudyHour), 
      parseInt(calcData.studyHour), 
      calcData.startDate, 
      calcData.studyDay, 
      holidays
    );
    
    const periods = calculatePeriodsWithClassDays(
      calcData.startDate, 
      calcedEndData, 
      calcData.studyDay, 
      holidays
    )

    console.log(periods);

    setCalcData({
      ...calcData,
      endDate : calcedEndData
    });

    setPeriods(periods);
  }

  //유효성 검사
  const checkIsValid = () => {
    let result = true;
    if(calcData.totalStudyHour.toString().trim() === '' || !/^\d+$/.test(calcData.totalStudyHour || parseInt(calcData.totalStudyHour) <= 0)){
      result = false;
    }
    if(calcData.studyHour.toString().trim() === '' || !/^\d+$/.test(calcData.studyHour || parseInt(calcData.studyHour) <= 0)){
      result = false;
    }
    if(calcData.startDate.toString().trim() === ''){
      result = false;
    }
    if(calcData.studyDay.length === 0){
      result = false;
    }
    return result
  }

  //토스트 사용을 위해!
  const handleCalc = async () => {
    const isValid = checkIsValid();

    if (!isValid) {
      toast.error('입력 정보를 확인해주세요.', { containerId: 'topRight' });
      return;
    }

    try {
      await toast.promise(
        calcResult(),
        {
          pending: '공공 데이터 조회 중... ⏳',
          success: '계산 완료! 👌',
          error: '계산 실패... 😞'
        },
        { containerId: 'topRight' }
      );
    } catch (error) {
      console.error('계산 오류:', error);
    }
  };

  //종료일 계산 함수
  function calculateEndDate(totalHours, dailyHours, startDate, classDays, holidays) {
    const start = new Date(startDate);
    let currentDate = new Date(start);
    let accumulatedHours = 0;
    const targetHours = totalHours;
    
    // 요일 문자열을 숫자로 매핑 (일:0, 월:1, 화:2, 수:3, 목:4, 금:5, 토:6)
    const dayMap = {
      '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6,
      'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
    };
    
    // 수업요일을 숫자 배열로 변환
    const classDayNumbers = classDays.map(day => 
      typeof day === 'string' ? dayMap[day.toLowerCase()] : day
    );
    
    // 휴강일을 Set으로 변환 (빠른 검색을 위해)
    const holidaySet = new Set(holidays.map(date => date));
    
    // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // 주말인지 확인하는 함수
    const isWeekend = (date) => {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    };
    
    // 다음 평일로 이동하는 함수
    const moveToNextWeekday = (date) => {
      const result = new Date(date);
      while (isWeekend(result)) {
        result.setDate(result.getDate() + 1);
      }
      return result;
    };
    
    // 목표 시간에 도달할 때까지 반복
    let cnt = 0;
    while (accumulatedHours < targetHours) {
      //console.log(accumulatedHours);
      //if(cnt >= 5) break;
      const currentDateStr = formatDate(currentDate);
      const dayOfWeek = currentDate.getDay();
      
      // 수업 요일이고 휴강일이 아니면 훈련 시간 누적
      if (classDayNumbers.includes(dayOfWeek) && !holidaySet.has(currentDateStr)) {
        accumulatedHours += dailyHours;
      }
      
      // 목표 시간에 도달했는지 확인
      if (accumulatedHours < targetHours) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // 종료일이 주말이면 다음 평일로 이동
    if (isWeekend(currentDate)) {
      currentDate = moveToNextWeekday(currentDate);
    }
    
    return formatDate(currentDate);
  }

  //단위 기간 계산 함수
  function calculatePeriodsWithClassDays(startDate, endDate, classDays, holidays) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // 요일 문자열을 숫자로 매핑 (일:0, 월:1, 화:2, 수:3, 목:4, 금:5, 토:6)
    const dayMap = {
      '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6,
      'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
    };
    
    // 수업요일을 숫자 배열로 변환
    const classDayNumbers = classDays.map(day => 
      typeof day === 'string' ? dayMap[day.toLowerCase()] : day
    );
    
    // 공휴일을 Set으로 변환 (빠른 검색)
    const holidaySet = new Set(holidays);
    
    // 특정 기간 동안의 수업일수를 계산하는 함수
    const countClassDays = (periodStart, periodEnd) => {
      let count = 0;
      let currentDate = new Date(periodStart);
      
      while (currentDate <= periodEnd) {
        const dateStr = formatDate(currentDate);
        const dayOfWeek = currentDate.getDay();
        
        // 수업 요일이고, 공휴일이 아니면 카운트
        if (classDayNumbers.includes(dayOfWeek) && !holidaySet.has(dateStr)) {
          count++;
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return count;
    };
    
    const periods = [];
    let periodNumber = 1;
    let currentStart = new Date(start);
    
    while (currentStart <= end) {
      // 현재 단위기간의 시작일 날짜
      const currentStartDay = currentStart.getDate();
      
      // 한 달 후의 년/월 계산
      let nextMonth = currentStart.getMonth() + 1;
      let nextYear = currentStart.getFullYear();
      
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }
      
      // 다음 달의 마지막 날 확인
      const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
      
      // 단위기간 종료일 계산
      let currentEnd;
      if (currentStartDay <= lastDayOfNextMonth) {
        currentEnd = new Date(nextYear, nextMonth, currentStartDay - 1);
      } else {
        currentEnd = new Date(nextYear, nextMonth, lastDayOfNextMonth);
      }
      
      // 전체 종료일을 넘지 않도록
      if (currentEnd > end) {
        currentEnd = new Date(end);
      }
      
      // 이 단위기간의 수업일수 계산
      const classDaysCount = countClassDays(currentStart, currentEnd);
      
      periods.push({
        단위기간: periodNumber,
        시작일: formatDate(currentStart),
        종료일: formatDate(currentEnd),
        수업일: classDaysCount
      });
    
    // 종료 조건 확인
    if (currentEnd >= end) {
      break;
    }
    
    // 다음 단위기간 시작일
    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
    periodNumber++;
  }
  
  return periods;
}

  const handleInputData = (e) => {
    const { name, value } = e.target;

    if(name === 'studyDay' ){
      setCalcData({
        ...calcData,
        studyDay: e.target.checked ? [...calcData.studyDay, value] : calcData.studyDay.filter(v => v !== value)
      })
    }   
    else{
      setCalcData({
        ...calcData,
        [name]: value,
      });
    }
  };
    
  return (
    <div className={styles.modal_container}>
      <div>
        <h3 className={styles.list_title}>과정 정보</h3>
        <table className={styles.list_table}>
          <colgroup>
            <col width='14%'/>
            <col width='18%'/>
            <col width='14%'/>
            <col width='*'/>
            <col width='16%'/>
          </colgroup>
          <thead>
            <tr>
              <td>총 훈련시간</td>
              <td>훈련 시작일</td>
              <td>1일 훈련 시간</td>
              <td>훈련 요일</td>
              <td>훈련 종료일</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Input
                  name="totalStudyHour"
                  type="text"
                  value={calcData.totalStudyHour}
                  onChange={handleInputData}
                  style={{paddingRight:'0.9rem'}}
                  // onBlur={handleBlur}
                  // error={errors.totalStudyHour}
                  // touched={touched.totalStudyHour}
                  // isValid={isFieldValid('totalStudyHour')}
                />
              </td>
              <td>
                <DatePicker
                  name='startDate'
                  value={calcData.startDate}
                  onChange={handleInputData}
                  style={{paddingRight:'0.9rem'}}
                  // error={errors.startDate}
                  // touched={touched.startDate}
                  // isValid={isFieldValid('startDate')}
                />
              </td>
              <td>
                <Input
                  name="studyHour"
                  type="text"
                  value={calcData.studyHour}
                  onChange={handleInputData}
                  style={{paddingRight:'0.9rem'}}
                  // onBlur={handleBlur}
                  // error={errors.studyHour}
                  // touched={touched.studyHour}
                  // isValid={isFieldValid('studyHour')}
                />
              </td>
              <td>
                <div className={styles.checkbox_div}>
                  <BtnCheckbox 
                    name='studyDay' label='월' color='green' value='월' 
                    checked={calcData.studyDay.includes('월')} 
                    onChange={handleInputData}
                  />
                  <BtnCheckbox 
                    name='studyDay' label='화' color='blue' value='화' 
                    checked={calcData.studyDay.includes('화')} 
                    onChange={handleInputData}
                  />
                  <BtnCheckbox 
                    name='studyDay' label='수' color='yellow' value='수' 
                    checked={calcData.studyDay.includes('수')} 
                    onChange={handleInputData}
                  />
                  <BtnCheckbox 
                    name='studyDay' label='목' color='purple' value='목' 
                    checked={calcData.studyDay.includes('목')} 
                    onChange={handleInputData}
                  />
                  <BtnCheckbox 
                    name='studyDay' label='금' color='red' value='금' 
                    checked={calcData.studyDay.includes('금')} 
                    onChange={handleInputData}
                  />
                </div>
              </td>
              <td>
                <Input
                  name="search"
                  type="text"
                  readOnly={true}
                  value={calcData.endDate}
                  style={{paddingRight:'0.9rem'}}
                  // onChange={handleSearch}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h3 className={styles.list_title}>단위 기간 정보</h3>
        <table className={styles.result_table}>
          <thead>
            <tr>
              <td>단위기간</td>
              <td>단위기간 시작일</td>
              <td>단위기간 종료일</td>
              <td>실 수업일수</td>
            </tr>
          </thead>
          <tbody>
          {
            periods.length > 0
            ?
            periods.map((rowData, i) => {
              return (
                <tr key={i}>
                  <td>{rowData.단위기간}</td>
                  <td>{rowData.시작일}</td>
                  <td>{rowData.종료일}</td>
                  <td>{rowData.수업일}일</td>
                </tr>
              )
            })
            :
            <tr>
              <td colSpan={4}>계산 버튼을 클릭하면 단위기간 정보가 나옵니다.</td>
            </tr>
          }  
          </tbody>
        </table>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '0.7rem'
      }}>
        <Button variant='cancel' onClick={() => onClose()}>취소</Button>
        <Button 
          variant='secondary' 
          onClick={() => {
            setCalcData({
              totalStudyDay: '',
              totalStudyHour: '',
              studyHour: '',
              startDate: '',
              endDate: '',
              studyDay: [],
            });

            setPeriods([]);
          }}>리셋</Button>
        <Button onClick={() => handleCalc()}>계산</Button>
      </div>
    </div>
  )
}

export default ClacEndDateModalBody