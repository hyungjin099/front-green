// ConsultSheet.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './ConsultSheet.module.css';

const ConsultSheet = () => {
  // ========== 상태 관리 ==========
  
  const [data, setData] = useState({
    studentNames: [],
    rows: []
  });

  // 색상 팔레트 추가
  const colorPalette = [
    { name: '검정', value: '#000000' },
    { name: '빨강', value: '#e03131' },
    { name: '주황', value: '#fd7e14' },
    { name: '노랑', value: '#fab005' },
    { name: '초록', value: '#40c057' },
    { name: '파랑', value: '#1971c2' },
    { name: '보라', value: '#7950f2' },
    { name: '회색', value: '#868e96' }
  ];

  const [editingCell, setEditingCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [columnWidths, setColumnWidths] = useState([]);
  const [rowHeights, setRowHeights] = useState({});
  const [resizing, setResizing] = useState(null);
  
  // 편집 중인 셀의 위치와 크기 정보
  const [editingCellRect, setEditingCellRect] = useState(null);

  // 편집 중인 값 (임시 저장, ESC 시 복구용)
  const [editingValue, setEditingValue] = useState('');
  
  // 편집 시작 시 원본 값 저장 (ESC 시 복구용)
  const originalValueRef = useRef('');

  // 색상 드롭다운 열림/닫힘 상태 추가
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  // 현재 선택된 색상 상태 추가
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]); // 초기값: 검정색

  const [customRows, setCustomRows] = useState([]); // 사용자가 추가한 행들
  const MAX_CUSTOM_ROWS = 5;

  const [scoreRowsVisible, setScoreRowsVisible] = useState(false); // 입학점수 행 표시 여부
  const [scoreRows, setScoreRows] = useState([]); // 입학점수 행 데이터

  // 입학점수 행 라벨 (고정)
  const SCORE_ROW_LABELS = [
    '성향태도 점수',
    '출결예측 점수',
    '수강의지 점수',
    '취업역량 점수',
    '점수 합'
  ];
  
  // Select 옵션 데이터
  const [selectOptions, setSelectOptions] = useState({
    담당자: ['이영희', '최지훈', '박선생', '김선생', '정선생'],
    구분: ['일반', '국1', '국2'],
    등급: ['A', 'B', 'C', 'D'],
    재직구분: ['실업자', '재직자'],
    진행상태: ['실업자 HRD대기', '실업자 HRD선발', '재직자 HRD대기', '재직자 HRD선발'],
    등록여부: ['등록확정', '등록 불확실', '가능성 50%', '미정']
  });


  
  const resizeStartPos = useRef(0);
  const resizeStartSize = useRef(0);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const cellRef = useRef(null);

  // ========== 테이블 전체 너비 계산 ==========
  
  /**
   * 모든 컬럼 너비의 합을 계산
   * @returns {number} 테이블 전체 너비 (px)
   */
  const getTableWidth = () => {
    return columnWidths.reduce((sum, width) => sum + width, 0);
  };

  // ========== 데이터 로드 ==========
  
  useEffect(() => {
    fetchData();
  }, []);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorDropdownOpen && !e.target.closest(`.${styles.customSelect}`)) {
        setColorDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorDropdownOpen]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/consult/transposed');
      const transposedData = response.data;
      
      setData(transposedData);
      
      const initialWidths = [
        80,
        ...transposedData.studentNames.map(() => 80)
      ];
      setColumnWidths(initialWidths);
      
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      
      // 테스트용 더미 데이터
      const dummyData = {
        studentNames: ['김철수(일반)', '박민수(국1)', '이지은(국2)', '최영희(일반)'],
        rows: [
          { rowLabel: '담당자', values: ['이영희', '최지훈', '이영희', '박선생'] },
          { rowLabel: '구분 / 등급', values: ['일반 / A', '국1 / B', '국2 / A', '일반 / C'] },
          { rowLabel: '재직구분', values: ['실업자', '실업자', '재직자', '재직자'] },
          { rowLabel: '진행상태', values: ['실업자 HRD대기', '실업자 HRD선발', '재직자 HRD대기', '재직자 HRD선발'] },
           { 
            rowLabel: '상담내용', 
            values: [
              '진로 상담 진행 중입니다. 학생의 적성과 흥미를 고려하여 여러 진로 옵션을 탐색하고 있습니다.',
              '학습 상담 완료. 수학 과목에서 어려움을 겪고 있어 추가 보충 수업 필요.',
              '적성 검사 예정. 다음 주 화요일에 진행 예정이며 결과는 1주일 후 통보.',
              '부모 상담 완료. 학생의 학업 성취도와 향후 진로 방향에 대해 논의함.'
            ] 
          },
          { rowLabel: '등록여부', values: ['등록확정', '등록 불확실', '가능성 50%', '등록확정'] }
        ]
      };
      setData(dummyData);
      setColumnWidths([150, 150, 150, 150, 150]);
      setRowHeights([40, 40, 40, 40, 200, 40]);
    }
  };

  // ========== 컬럼 리사이징 ==========
  
  const handleColumnResizeStart = (e, colIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    setResizing({ type: 'column', index: colIndex });
    resizeStartPos.current = e.clientX;
    resizeStartSize.current = columnWidths[colIndex];
  };

  // ========== 행 리사이징 ==========
  
  const handleRowResizeStart = (e, rowIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    setResizing({ type: 'row', index: rowIndex });
    resizeStartPos.current = e.clientY;
    resizeStartSize.current = rowHeights[rowIndex] || 40;
  };

  // ========== 리사이징 이벤트 ==========
  
  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e) => {
      if (resizing.type === 'column') {
        const diff = e.clientX - resizeStartPos.current;
        const newWidth = Math.max(50, resizeStartSize.current + diff);
        
        setColumnWidths(prev => {
          const newWidths = [...prev];
          newWidths[resizing.index] = newWidth;
          return newWidths;
        });
      } else if (resizing.type === 'row') {
        const diff = e.clientY - resizeStartPos.current;
        const newHeight = Math.max(30, resizeStartSize.current + diff);
        
        setRowHeights(prev => ({
          ...prev,
          [resizing.index]: newHeight
        }));
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  // ========== 셀 편집 관련 ==========
  
  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
  };

  /**
   * 셀 더블클릭 - 편집 모드 진입 및 셀 위치 저장
   * @param {MouseEvent} e - 마우스 이벤트
   * @param {number} rowIndex - 행 인덱스
   * @param {number} colIndex - 열 인덱스
   */
  const handleCellDoubleClick = (e, rowIndex, colIndex) => {
    const cell = e.currentTarget;
    const rect = cell.getBoundingClientRect();
    const scrollTop = cell.closest(`.${styles.tableWrapper}`)?.scrollTop || 0;
    const scrollLeft = cell.closest(`.${styles.tableWrapper}`)?.scrollLeft || 0;
    
    const currentValue = data.rows[rowIndex]?.values[colIndex] || '';
    originalValueRef.current = currentValue;
    setEditingValue(currentValue);
    
    // 확장될 편집 박스의 크기
    const expandedWidth = 450;
    const expandedHeight = 280;
    const margin = 10; // 화면 가장자리 여백
    
    // 뷰포트 크기
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 초기 위치 (셀 좌상단 기준)
    let left = rect.left;
    let top = rect.top;
    
    // 가로 위치 조정 (우측 확인)
    if (left + expandedWidth > viewportWidth - margin) {
      // 오른쪽으로 벗어나면 왼쪽으로 이동
      left = Math.max(margin, viewportWidth - expandedWidth - margin);
      
      // 그래도 셀보다 오른쪽이면 셀 우측 끝에 맞춤
      if (left > rect.right - expandedWidth) {
        left = Math.max(margin, rect.right - expandedWidth);
      }
    }
    
    // 세로 위치 조정 (하단 확인)
    if (top + expandedHeight > viewportHeight - margin) {
      // 아래로 벗어나면 위로 이동
      top = Math.max(margin, viewportHeight - expandedHeight - margin);
    }
    
    // 최소값 보장 (화면 밖으로 나가지 않도록)
    left = Math.max(margin, Math.min(left, viewportWidth - expandedWidth - margin));
    top = Math.max(margin, Math.min(top, viewportHeight - expandedHeight - margin));
    
    setEditingCellRect({
      top: top,
      left: left,
      width: rect.width,
      height: rect.height,
      expandedWidth: expandedWidth,
      expandedHeight: expandedHeight,
      scrollTop,
      scrollLeft
    });
    
    setEditingCell({ rowIndex, colIndex });
    setSelectedCell({ rowIndex, colIndex });
  };

  /**
   * 편집 중인 값 변경 핸들러 (임시 저장만, 실제 data는 변경하지 않음)
   * @param {string} value - 새로운 값
   */
  const handleEditingValueChange = (value) => {
    setEditingValue(value);
  };

  /**
   * 구분/등급 행의 개별 select 변경 핸들러
   * @param {string} part - 'left' 또는 'right'
   * @param {string} value - 선택된 값
   */
  const handleDualSelectChange = (part, value) => {
    const currentValue = editingValue || ' / ';
    const parts = currentValue.split(' / ');
    
    if (part === 'left') {
      setEditingValue(`${value} / ${parts[1] || ''}`);
    } else {
      setEditingValue(`${parts[0] || ''} / ${value}`);
    }
  };

  /**
   * 셀 편집 완료 - 실제 data 상태에 반영 및 DB 저장
   * @param {number} rowIndex - 행 인덱스
   * @param {number} colIndex - 열 인덱스
   * @param {string} value - 최종 값
   */
  const handleCellBlur = async (rowIndex, colIndex, value) => {
    // 실제 data 상태 업데이트
    setData(prev => {
      const newData = { ...prev };
      const newRows = [...prev.rows];
      const newRow = { ...newRows[rowIndex] };
      const newValues = [...newRow.values];
      newValues[colIndex] = value;
      newRow.values = newValues;
      newRows[rowIndex] = newRow;
      newData.rows = newRows;
      return newData;
    });
    
    // 편집 모드 종료
    setEditingCell(null);
    setEditingCellRect(null);
    setEditingValue('');
    setSelectedColor(colorPalette[0]);
    
    try {
      const studentName = data.studentNames[colIndex];
      const rowLabel = data.rows[rowIndex].rowLabel;
      
      console.log('DB 저장:', { studentName, rowLabel, value });
      
      // await axios.put('/api/consult/update', {
      //   studentName,
      //   field: rowLabel,
      //   value
      // });
      
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  /**
   * 편집 취소 - 원본 값으로 복구
   * @param {number} rowIndex - 행 인덱스
   * @param {number} colIndex - 열 인덱스
   */
  const handleEditingCancel = (rowIndex, colIndex) => {
    console.log('편집 취소: 원본 값 유지', originalValueRef.current);
    
    // 편집 모드 종료
    setEditingCell(null);
    setEditingCellRect(null);
    setEditingValue('');
  };

  /**
   * 키보드 이벤트 핸들러
   * @param {KeyboardEvent} e - 키보드 이벤트
   * @param {number} rowIndex - 행 인덱스
   * @param {number} colIndex - 열 인덱스
   */
  const handleKeyDown = (e, rowIndex, colIndex) => {
    const isContentRow = data.rows[rowIndex]?.rowLabel === '상담내용';
    
    // textarea에서 Shift + Enter 또는 Alt + Enter: 줄바꿈 허용
    if (e.key === 'Enter' && (e.shiftKey || e.altKey) && isContentRow) {
      return;
    }
    
    // Enter 키만 단독으로 누르면 - 편집 완료
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      handleCellBlur(rowIndex, colIndex, editingValue);
    }
    
    // ESC 키 - 편집 취소 (원본 값으로 복구)
    if (e.key === 'Escape') {
      handleEditingCancel(rowIndex, colIndex);
    }
  };

  /**
   * contentEditable용 키보드 이벤트 핸들러
   * @param {KeyboardEvent} e - 키보드 이벤트
   * @param {number} rowIndex - 행 인덱스
   * @param {number} colIndex - 열 인덱스
   */
  const handleContentEditableKeyDown = (e, rowIndex, colIndex) => {
    // Shift + Enter 또는 Alt + Enter: 줄바꿈 허용
    if (e.key === 'Enter' && (e.shiftKey || e.altKey)) {
      return;
    }
    
    // Ctrl + B: 굵게
    if (e.key === 'b' && e.ctrlKey) {
      e.preventDefault();
      document.execCommand('bold');
      return;
    }
    
    // Enter 키만 단독으로 누르면 - 편집 완료
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
      e.preventDefault();
      handleCellBlur(rowIndex, colIndex, e.currentTarget.innerHTML);
    }
    
    // ESC 키 - 편집 취소
    if (e.key === 'Escape') {
      handleEditingCancel(rowIndex, colIndex);
    }
  };

  /**
   * 편집 모드 진입 시 contentEditable에 초기값 설정 및 포커스
   */
  useEffect(() => {
    if (editingCell && inputRef.current) {
      // 색상 선택을 검정색으로 초기화
      setSelectedColor(colorPalette[0]);

      // contentEditable div에 초기 HTML 설정 (최초 1회만)
      if (inputRef.current.innerHTML !== editingValue) {
        inputRef.current.innerHTML = editingValue;
      }
      
      // contentEditable의 기본 글자색을 검정으로 설정
      inputRef.current.style.color = colorPalette[0].value;

      // 포커스 설정
      inputRef.current.focus();

      // 커서를 끝으로 이동
      const range = document.createRange();
      const selection = window.getSelection();
      
      // contentEditable 내부에 내용이 있는 경우
      if (inputRef.current.childNodes.length > 0) {
        const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1];
        range.setStartAfter(lastNode);
        range.setEndAfter(lastNode);
      } else {
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
      }
      
      selection.removeAllRanges();
      selection.addRange(range);


      // 즉시 검정색 적용 (커서 위치에)
      setTimeout(() => {
        document.execCommand('foreColor', false, colorPalette[0].value);
        // 빈 텍스트 노드 삽입해서 색상 고정
        const textNode = document.createTextNode('\u200B'); // Zero-width space
        selection.getRangeAt(0).insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }, 0);
    }
  }, [editingCell]); // editingValue는 의존성에서 제외!

  // ========== 행 추가 함수 추가 ==========

  /**
   * 새로운 행 추가
   */
  const handleAddRow = () => {
    if (customRows.length >= MAX_CUSTOM_ROWS) {
      alert(`최대 ${MAX_CUSTOM_ROWS}개의 행만 추가할 수 있습니다.`);
      return;
    }

    const newRow = {
      id: Date.now(), // 고유 ID
      rowLabel: '',
      values: data.studentNames.map(() => '')
    };

    setCustomRows(prev => [...prev, newRow]);
  };

  /**
   * 추가된 행 삭제
   */
  const handleRemoveRow = (rowId) => {
    setCustomRows(prev => prev.filter(row => row.id !== rowId));
  };

  /**
   * 추가된 행의 라벨 변경
   */
  const handleCustomRowLabelChange = (rowId, value) => {
    setCustomRows(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, rowLabel: value } : row
      )
    );
  };

  /**
   * 추가된 행의 값 변경
   */
  const handleCustomRowValueChange = (rowId, colIndex, value) => {
    setCustomRows(prev =>
      prev.map(row => {
        if (row.id === rowId) {
          const newValues = [...row.values];
          newValues[colIndex] = value;
          return { ...row, values: newValues };
        }
        return row;
      })
    );
  };

  // ========== 입학점수 행 관련 함수 추가 ==========

  /**
   * 입학점수 행 추가/삭제 토글
   */
  const handleToggleScoreRows = () => {
    if (scoreRowsVisible) {
      // 삭제
      setScoreRowsVisible(false);
      setScoreRows([]);
    } else {
      // 추가
      const newScoreRows = SCORE_ROW_LABELS.map((label, index) => ({
        id: `score-${index}`,
        rowLabel: label,
        values: data.studentNames.map(() => '')
      }));
      setScoreRows(newScoreRows);
      setScoreRowsVisible(true);
    }
  };

  /**
   * 입학점수 행의 값 변경
   */
  const handleScoreRowValueChange = (rowId, colIndex, value) => {
    setScoreRows(prev =>
      prev.map(row => {
        if (row.id === rowId) {
          const newValues = [...row.values];
          newValues[colIndex] = value;
          return { ...row, values: newValues };
        }
        return row;
      })
    );
  };



  // ========== 셀 렌더링 ==========
  
  /**
   * 데이터 셀 렌더링
   * - select: 항상 편집 가능 (더블클릭 불필요)
   * - textarea(상담내용): 더블클릭 시 확장된 편집 박스 표시
   */
  const renderCell = (rowIndex, colIndex) => {
  const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
  const isSelected = selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex;
  const value = data.rows[rowIndex]?.values[colIndex] || '';
  const rowLabel = data.rows[rowIndex]?.rowLabel;
  
  const isContentRow = rowLabel === '상담내용';
  const isDualSelectRow = rowLabel === '구분 / 등급';

  return (
    <td
      key={colIndex}
      ref={isEditing ? cellRef : null}
      className={`
        ${styles.cell} 
        ${isSelected ? styles.selected : ''} 
        ${isEditing ? styles.editing : ''}
        ${isContentRow ? styles.contentCell : ''} // 이 줄 추가
      `}
      onClick={(e) => {
        handleCellClick(rowIndex, colIndex);
        // 상담내용 셀은 클릭 한 번으로 편집 모드 진입
        if (isContentRow && !isEditing) {
          handleCellDoubleClick(e, rowIndex, colIndex);
        }
      }}
      style={{ 
        width: columnWidths[colIndex + 1],
        height: rowHeights[rowIndex] || 40
      }}
    >
      {isContentRow ? (
        isEditing ? (
          <>
            <div className={styles.cellPlaceholder}></div>
            
            {editingCellRect && (
              <div
                className={styles.expandedEditBox}
                style={{
                  top: editingCellRect.top,
                  left: editingCellRect.left,
                  width: editingCellRect.expandedWidth || 450,
                  height: editingCellRect.expandedHeight || 280,
                }}
              >
                {/* 포맷 툴바 */}
                <div 
                  className={styles.formatToolbar}
                  onMouseDown={(e) => {
                    // select는 제외하고 preventDefault
                    if (e.target.tagName !== 'SELECT') {
                      e.preventDefault();
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      document.execCommand('bold', false, null);
                      inputRef.current?.focus();
                    }}
                    className={styles.formatButton}
                    title="굵게 (Ctrl+B)"
                  >
                    <strong>B</strong>
                  </button>
                  
                  {/* 텍스트 색상 선택 - 커스텀 드롭다운 */}
                  <div className={styles.colorSelectWrapper}>
                    <span className={styles.colorSelectLabel}>글자색</span>
                    <div className={styles.customSelect}>
                      <button
                        type="button"
                        className={styles.customSelectTrigger}
                        onClick={(e) => {
                          e.stopPropagation();
                          setColorDropdownOpen(!colorDropdownOpen);
                        }}
                      >
                        <span>{selectedColor.name}</span>
                        <span 
                          className={styles.colorPreview}
                          style={{ backgroundColor: selectedColor.value }}
                        />
                        <span className={styles.arrow}>▼</span>
                      </button>
                      
                      {colorDropdownOpen && (
                        <div className={styles.customSelectDropdown}>
                          {colorPalette.map((color, idx) => (
                            <div
                              key={idx}
                              className={`${styles.colorOption} ${
                                selectedColor.value === color.value ? styles.selected : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColor(color); // 선택된 색상 업데이트
                                document.execCommand('foreColor', false, color.value);
                                setColorDropdownOpen(false);
                                setTimeout(() => {
                                  inputRef.current?.focus();
                                }, 0);
                              }}
                            >
                              <span>{color.name}</span>
                              <span 
                                className={styles.colorPreview}
                                style={{ backgroundColor: color.value }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* contentEditable div - dangerouslySetInnerHTML 제거 */}
                <div
                  ref={inputRef}
                  contentEditable
                  spellCheck={false}  // 맞춤법 검사 비활성화
                  onInput={(e) => {
                    // 커서 위치 저장
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const cursorOffset = range.startOffset;
                    const currentNode = range.startContainer;
                    
                    // 상태 업데이트
                    handleEditingValueChange(e.currentTarget.innerHTML);
                  }}
                  onBlur={(e) => {
                    const relatedTarget = e.relatedTarget;
                    const currentBox = e.currentTarget.closest(`.${styles.expandedEditBox}`);
                    
                    if (relatedTarget && currentBox?.contains(relatedTarget)) {
                      return;
                    }
                    
                    handleCellBlur(rowIndex, colIndex, e.currentTarget.innerHTML);
                  }}
                  onKeyDown={(e) => handleContentEditableKeyDown(e, rowIndex, colIndex)}
                  className={styles.editableContent}
                  suppressContentEditableWarning
                />
              </div>
            )}
          </>
        ) : (
          // 일반 보기 모드
          <div className={styles.cellContent}>
            <div 
              className={styles.cellText}
              dangerouslySetInnerHTML={{ 
                __html: value || '\u00A0'
              }}
            />
          </div>
        )
      ) : isDualSelectRow ? (
        // ========== 구분 / 등급 행 ==========
        <div className={styles.dualSelectContainer}>
          <select
            value={value.split(' / ')[0] || ''}
            onChange={(e) => {
              const newValue = `${e.target.value} / ${value.split(' / ')[1] || ''}`;
              handleCellBlur(rowIndex, colIndex, newValue);
            }}
            className={styles.cellSelectHalf}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">선택</option>
            {selectOptions.구분.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
          <span className={styles.divider}>/</span>
          <select
            value={value.split(' / ')[1] || ''}
            onChange={(e) => {
              const newValue = `${value.split(' / ')[0] || ''} / ${e.target.value}`;
              handleCellBlur(rowIndex, colIndex, newValue);
            }}
            className={styles.cellSelectHalf}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">선택</option>
            {selectOptions.등급.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ) : (
        // ========== 다른 행: 단일 select ==========
        <select
          value={value}
          onChange={(e) => handleCellBlur(rowIndex, colIndex, e.target.value)}
          className={styles.cellSelect}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">선택</option>
          {selectOptions[rowLabel]?.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>
      )}
    </td>
  );
};

  // ========== 렌더링 ==========
  
  return (
    <div className={styles.consultSheetContainer}>
      <div className={styles.sheetHeader}>
        <h2>상담일지</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table 
          className={styles.table}
          style={{ width: getTableWidth() }}
        >
          <thead>
            <tr>
              <th 
                className={styles.headerCell}
                style={{ width: columnWidths[0]}}
              >
                훈련생명
                <div
                  className={styles.columnResizer}
                  onMouseDown={(e) => handleColumnResizeStart(e, 0)}
                />
              </th>
              
              {data.studentNames.map((studentName, index) => (
                <th 
                  key={index}
                  className={styles.headerCell}
                  style={{ width: columnWidths[index + 1]}}
                >
                  {studentName}
                  <div
                    className={styles.columnResizer}
                    onMouseDown={(e) => handleColumnResizeStart(e, index + 1)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td 
                  className={`${styles.cell} ${styles.labelCell}`}
                  style={{ 
                    width: columnWidths[0],
                    height: rowHeights[rowIndex] || 40
                  }}
                >
                  <div className={styles.rowHeader}>
                    {row.rowLabel}
                    <div
                      className={styles.rowResizer}
                      onMouseDown={(e) => handleRowResizeStart(e, rowIndex)}
                    />
                  </div>
                </td>
                
                {row.values.map((_, colIndex) => renderCell(rowIndex, colIndex))}
              </tr>
            ))}

            {/* 사용자가 추가한 행들 */}
            {customRows.map((customRow, index) => (
              <tr key={customRow.id}>
                <td 
                  className={`${styles.cell} ${styles.labelCell} ${styles.customLabelCell}`}
                  style={{ 
                    width: columnWidths[0],
                    height: 40
                  }}
                >
                  <div className={styles.customRowHeader}>
                    <input
                      type="text"
                      value={customRow.rowLabel}
                      onChange={(e) => handleCustomRowLabelChange(customRow.id, e.target.value)}
                      placeholder="행이름"
                      className={styles.customRowLabelInput}
                    />
                    <button
                      onClick={() => handleRemoveRow(customRow.id)}
                      className={styles.removeRowButton}
                      title="행 삭제"
                    >
                      ×
                    </button>
                  </div>
                </td>
                
                {customRow.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={styles.cell}
                    style={{ 
                      width: columnWidths[colIndex + 1],
                      height: 40
                    }}
                  >
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleCustomRowValueChange(customRow.id, colIndex, e.target.value)}
                      className={styles.customRowInput}
                    />
                  </td>
                ))}
              </tr>
            ))}

            {/* 입학점수 행들 */}
            {scoreRowsVisible && scoreRows.map((scoreRow) => (
              <tr key={scoreRow.id}>
                <td 
                  className={`${styles.cell} ${styles.labelCell}`}
                  style={{ 
                    width: columnWidths[0],
                    height: 40
                  }}
                >
                  <div className={styles.fixedRowHeader}>
                    {scoreRow.rowLabel}
                  </div>
                </td>
                
                {scoreRow.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={styles.cell}
                    style={{ 
                      width: columnWidths[colIndex + 1],
                      height: 40
                    }}
                  >
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleScoreRowValueChange(scoreRow.id, colIndex, e.target.value)}
                      className={styles.customRowInput}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 테이블 하단 버튼 영역 */}
      <div className={styles.tableFooter}>
        <button
          onClick={handleAddRow}
          className={styles.footerButton}
          disabled={customRows.length >= MAX_CUSTOM_ROWS}
        >
          + 행 추가 ({customRows.length}/{MAX_CUSTOM_ROWS})
        </button>
        <button
          onClick={handleToggleScoreRows}
          className={`${styles.footerButton} ${scoreRowsVisible ? styles.removeMode : ''}`}
        >
          {scoreRowsVisible ? '입학점수 삭제' : '입학점수등록'}
        </button>
      </div>
    </div>
  );
};

export default ConsultSheet;