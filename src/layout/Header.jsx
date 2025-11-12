import React from 'react'
import styles from './Header.module.css'
import { 
  HiRefresh,
  HiBell, // 알림 아이콘 추가
  HiMail // 메일 아이콘 추가
} from 'react-icons/hi';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>교육원 관리 시스템</h1>
      <div className={styles.headerRight}>
        <button 
          className={styles.refreshButton} 
          onClick={() => window.location.reload()}
          title="새로고침"
        >
          <HiRefresh />
        </button>

        {/* 메일 아이콘 */}
        <button 
          className={styles.iconButton}
          title="메시지"
        >
          <HiMail />
        </button>

        {/* 알림 아이콘 (뱃지 포함) */}
        <button 
          className={styles.iconButton}
          title="알림"
        >
          <HiBell />
          <span className={styles.badge}>3</span>
        </button>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* 사용자 프로필 */}
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>김강사</span>
            <span className={styles.userRole}>관리자</span>
          </div>
          <div className={styles.avatar}>
            <img 
              src="https://ui-avatars.com/api/?name=Kim&background=3874ff&color=fff&size=128" 
              alt="프로필" 
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header