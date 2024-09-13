/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import Input from './Input';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgetPassForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          icon={Mail}
          type="email"
          placeholder="Adress email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <motion.button
          className="mt-5 w-full hover:bg-[#9ed430] duration-200 py-3 px-4 shadow-lg
           bg-[#C2F35D] text-black rounded-lg font-bold "
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
        >
          Envoyer l'email de verification
        </motion.button>
      </form>
    </>
  );
};

export default ForgetPassForm;
