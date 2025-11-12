import React, { useState } from 'react'
import styles from './ClassFormModalBody.module.css'
import Select from '../common/Select'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Checkbox from '../common/Checkbox'
import BtnCheckbox from '../common/BtnCheckbox'

const ClassFormModalBody = () => {
  const [chkList, setChkList] = useState([]);

  const handleChkChange = (e) => {
    const { value, checked } = e.target; // name과 checked 속성 추출
    if (checked) {
      // 체크된 경우
      setChkList([...chkList, value]);
    } else {
      // 체크 해제된 경우
      setChkList(chkList.filter((item) => item !== value));
    }
  };        

  return (
    <div className={styles.modal_container}>
      <div className={styles.flex_row}>
        <Select label='직종'>
          <option value="">선택하세요.</option>
          <option value="">응용SW엔지니어링</option>
          <option value="">광고컨텐츠제작</option>
          <option value="">편집디자인</option>
        </Select>
        <Select label='과정 유형'>
          <option value="">선택하세요.</option>
          <option value="">응용SW엔지니어링</option>
          <option value="">광고컨텐츠제작</option>
          <option value="">편집디자인</option>
        </Select>
        <Select label='강의실'>
          <option value="">선택하세요.</option>
          <option value="">응용SW엔지니어링</option>
          <option value="">광고컨텐츠제작</option>
          <option value="">편집디자인</option>
        </Select>
      </div>
      <div>
        <Input label='과정명'/>
      </div>
      <div className={styles.flex_row}>
        <Input label='수업일수'/>
        <Input label='시작일' type='date'/>
        <Input label='종료일' type='date'/>
      </div>
      <div className={styles.flex_row}>
        <Input label='모집정원'/>
        <Input label='담당강사'/>
      </div>
      <div className={styles.flex_row}>
        <Select label='시작 시간'>
          <option value="">선택하세요.</option>
          <option value="">응용SW엔지니어링</option>
          <option value="">광고컨텐츠제작</option>
          <option value="">편집디자인</option>
        </Select>
        <Select label='종료 시간'>
          <option value="">선택하세요.</option>
          <option value="">응용SW엔지니어링</option>
          <option value="">광고컨텐츠제작</option>
          <option value="">편집디자인</option>
        </Select>
      </div>
      <div>
        <p className={styles.week_p}>수업 요일</p>
        <div className={styles.week_div}>
          <BtnCheckbox
            label="월요일"
            name="monday"
            color="monday"  // 색상 지정!
            checked={chkList.includes('monday')}
            onChange={handleChkChange}
            value="monday"
          />
          <BtnCheckbox
            label="월요일"
            name="monday"
            color="tuesday"  // 색상 지정!
            checked={chkList.includes('tuesday')}
            onChange={handleChkChange}
            value="tuesday"
          />
          <BtnCheckbox
            label="월요일"
            name="monday"
            color="wednesday"  // 색상 지정!
            checked={chkList.includes('wednesday')}
            onChange={handleChkChange}
            value="wednesday"
          />
          <BtnCheckbox
            label="월요일"
            name="monday"
            color="thursday"  // 색상 지정!
            checked={chkList.includes('thursday')}
            onChange={handleChkChange}
            value="thursday"
          />
          <BtnCheckbox
            label="월요일"
            name="monday"
            color="friday"  // 색상 지정!
            checked={chkList.includes('friday')}
            onChange={handleChkChange}
            value="friday"
          />
        </div>
      </div>
      <div>
        <Textarea label='비고' rows={5}/>
      </div>
    </div>
  )
}

export default ClassFormModalBody