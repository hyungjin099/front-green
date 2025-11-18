// components/ClassFormModalBody.jsx
import React, { useEffect, useState } from 'react'
import styles from './StuRegModalBody.module.css'
import Button from '../common/Button'
import FlotingInput from '../common/FlotingInput'
import FlotingDatePicker from '../common/FlotingDatePicker'
import FlotingSelect from '../common/FlotingSelect'
import { insertClassInfo, selectClassListRecruiting } from '../../apis/classInfoApis'
import { toast } from 'react-toastify';
import { useValidation } from '../../util/useValidation';
import { required, minLength, number, positiveNumber, minArrayLength } from '../../util/validationRules';
import BtnRadio from '../common/BtnRadio'
import { selectEnrollListForCheckDuplicate } from '../../apis/enrollApis'

const ClassFormModalBody = ({ onClose }) => {
  //모집 중인 과정 목록
  const [classList, setClassList] = useState([]);

  //등록 버튼 활성화 여부
  const [btnDisable, setBtnDisable] = useState(true);

  const {
    values: inputData,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateField,
    validateAllFields
  } = useValidation({
    stuName: '',
    stuBirthday: '',
    stuPhone: '',
    classNum: '',
    classComment: '',
    isDuplicate : 'N'
  });

  useEffect(() => {
    getClassListRecruiting();
  }, []);

  //모집 중 과정 목록 조회 함수
  const getClassListRecruiting = async () => {
    const respose = await selectClassListRecruiting();
    setClassList(respose.data);
  };

  const handleInputData = (e) => {
    const { name, value } = e.target;
    setValue(name, value);

    // 날짜 필드는 값이 변경되면 자동으로 touched 처리
    if (name === 'stuBirthday') {
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
    setTouchedField(name);

    const rules = getValidationRules(name);
    if (rules) {
      validateField(name, value, rules);
    }
  };



  const getValidationRules = (fieldName) => {
    const rules = {
      stuName: [
        required('훈련생명을 입력해주세요.'),
        minLength(2, '2글자 이상 입력해주세요.')
      ],
      stuBirthday: [required('생년월일을 선택해주세요.')],
      classNum: [required('상담 신청 과정을 선택해주세요.')],

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

  //등록 확인 버튼 클릭 시 기등록 학생 확인 함수
  const checkDuplicate = async() => {
    const param = {stuName : inputData.stuName, stuBirthday : inputData.stuBirthday}
    const response = await selectEnrollListForCheckDuplicate(param);
    console.log('res', response.data);

    if(response.data.length === 0){
      toast.info('미등록 훈련생입니다. 👌', { containerId: 'center' });
      setBtnDisable(false);
    }

  };

  return (
    <div className={styles.modal_container}>
      <div className={styles.flex_row}>
        <div style={{display:'flex', width:'50%', gap:'0.5rem'}}>
          <BtnRadio name='isDuplicate' value='N' color='green' label='미등록 훈련생' readOnly={true} checked={inputData.isDuplicate === 'N'}/>
          <BtnRadio name='isDuplicate' value='Y'color='blue' label='기등록 훈련생' readOnly={true} checked={inputData.isDuplicate === 'Y'}/>
        </div>
        <Button 
          variant='success' 
          onClick={checkDuplicate}
          style={{maxHeight : '48px'}}
        >등록 확인</Button>
      </div>
      <div className={styles.flex_row}>
        <FlotingInput
          label='학생명'
          name='stuName'
          value={inputData.stuName}
          onChange={e => {
            handleInputData(e);
            setBtnDisable(true);
          }}
          onBlur={handleBlur}
          error={errors.stuName}
          touched={touched.stuName}
          isValid={isFieldValid('stuName')}
        />
        <FlotingDatePicker
          label="생년월일"
          name='stuBirthday'
          value={inputData.stuBirthday}
           onChange={e => {
            handleInputData(e);
            setBtnDisable(true);
          }}
          error={errors.stuBirthday}
          touched={touched.stuBirthday}
          isValid={isFieldValid('stuBirthday')}
        />
       
      </div>
      <div className={styles.flex_row}>
        <FlotingInput
          label='연락처'
          name='stuPhone'
          value={inputData.stuPhone}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.stuPhone}
          touched={touched.stuPhone}
          isValid={isFieldValid('stuPhone')}
        />
        <FlotingSelect
          label='상담 과정명'
          name='classNum'
          value={inputData.classNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classNum}
          touched={touched.classNum}
          isValid={isFieldValid('classNum')}
        >
          <option value="">Choose...</option>
          {classList.map(classInfo => (
            <option key={classInfo.classNum} value={classInfo.classNum}>{classInfo.classInfoVO.className} | {classInfo.classInfoVO.startDate}</option>
          ))}
        </FlotingSelect>
      </div>
      <div>
        <FlotingSelect
          label='상담 과정명'
          name='classNum'
          value={inputData.classNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classNum}
          touched={touched.classNum}
          isValid={isFieldValid('classNum')}
        >
          <option value="">Choose...</option>
          {classList.map(classInfo => (
            <option key={classInfo.classNum} value={classInfo.classNum}>{classInfo.classInfoVO.className} | {classInfo.classInfoVO.startDate}</option>
          ))}
        </FlotingSelect>
      </div>

     

      <div style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '0.7rem'
      }}>
        <Button variant='cancel' onClick={onClose}>취소</Button>
        <Button onClick={saveClassInfo} disabled={btnDisable}>등록</Button>
      </div>
    </div>
  )
}

export default ClassFormModalBody