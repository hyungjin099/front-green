import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './reset.css'
import styles from './App.module.css'
import Header from './layout/Header'
import Side from './layout/Side'
import { Route, Routes } from 'react-router-dom'
import ClassInfoForm from './pages/classInfo/ClassInfoForm'

//npm run electron-dev
function App() {
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
    </div>
  )
}

export default App
