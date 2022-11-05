import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import LoginBox from './components/LoginBox';
import SigninBox from './components/SigninBox';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><LoginBox/></>}/>
        <Route path='/signin' element={<><SigninBox/></>}/>
        <Route path='/home' element={<><Header/></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
