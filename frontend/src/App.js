import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Assign from './page/assign';
import Project1 from './page/project1';
import Project2 from './page/project2';
import Profile from './page/profile';

function App() {
    return (
        <BrowserRouter>
        <div className="App">
            <Routes>
            <Route path="/" element={<Assign />} />
            <Route path="/project1" element={<Project1 />} />
            <Route path="/project2" element={<Project2 />} />
            <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}

export default App;