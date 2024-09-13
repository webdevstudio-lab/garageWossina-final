import { motion } from 'framer-motion';
import SingupForm from '../components/SingupForm';
import { Link } from 'react-router-dom';

const SingUpPage = () => {
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
            <h1 className="p-8 text-2xl font-bold text-center text-gray-700 ">
              Créer nouveau un Compte
            </h1>
            <SingupForm />
          </div>

          <div className="px-5 bg-[#111111]  flex justify-center mt-5 rounded-b-2xl">
            <p className="text-sm py-4 text-[#C2F35D] ">
              Vous Avez déja un compte?
              <Link
                to={'/connexion'}
                className="font-semibold hover:underline px-2"
              >
                {' '}
                Me connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SingUpPage;
