import React, { useEffect, useState } from 'react'
import styles from './ClassFormModalBody.module.css'
import Select from '../common/Select'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Checkbox from '../common/Checkbox'
import BtnCheckbox from '../common/BtnCheckbox'
import DatePicker from '../common/DatePicker'
import Button from '../common/Button'
import { selectJobTypeList } from '../../apis/jobTypeApis'
import { selectClassTypeList } from '../../apis/classTypeApis'
import { selectClassRoomList } from '../../apis/classRoomApis'
import { selectTeacherList } from '../../apis/staffApis'
import { insertClassInfo } from '../../apis/classInfoApis'
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_orange.css"
// import { Korean } from "flatpickr/dist/l10n/ko.js";

const ClassFormModalBody = () => {
  //직종 목록 저장 변수
  const [jobTypeList, setJobTypeList] = useState([]);

  //과정 유형 목록 저장 변수
  const [classTypeList, setClassTypeList] = useState([]);

  //강의실 목록 저장 변수
  const [classRoomList, setClassRoomList] = useState([]);

  //강사 목록 저장 변수
  const [teacherList, setTeacherList] = useState([]);

  //과정 정보 저장 변수
  const [inputData, setInputData] = useState({
    jobNum : '',
    classTypeNum : '',
    classRoomNum : '',
    className : '',
    classQuota : '',
    totalStudyDay : '',
    studyHour : '',
    startDate :'',
    endDate : '',
    staffNum : '',
    startTime : '',
    endTime : '',
    studyDay : [],
    classComment : ''
  });

  console.log(inputData)

  useEffect(() => {
    //직종 목록 조회
    getInitDataList()
  }, []);

  //초기 목록 조회 함수
  const getInitDataList = async () => {
    const response1 = await selectJobTypeList();
    console.log(response1.data)
    setJobTypeList(response1.data);

    const response2 = await selectClassTypeList();
    console.log(response2.data)
    setClassTypeList(response2.data);

    const response3 = await selectClassRoomList();
    console.log(response3.data)
    setClassRoomList(response3.data);

    const response4 = await selectTeacherList();
    console.log(response4.data)
    setTeacherList(response4.data);
  }

  const handleInputData = (e) => {
    e.target.name === 'studyDay' 
    ?
    setInputData(prev => ({
      ...prev,
      studyDay : e.target.checked ? 
                  [...inputData.studyDay, e.target.value] : 
                  inputData.studyDay.filter(item => item !== e.target.value)
    })) 
    :
    setInputData({
      ...inputData,
      [e.target.name] : e.target.value
    });
  };

  //과정 등록 함수
  const saveClassInfo = async () => {
    await insertClassInfo(inputData);
  }
    

  return (
    <div className={styles.modal_container}>
      <div className={styles.flex_row}>
        <Select label='직종' name='jobNum' value={inputData.jobNum} onChange={e => handleInputData(e)}>
          <option value="">Choose...</option>
          {
            jobTypeList.map((jobType) => (
              <option key={jobType.jobNum} value={jobType.jobNum}>{jobType.jobName}</option>
            ))
          }
        </Select>
        <Select label='과정 유형' name='classTypeNum' value={inputData.classTypeNum} onChange={e => handleInputData(e)}>
          <option value="">Choose...</option>
          {
            classTypeList.map(classType => (
              <option key={classType.classTypeNum} value={classType.classTypeNum}>{classType.classTypeName}</option>
            ))
          }
        </Select>
        <Select label='강의실' name='classRoomNum' value={inputData.classRoomNum} onChange={e => handleInputData(e)}>
          <option value="">Choose...</option>
          {
            classRoomList.map(classRoom => (
              <option key={classRoom.classRoomNum} value={classRoom.classRoomNum}>{classRoom.classRoomName}</option>
            ))
          }
        </Select>
      </div>
      <div>
        <Input label='과정명' name='className' value={inputData.className} onChange={e => handleInputData(e)}/>
      </div>
      <div className={styles.flex_row}>
        <Input label='모집정원' name='classQuota' value={inputData.classQuota} onChange={e => handleInputData(e)}/>
        <Input label='수업일수' name='totalStudyDay' value={inputData.totalStudyDay} onChange={e => handleInputData(e)}/>
        <Input label='일일 수업 시간' name='studyHour' value={inputData.studyHour} onChange={e => handleInputData(e)}/>
      </div>
      <div className={styles.flex_row}>
        
        <DatePicker 
          label="시작일"
          name='startDate' value={inputData.startDate} onChange={e => handleInputData(e)}
          //onChange={(date) => console.log(date)}
          options={{
            //enableTime: true,
            //dateFormat: 'Y-m-d H:i',
            //time_24hr: true
          }}
        />
        <DatePicker 
          label="종료일"
          name='endDate' value={inputData.endDate} onChange={e => handleInputData(e)}
          options={{
            //enableTime: true,
            //dateFormat: 'Y-m-d H:i',
            //time_24hr: true
          }}
        />
        <Select label='담당 강사' name='staffNum' value={inputData.staffNum} onChange={e => handleInputData(e)}>
          <option value="">Choose...</option>
          {
            teacherList.map(teacher => (
              <option key={teacher.staffNum} value={teacher.staffNum}>{teacher.staffName}</option>
            ))
          }
        </Select>
      </div>
      <div className={styles.flex_row}>
        <Select label='시작 시간' name='startTime' value={inputData.startTime} onChange={e => handleInputData(e)}>
          <option value="">Choose...</option>
          <option value="09:00">09:00</option>
          <option value="09:30">09:30</option>
          <option value="10:00">10:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="19:00">19:00</option>
        </Select>
        <Select label='종료 시간' name='endTime' value={inputData.endTime} onChange={e => handleInputData(e)}>
          <option value="">Choose...</option>
          <option value="11:50">11:50</option>
          <option value="12:30">12:30</option>
          <option value="12:50">12:50</option>
          <option value="13:30">13:30</option>
          <option value="13:50">13:50</option>
          <option value="17:50">17:50</option>
          <option value="21:50">21:50</option>
        </Select>
      </div>
      <div>
        <p className={styles.week_p}>수업 요일</p>
        <div className={styles.week_div}>
          <BtnCheckbox
            label="월요일"
            name="studyDay"
            color="green"  // 색상 지정!
            checked={inputData.studyDay.includes('월요일')}
            onChange={e => handleInputData(e)}
            value="월요일"
          />
          <BtnCheckbox
            label="화요일"
            name="studyDay"
            color="blue"  // 색상 지정!
            checked={inputData.studyDay.includes('화요일')}
            onChange={e => handleInputData(e)}
            value="화요일"
          />
          <BtnCheckbox
            label="수요일"
            name="studyDay"
            color="yellow"  // 색상 지정!
            checked={inputData.studyDay.includes('수요일')}
            onChange={e => handleInputData(e)}
            value="수요일"
          />
          <BtnCheckbox
            label="목요일"
            name="studyDay"
            color="purple"  // 색상 지정!
            checked={inputData.studyDay.includes('목요일')}
            onChange={e => handleInputData(e)}
            value="목요일"
          />
          <BtnCheckbox
            label="금요일"
            name="studyDay"
            color="red"  // 색상 지정!
            checked={inputData.studyDay.includes('금요일')}
            onChange={e => handleInputData(e)}
            value="금요일"
          />
        </div>
      </div>
      <div>
        <Textarea label='비고' rows={5} name='classComment' value={inputData.classComment} onChange={e => handleInputData(e)}/>
      </div>
      <div style={{
        display:'flex',
        justifyContent : 'end',
        gap:'0.7rem'
      }}>
        <Button variant='secondary'>취소</Button>
        <Button onClick={e => saveClassInfo()}>등록</Button>
      </div>
    </div>
  )
}

export default ClassFormModalBody