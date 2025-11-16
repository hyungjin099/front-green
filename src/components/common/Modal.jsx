import React, { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';
import { MdLibraryAdd } from "react-icons/md";
import { IoCheckmarkCircleOutline , IoAlertCircleOutline  } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  iconType,
  showCloseButton = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef(null);

  // 모달 열기/닫기 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 브라우저가 렌더링을 완료한 후 애니메이션 시작
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // 애니메이션 후 언마운트
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.modalOverlay} ${isAnimating ? styles.show : ''}`}
      onClick={onClose}
    >
      <div 
        className={`${styles.modalContent} ${styles[size]} ${isAnimating ? styles.show : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal_layer}>
          {/* 모달 헤더 */}
          <div className={styles.modalHeader}>
            {title && 
              <div style={{display:'inline-flex', gap:'0.5rem'}}>
                {
                  iconType === 'add' ? <MdLibraryAdd style={{color:'white', fontSize : '24px'}}/> :
                  iconType === 'calc' ? <FaCalculator style={{color:'white', fontSize : '24px'}}/> :
                  null
                }
                
                <h2 className={styles.modalTitle}>
                  {title}
                </h2>
              </div>
            }
            {showCloseButton && (
              <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M15 5L5 15M5 5L15 15" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}


            
          </div>

          {/* 모달 바디 */}
          <div className={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;