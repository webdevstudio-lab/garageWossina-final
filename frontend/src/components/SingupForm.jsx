import { useState } from 'react';
import Input from './Input';
import { User, Mail, LockKeyhole, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import PasswordTestMeter from './PasswordTestMeter';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const SingupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate('/verification-du-compte');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          icon={User}
          type="text"
          placeholder="nom de l'utilisateur"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        {error && (
          <p className="text-red-600 font-medium mt-2 text-sm">{error} </p>
        )}

        <PasswordTestMeter password={password} />

        <motion.button
          className="mt-5 w-full hover:bg-[#9ed430] duration-200 py-3 px-4 shadow-lg
         bg-[#C2F35D] text-black rounded-lg font-bold "
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin mx-auto" size={24} />
          ) : (
            "S'inscrire"
          )}
        </motion.button>
      </form>
    </>
  );
};

export default SingupForm;
