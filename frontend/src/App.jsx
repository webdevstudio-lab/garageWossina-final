import { Route, Routes } from 'react-router-dom';
import SingUpPage from './pages/SingUpPage';
import LoginPage from './pages/LoginPage';
import ForgetPassword from './pages/ForgetPassword';
import VerifyAccount from './pages/VerifyAccount';
import ResetPassword from './pages/RestePassword';

import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center relative overflow-hidden ">
        <Routes>
          <Route path="/" element={'Home|'} />
          <Route path="/inscription" element={<SingUpPage />} />
          <Route path="/verification-du-compte" element={<VerifyAccount />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/mot-de-passe-oublie" element={<ForgetPassword />} />
          <Route
            path="/reinitialiser-le-mot-de-passe"
            element={<ResetPassword />}
          />

          <Route path="/deconnexion" element={'Home'} />
        </Routes>
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: 'green',
                font: 'white',
              },
            },
            error: {
              style: {
                background: 'red',
                font: 'white',
              },
            },
          }}
        />
      </div>
    </>
  );
}

export default App;
