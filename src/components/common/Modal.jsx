import React, { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';
import { MdLibraryAdd } from "react-icons/md";
import { IoCheckmarkCircleOutline , IoAlertCircleOutline  } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa";
import { BiSolidUserPlus } from "react-icons/bi";
import { createPortal } from 'react-dom';

// 모달 스택 관리를 위한 전역 변수
let modalStack = [];

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

  const modalIdRef = useRef(Symbol('modal')); // 각 모달 인스턴스의 고유 ID
  const [zIndex, setZIndex] = useState(1000);

  // 모달 열기/닫기 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 브라우저가 렌더링을 완료한 후 애니메이션 시작


      // 모달 스택에 추가
      modalStack.push(modalIdRef.current);
      setZIndex(1000 + (modalStack.length - 1) * 10);


      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);

      // 모달 스택에서 제거
      modalStack = modalStack.filter(id => id !== modalIdRef.current);

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
        // 현재 모달이 스택의 최상위에 있을 때만 닫기
        const topModal = modalStack[modalStack.length - 1];
        if (topModal === modalIdRef.current) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
       // 모든 모달이 닫혔을 때만 스크롤 복원
      if (modalStack.length === 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  // return (
  const modalContent = (
    <div 
      className={`${styles.modalOverlay} ${isAnimating ? styles.show : ''}`}
      style={{ zIndex }} // 동적 z-index 적용

      // onClick={onClose}
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
                  iconType === 'add-user' ? <BiSolidUserPlus style={{color:'white', fontSize : '26px'}}/> :
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

// return 부분
return createPortal(modalContent, document.body);
};

export default Modal;