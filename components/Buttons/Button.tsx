const activeCx = 'bg-pink-900 hover:bg-pink-800 transition-bg duration-300';
const disabledCx = 'bg-gray-500 cursor-not-allowed';

const Button: React.FC<React.ComponentPropsWithoutRef<'button'>> = ({ children, disabled, onClick, ...rest }) => (
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
