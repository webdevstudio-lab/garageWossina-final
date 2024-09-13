import { useState } from 'react';
import Input from './Input';
import { LockKeyhole, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PasswordTestMeter from './PasswordTestMeter';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const isLoading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          icon={LockKeyhole}
          type="password"
          placeholder="Nouveau Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordTestMeter password={password} />

        <motion.button
          className="mt-5 w-full hover:bg-[#9ed430] duration-200 cursor-pointer py-3 px-4 shadow-lg
         bg-[#C2F35D] text-black rounded-lg font-bold "
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="w-6 h-6 animate-spin text-center mx-auto  " />
          ) : (
            'Valider'
          )}
        </motion.button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
