import React, { useState, useRef, useEffect } from "react";
import styles from "./Accordion.module.css";
import { BiSolidUserPlus } from "react-icons/bi";

const AccordionItem = ({ title, children, openAddModal }) => {
const [open, setOpen] = useState(false);    // 전부 닫힘으로 시작
  const bodyRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (open) {
      const scrollHeight = bodyRef.current.scrollHeight;
      setHeight(scrollHeight + "px");
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

const Accordion = ({ items=[], openAddModal }) => {
  return (
    <div className={styles.accordion}>
    {/* <div className={`${styles.accordion} ${styles.accordionFlush}`}> */}
      {items.map((item, idx) => (
        <AccordionItem key={idx} title={item.title} openAddModal={openAddModal}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
