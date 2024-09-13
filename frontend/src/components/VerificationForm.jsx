import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
// import { toast } from 'react-hot-toast';

const VerificationForm = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const VerificationCode = code.join('');
    try {
      verifyEmail(VerificationCode);
      console.log(verifyEmail(VerificationCode).message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6}
                required
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center font-bold  bg-[#f7f5f5] rounded-md border !outline-none border-gray-200 focus:border-gray-300 focus:ring-2
           focus:ring-slate-400 text-gray-900 placeholder-gray-400 text-md transition duration-200  "
              />
            ))}
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2 font-bold text-center">
            {error}
          </p>
        )}
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
            "Verifier l'Email"
          )}
        </motion.button>
      </form>
    </>
  );
};

export default VerificationForm;
