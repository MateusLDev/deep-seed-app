import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/main-layout'
import Home from './pages/home'
import Projects from './pages/projects'
import Reservoirs from './pages/reservoirs'
import Wells from './pages/wells'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/reservoirs" element={<Reservoirs />} />
          <Route path="/wells" element={<Wells />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
