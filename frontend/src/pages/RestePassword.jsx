import { motion } from 'framer-motion';
import RestePasswordForm from '../components/ResetPasswordForm';

const RestePassword = () => {
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
              Réinitialiser le mot de passe
            </h1>
            <RestePasswordForm />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RestePassword;
