import React, { useState } from 'react'
import styles from './Side.module.css'
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
} from 'react-icons/hi';

const Side = () => {
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
    <>
    <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.closed : ''}`}>
      <div className={styles.sidebarContent}>
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h3>과정 관리</h3>
            <ul>
              <li>
                <a 
                  href="#students" 
                  className={styles.active}
                  onMouseEnter={(e) => handleMouseEnter(e, '신규 과정 관리')}
                  onMouseLeave={handleMouseLeave}
                >
                  <HiUsers className={styles.navIcon} />
                  <span>신규 과정 관리</span>
                </a>
              </li>
              <li>
                <a 
                  href="#enrollment"
                  onMouseEnter={(e) => handleMouseEnter(e, '운영 과정 관리')}
                  onMouseLeave={handleMouseLeave}
                >
                  <HiClipboardList className={styles.navIcon} />
                  <span>운영 과정 관리</span>
                </a>
              </li>
              <li>
                <a 
                  href="#student-info"
                  onMouseEnter={(e) => handleMouseEnter(e, '전체 과정 조회')}
                  onMouseLeave={handleMouseLeave}
                >
                  <HiInformationCircle className={styles.navIcon} />
                  <span>전체 과정 조회</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3>훈련생 관리</h3>
            <ul>
              <li>
                <a 
                  href="#attendance"
                  onMouseEnter={(e) => handleMouseEnter(e, '훈련생 등록')}
                  onMouseLeave={handleMouseLeave}
                >
                  <HiCheckCircle className={styles.navIcon} />
                  <span>훈련생 등록</span>
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
    {
      tooltip.show && (
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
      )
    }

    </>
  )
}

export default Side