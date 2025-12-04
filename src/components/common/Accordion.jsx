import React, { useState, useRef, useEffect } from "react";
import styles from "./Accordion.module.css";
import { BiSolidUserPlus } from "react-icons/bi";

const AccordionItem = ({ title, children, openAddModal, selectedClassNum, setSelectedClassNum }) => {
  const [open, setOpen] = useState(false);    // 전부 닫힘으로 시작
  const bodyRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (open && bodyRef.current) {
      // 초기 높이 설정
      setHeight(bodyRef.current.scrollHeight + "px");

      // ResizeObserver로 실시간 높이 감지
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setHeight(entry.target.scrollHeight + "px");
        }
      });

      resizeObserver.observe(bodyRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      setHeight("0px");
    }
  }, [open]);

  //console.log(title.props.classInfo)

  return (
    <div className={styles.accordionItem}>
      <h2 className={styles.accordionHeader}>
        <button
          className={`${styles.accordionButton} ${open ? styles.open : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span>{title}</span>

          <div style={{display:'flex', gap:'2rem', alignItems : 'center'}}>
            <span className={styles.add_icon}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClassNum(selectedClassNum);
                openAddModal();
              }}
            >
              <BiSolidUserPlus />
            </span>

            {/* 화살표 */}
            <span className={styles.icon}>
              ▼
            </span>
          </div>
        </button>
      </h2>

      <div className={styles.accordionCollapse} style={{ height }}>
        <div className={styles.accordionBody} ref={bodyRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ items=[], openAddModal, setSelectedClassNum }) => {

  return (
    <div className={styles.accordion}>
    {/* <div className={`${styles.accordion} ${styles.accordionFlush}`}> */}
      {items.map((item, idx) => (
        <AccordionItem key={idx} title={item.title} openAddModal={openAddModal} setSelectedClassNum={setSelectedClassNum} selectedClassNum={item.title.props.classInfo.classNum}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
