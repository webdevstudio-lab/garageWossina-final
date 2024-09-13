import { useState } from 'react';
import Input from './Input';
import { Link } from 'react-router-dom';
import { Mail, LockKeyhole, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = false;

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

        <Input
          icon={LockKeyhole}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
            'Connexion'
          )}
        </motion.button>

        <div className="flex items-center mt-3">
          <Link
            to="/mot-de-passe-oublie"
            className="text-sm text-gray-400 hover:text-gray-900 hover:font-semibold transition-all duration-200"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
