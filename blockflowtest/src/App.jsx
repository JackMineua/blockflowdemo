import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Wish from './pages/Wish'
import CurrentWeight from './pages/CurrentWeight'
import GoalWeight from './pages/GoalWeight'
import Finishing from './pages/Finishing'

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wish />} />
        <Route path="/currentweight" element={<CurrentWeight />} />
        <Route path="/goalweight" element={<GoalWeight />} />
        <Route path="/finishing" element={<Finishing />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
