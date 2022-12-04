import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginBox from './components/LoginBox';
import SigninBox from './components/SigninBox';
import Tasks from './components/Tasks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><LoginBox /></>} />
        <Route path='/signin' element={<><SigninBox /></>} />
        <Route path='/home' element={<><Header /><Tasks /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
