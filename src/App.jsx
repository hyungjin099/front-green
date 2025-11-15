import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css'
import Header from './layout/Header'
import Side from './layout/Side'
import { Route, Routes } from 'react-router-dom'
import ClassInfoForm from './pages/classInfo/ClassInfoForm'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 먼저 import
import './toast.css'
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { toast } from 'react-toastify';

//npm run electron-dev
function App() {
  const handleSuccess = () => {
    toast.success('성공했습니다!', {
      containerId: 'A'
    });
  };

  const handleError = () => {
    toast.error('오류가 발생했습니다! ❌');
  };

  const handleWarning = () => {
    toast.warn('주의하세요! ⚠️');
  };

  const handleInfo = () => {
    toast.info('정보를 확인하세요! ℹ️');
  };

  const handleDefault = () => {
    toast('기본 메시지입니다');
  };

  return (
    <div className={styles.layout}>
      {/* 헤더 */}
      <Header />

      <div className={styles.layoutBody}>
        {/* 사이드바 */}
        <Side />

        {/* 컨텐츠 영역 */}
        <main className={styles.content}>
          <Routes>
            <Route path='' element={ <ClassInfoForm /> }/>
          </Routes>
        </main>
      </div>

      <ToastContainer
        containerId={'topRight'}
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        //style={{
        //   top: '50%',
        //   left: '50%',
        //   transform: 'translate(-50%, -50%)',
        //   width: '300px'
        // }}
      />

      <ToastContainer
        containerId={'B'}
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />

      <div>
      <button onClick={handleSuccess}>성공 토스트</button>
      <button onClick={handleError}>에러 토스트</button>
      <button onClick={handleWarning}>경고 토스트</button>
      <button onClick={handleInfo}>정보 토스트</button>
      <button onClick={handleDefault}>기본 토스트</button>
    </div>
    </div>
  )
}

export default App
