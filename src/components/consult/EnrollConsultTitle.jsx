import React from 'react'

const EnrollConsultTile = ({classInfo}) => {
  

  return (
    <>
      <div 
        style={{
          fontSize:'1.2rem', fontWeight:500, marginBottom:'0.5rem', textAlign:'left',
          display : 'flex',
          alignItems : 'center',
          gap : '0.8rem'
        }}
      >
        <IconClassType type={classInfo.classInfoVO.classTypeVO.classTypeName} />
        <p>{classInfo.classInfoVO.className}</p>
        <IconDays days={classInfo.studyDay}/>
      </div>
      <p style={{textAlign : 'left'}}>
        {classInfo.startTime} ~ {classInfo.endTime} | 
        ({classInfo.classInfoVO.totalStudyDay}일 / {classInfo.studyHour}H / {classInfo.classInfoVO.totalStudyDay}H)
      </p>
    </>
  )
}

const IconDays = ({days}) => {
  const dayArr = days.split(',');

  return (
    <div style={{display : 'inline-flex', gap : '0.3rem', transform:'translateY(-1px)'}}>
    {
      dayArr.map((day, i) => {
        return (
          <span
            key={i}
            style={{
              border : '1px solid black',
              backgroundColor : day === '월' ? '#d9fbd0' : day === '화' ? '#e5edff' : day === '수' ? '#ffefca' : day === '목' ? '#d1bdff' : '#ffe0db',
              borderColor : day === '월' ? '#92d781' : day === '화' ? '#88abff' : day === '수' ? '#ffcd87' : day === '목' ? '#9062fa' : '#f48573',
              fontSize : '0.85rem',
              padding : '2px 4px',
              color : day === '월' ? '#3a6c09' : day === '화' ? '#1e3cc7' : day === '수' ? '#bc4716' : day === '목' ? '#4c0fdb' : '#d13b00',
              borderRadius : '50%'
            }}
          >
            {day}
          </span>
        )
      })
    }
    </div>
  )
}

const IconClassType = ({type}) => {

  return (
    <p
      style={{
        width : '65px',
        letterSpacing : '0.1rem',
        transform:'translateY(-1px)',
        textAlign : 'center',
        fontSize : '0.9rem',
        fontWeight : 400,
        border : '1px solid black',
        padding : '2px 10px',
        borderRadius : '4px',
        backgroundColor : type === '근로자' ? '#d9fbd0' : type === '계좌제' ? '#e5edff' : type === '산대특' ? '#ffefca' : type === 'KDT' ? '#d1bdff' : type === '국기' ? '#ffe0db' : '#eeeeee',
        borderColor : type === '근로자' ? '#92d781' : type === '계좌제' ? '#88abff' : type === '산대특' ? '#ffcd87' : type === 'KDT' ? '#9062fa' : type === '국기' ? '#f48573' : '#dddddd',
        color : type === '근로자' ? '#3a6c09' : type === '계좌제' ? '#1e3cc7' : type === '산대특' ? '#bc4716' : type === 'KDT' ? '#4c0fdb' : type === '국기' ? '#d13b00' : '#333333'
      }}
    >
      {type}
    </p>
  )
}

export default EnrollConsultTile