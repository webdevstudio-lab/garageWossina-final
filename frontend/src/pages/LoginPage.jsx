/* eslint-disable react/no-unescaped-entities */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <>
      <div className="flex items-center flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-md "
        >
          <div className="p-5">
            <h1 className="p-8 text-2xl w-[25rem] font-bold text-center text-gray-700 ">
              Connexion
            </h1>
            <LoginForm />
          </div>

          <div className="px-5 bg-[#111111]  flex justify-center mt-5 rounded-b-2xl">
            <p className="text-sm py-4 text-[#C2F35D] ">
              Vous etes nouveau
              <Link
                to={'/inscription'}
                className="font-semibold hover:underline px-2"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
