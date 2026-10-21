import {Navigate,Route,Routes} from 'react-router-dom';
import "./App.css"
import Home from "./pages/Home/Home.jsx"
import Workspace from "./pages/Workspace/Workspace.jsx"

function App() {
  return(
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/workspace" element={<Workspace/>}/>
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
  )
}
export default App