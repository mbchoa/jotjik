const activeCx = 'bg-blue-500 hover:bg-blue-600 transition-bg duration-300';
const disabledCx = 'bg-gray-500 cursor-not-allowed';

const Button = ({ children, disabled, onClick, ...rest }) => (
  <button
    className={`flex justify-center items-center w-11 h-11 rounded-full ${
      disabled ? disabledCx : activeCx
    }`}
    onClick={onClick}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
