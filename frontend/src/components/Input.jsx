// eslint-disable-next-line react/prop-types
const Input = ({ icon: Icon, ...props }) => {
  return (
    <>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="size-5 text-[#8cbb2f]" />
        </div>
        <input
          {...props}
          className="w-full pl-10 pr-3 py-2  bg-[#f7f5f5] rounded-md border !outline-none border-gray-200 focus:border-gray-300 focus:ring-2
           focus:ring-slate-400 text-gray-900 placeholder-gray-400 text-md transition duration-200 font-medium "
        />
      </div>
    </>
  );
};

export default Input;
