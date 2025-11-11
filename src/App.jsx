import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './reset.css'
import styles from './App.module.css'
import { 
  HiUsers, 
  HiClipboardList, 
  HiInformationCircle,
  HiCheckCircle,
  HiChartBar,
  HiBookOpen,
  HiCalendar,
  HiAcademicCap,
  HiDocumentText,
  HiStar,
  HiCog,
  HiUser,
  HiChevronLeft,
  HiChevronRight,
  HiRefresh,
  HiBell, // 알림 아이콘 추가
  HiMail // 메일 아이콘 추가
} from 'react-icons/hi';

//npm run electron-dev
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tooltip, setTooltip] = useState({ show: false, text: '', top: 0, left: 0 });


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMouseEnter = (e, text) => {
    if (!isSidebarOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        text: text,
        top: rect.top + rect.height / 2,
        left: rect.right + 10
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, text: '', top: 0, left: 0 });
  };
  

  return (
    <div className={styles.layout}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1>교육원 관리 시스템</h1>
        <div className={styles.headerRight}>
          {/* 새로고침 버튼 */}
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

      <div className={styles.layoutBody}>
        {/* 사이드바 */}
        <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.closed : ''}`}>
          <div className={styles.sidebarContent}>
            <nav className={styles.sidebarNav}>
              <div className={styles.navSection}>
                <h3>학생 관리</h3>
                <ul>
                  <li>
                    <a 
                      href="#students" 
                      className={styles.active}
                      onMouseEnter={(e) => handleMouseEnter(e, '학생 목록')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiUsers className={styles.navIcon} />
                      <span>학생 목록</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#enrollment"
                      onMouseEnter={(e) => handleMouseEnter(e, '수강 신청')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiClipboardList className={styles.navIcon} />
                      <span>수강 신청</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#student-info"
                      onMouseEnter={(e) => handleMouseEnter(e, '학생 정보')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiInformationCircle className={styles.navIcon} />
                      <span>학생 정보</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.navSection}>
                <h3>출결 관리</h3>
                <ul>
                  <li>
                    <a 
                      href="#attendance"
                      onMouseEnter={(e) => handleMouseEnter(e, '출석 체크')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiCheckCircle className={styles.navIcon} />
                      <span>출석 체크</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#attendance-stats"
                      onMouseEnter={(e) => handleMouseEnter(e, '출결 통계')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiChartBar className={styles.navIcon} />
                      <span>출결 통계</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.navSection}>
                <h3>수업 관리</h3>
                <ul>
                  <li>
                    <a 
                      href="#courses"
                      onMouseEnter={(e) => handleMouseEnter(e, '과정 관리')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiBookOpen className={styles.navIcon} />
                      <span>과정 관리</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#schedule"
                      onMouseEnter={(e) => handleMouseEnter(e, '시간표')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiCalendar className={styles.navIcon} />
                      <span>시간표</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#curriculum"
                      onMouseEnter={(e) => handleMouseEnter(e, '커리큘럼')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiAcademicCap className={styles.navIcon} />
                      <span>커리큘럼</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.navSection}>
                <h3>평가 관리</h3>
                <ul>
                  <li>
                    <a 
                      href="#exams"
                      onMouseEnter={(e) => handleMouseEnter(e, '시험 관리')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiDocumentText className={styles.navIcon} />
                      <span>시험 관리</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#grades"
                      onMouseEnter={(e) => handleMouseEnter(e, '성적 관리')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiStar className={styles.navIcon} />
                      <span>성적 관리</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.navSection}>
                <h3>설정</h3>
                <ul>
                  <li>
                    <a 
                      href="#settings"
                      onMouseEnter={(e) => handleMouseEnter(e, '시스템 설정')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiCog className={styles.navIcon} />
                      <span>시스템 설정</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#users"
                      onMouseEnter={(e) => handleMouseEnter(e, '사용자 관리')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HiUser className={styles.navIcon} />
                      <span>사용자 관리</span>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            {/* 사이드바 토글 버튼 (하단) */}
            <div className={styles.sidebarFooter}>
              <button className={styles.sidebarToggleBottom} onClick={toggleSidebar}>
                {isSidebarOpen ? <HiChevronLeft /> : <HiChevronRight />}
              </button>
            </div>
          </div>
        </aside>

        {/* 툴팁 */}
        {tooltip.show && (
          <div 
            className={styles.tooltip}
            style={{
              top: `${tooltip.top}px`,
              left: `${tooltip.left}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <span>{tooltip.text}</span>
          </div>
        )}

        {/* 컨텐츠 영역 */}
        <main className={styles.content}>
          fdfd
        </main>
      </div>
    </div>
  )
}

export default App
