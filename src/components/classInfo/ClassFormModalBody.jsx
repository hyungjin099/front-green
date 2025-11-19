// components/ClassFormModalBody.jsx
import React, { useEffect, useState } from 'react'
import styles from './ClassFormModalBody.module.css'
import CheckboxGroup from '../common/CheckboxGroup'
import Button from '../common/Button'
import FlotingSelect from '../common/FlotingSelect'
import FlotingInput from '../common/FlotingInput'
import FlotingDatePicker from '../common/FlotingDatePicker'
import FlotingTextarea from '../common/FlotingTextarea'
import { selectJobTypeList } from '../../apis/jobTypeApis'
import { selectClassTypeList } from '../../apis/classTypeApis'
import { selectClassRoomList } from '../../apis/classRoomApis'
import { selectStaffList } from '../../apis/staffApis'
import { insertClassInfo } from '../../apis/classInfoApis'
import { toast } from 'react-toastify';
import { useValidation } from '../../util/useValidation';
import { required, minLength, number, positiveNumber, minArrayLength } from '../../util/validationRules';

const ClassFormModalBody = ({ onClose, getClassListRecruiting }) => {
  const [jobTypeList, setJobTypeList] = useState([]);
  const [classTypeList, setClassTypeList] = useState([]);
  const [classRoomList, setClassRoomList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const {
    values: inputData,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateField,
    validateAllFields
  } = useValidation({
    jobNum: '',
    classTypeNum: '',
    classRoomNum: '',
    className: '',
    classQuota: '',
    totalStudyDay: '',
    totalStudyHour: '',
    studyHour: '',
    startDate: '',
    endDate: '',
    staffNum: '',
    startTime: '',
    endTime: '',
    studyDay: [],
    classComment: ''
  });

  useEffect(() => {
    getInitDataList()
  }, []);

  const getInitDataList = async () => {
    const [response1, response2, response3, response4] = await Promise.all([
      selectJobTypeList(),
      selectClassTypeList(),
      selectClassRoomList(),
      selectStaffList('강사')
    ]);

    setJobTypeList(response1.data);
    setClassTypeList(response2.data);
    setClassRoomList(response3.data);
    setTeacherList(response4.data);
  }

  const handleInputData = (e) => {
    const { name, value } = e.target;
    setValue(name, value);

    // 날짜 필드는 값이 변경되면 자동으로 touched 처리
    if (name === 'startDate' || name === 'endDate') {
      setTouchedField(name);
    }

    // 실시간 validation (터치된 필드만)
    const rules = getValidationRules(name);
    if (rules && touched[name]) {
      validateField(name, value, rules);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    console.log(1);
    console.log(name, value);
    setTouchedField(name);

    const rules = getValidationRules(name);
    if (rules) {
      validateField(name, value, rules);
    }
  };



  const getValidationRules = (fieldName) => {
    const rules = {
      jobNum: [required('직종을 선택해주세요.')],
      classTypeNum: [required('과정 유형을 선택해주세요.')],
      classRoomNum: [required('강의실을 선택해주세요.')],
      className: [
        required('과정명을 입력해주세요.'),
        minLength(2, '과정명은 2글자 이상 입력해주세요.')
      ],
      classQuota: [
        required('모집정원을 입력해주세요.'),
        number(),
        positiveNumber()
      ],
      totalStudyDay: [
        required('수업일수를 입력해주세요.'),
        number(),
        positiveNumber()
      ],
      totalStudyHour: [
        required('수업시간을 입력해주세요.'),
        number(),
        positiveNumber()
      ],
      studyHour: [
        required('일일 수업시간을 입력해주세요.'),
        number(),
        positiveNumber()
      ],
      startDate: [required('시작일을 선택해주세요.')],
      endDate: [required('종료일을 선택해주세요.')],
      staffNum: [required('담당 강사를 선택해주세요.')],
      startTime: [required('시작 시간을 선택해주세요.')],
      endTime: [required('종료 시간을 선택해주세요.')],
      studyDay: [
        required('수업 요일을 선택해주세요.'),
        minArrayLength(1, '최소 1개 이상의 요일을 선택해주세요.')
      ],
      classComment: [] // 선택사항이므로 빈 배열
    };
    return rules[fieldName];
  };

  const isFieldValid = (fieldName) => {
    const fieldValue = inputData[fieldName];
    const hasError = !errors[fieldName];
    const isTouched = touched[fieldName];

    if (!isTouched || errors[fieldName]) {
      return false;
    }

    // 배열인 경우
    if (Array.isArray(fieldValue)) {
      return fieldValue.length > 0;
    }

    // 문자열인 경우
    return fieldValue?.trim() !== '';
  };

  const saveClassInfo = async () => {
    // 모든 필드 validation
    const isValid = validateAllFields(getValidationRules);

    if (!isValid) {
      toast.error('입력 정보를 확인해주세요.', { containerId: 'topRight' });
      return;
    }

    await toast.promise(
      insertClassInfo(inputData),
      {
        pending: '과정 정보 등록 중... ⏳',
        success: '신규 과정이 등록되었습니다! 👌',
        error: '헐..등록 실패... '
      },
      { containerId: 'topRight' }
    );

    // 성공시 폼 초기화 및 목록 조회
    await getClassListRecruiting();

    Object.keys(inputData).forEach(key => {
      if (key === 'studyDay') {
        setValue(key, []);
      } else {
        setValue(key, '');
      }
    });
  }

  const dayOptions = [
    { value: '월', label: '월요일', color: 'green' },
    { value: '화', label: '화요일', color: 'blue' },
    { value: '수', label: '수요일', color: 'yellow' },
    { value: '목', label: '목요일', color: 'purple' },
    { value: '금', label: '금요일', color: 'red' }
  ];

  return (
    <div className={styles.modal_container}>
      <div className={styles.flex_row}>
        <FlotingSelect
          label='직종'
          name='jobNum'
          value={inputData.jobNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.jobNum}
          touched={touched.jobNum}
          isValid={isFieldValid('jobNum')}
        >
          <option value="">Choose...</option>
          {jobTypeList.map((jobType) => (
            <option key={jobType.jobNum} value={jobType.jobNum}>{jobType.jobName}</option>
          ))}
        </FlotingSelect>

        <FlotingSelect
          label='과정 유형'
          name='classTypeNum'
          value={inputData.classTypeNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classTypeNum}
          touched={touched.classTypeNum}
          isValid={isFieldValid('classTypeNum')}
        >
          <option value="">Choose...</option>
          {classTypeList.map(classType => (
            <option key={classType.classTypeNum} value={classType.classTypeNum}>{classType.classTypeName}</option>
          ))}
        </FlotingSelect>

        <FlotingSelect
          label='강의실'
          name='classRoomNum'
          value={inputData.classRoomNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classRoomNum}
          touched={touched.classRoomNum}
          isValid={isFieldValid('classRoomNum')}
        >
          <option value="">Choose...</option>
          {classRoomList.map(classRoom => (
            <option key={classRoom.classRoomNum} value={classRoom.classRoomNum}>{classRoom.classRoomName}</option>
          ))}
        </FlotingSelect>
      </div>

      <div>
        <FlotingInput
          label='과정명'
          name='className'
          value={inputData.className}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.className}
          touched={touched.className}
          isValid={isFieldValid('className')}
        />
      </div>

      <div className={styles.flex_row}>
        <FlotingInput
          label='총 수업시간'
          name='totalStudyHour'
          value={inputData.totalStudyHour}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.totalStudyHour}
          touched={touched.totalStudyHour}
          isValid={isFieldValid('totalStudyHour')}
        />
        <FlotingInput
          label='수업일수'
          name='totalStudyDay'
          value={inputData.totalStudyDay}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.totalStudyDay}
          touched={touched.totalStudyDay}
          isValid={isFieldValid('totalStudyDay')}
        />
        <FlotingInput
          label='일일 수업 시간'
          name='studyHour'
          value={inputData.studyHour}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.studyHour}
          touched={touched.studyHour}
          isValid={isFieldValid('studyHour')}
        />
      </div>

      <div className={styles.flex_row}>
        <FlotingInput
          label='모집정원'
          name='classQuota'
          value={inputData.classQuota}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classQuota}
          touched={touched.classQuota}
          isValid={isFieldValid('classQuota')}
        />
        <FlotingDatePicker
          label="시작일"
          name='startDate'
          value={inputData.startDate}
          onChange={handleInputData}
          error={errors.startDate}
          touched={touched.startDate}
          isValid={isFieldValid('startDate')}
        />
        <FlotingDatePicker
          label="종료일"
          name='endDate'
          value={inputData.endDate}
          onChange={handleInputData}
          error={errors.endDate}
          touched={touched.endDate}
          isValid={isFieldValid('endDate')}
        />
      </div>

      <div className={styles.flex_row}>
        <FlotingSelect
          label='시작 시간'
          name='startTime'
          value={inputData.startTime}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.startTime}
          touched={touched.startTime}
          isValid={isFieldValid('startTime')}
        >
          <option value="">Choose...</option>
          <option value="09:00">09:00</option>
          <option value="09:30">09:30</option>
          <option value="10:00">10:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="19:00">19:00</option>
        </FlotingSelect>
        <FlotingSelect
          label='종료 시간'
          name='endTime'
          value={inputData.endTime}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.endTime}
          touched={touched.endTime}
          isValid={isFieldValid('endTime')}
        >
          <option value="">Choose...</option>
          <option value="11:50">11:50</option>
          <option value="12:30">12:30</option>
          <option value="12:50">12:50</option>
          <option value="13:30">13:30</option>
          <option value="13:50">13:50</option>
          <option value="17:50">17:50</option>
          <option value="21:50">21:50</option>
        </FlotingSelect>
        <FlotingSelect
          label='담당 강사'
          name='staffNum'
          value={inputData.staffNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.staffNum}
          touched={touched.staffNum}
          isValid={isFieldValid('staffNum')}
        >
          <option value="">Choose...</option>
          {teacherList.map(teacher => (
            <option key={teacher.staffNum} value={teacher.staffNum}>{teacher.staffName}</option>
          ))}
        </FlotingSelect>
      </div>

      <div>
        <CheckboxGroup
          label="수업 요일"
          name="studyDay"
          value={inputData.studyDay}
          onChange={handleInputData}
          onBlur={handleBlur}
          options={dayOptions}
          error={errors.studyDay}
          touched={touched.studyDay}
          isValid={isFieldValid('studyDay')}
        />
      </div>

      <div>
        <FlotingTextarea
          label='비고'
          rows={5}
          name='classComment'
          value={inputData.classComment}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classComment}
          touched={touched.classComment}
          isValid={isFieldValid('classComment')}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '0.7rem'
      }}>
        <Button variant='cancel' onClick={onClose}>취소</Button>
        <Button onClick={saveClassInfo}>등록</Button>
      </div>
    </div>
  )
}

export default ClassFormModalBody