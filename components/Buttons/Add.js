const Add = ({ onClick, ...rest }) => (
  <button
    className="flex justify-center items-center w-full h-11 rounded bg-blue-500 hover:bg-blue-600 transition-bg duration-300"
    onClick={onClick}
    {...rest}
  >
    <svg width="20" height="20" viewBox="0 0 10 10" fill="#fff">
      <path d="M6 0H4V4H0V6H4V10H6V6H10V4H6V0Z"></path>
    </svg>
  </button>
);

export default Add;
