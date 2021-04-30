import Button from './Button';

const Play = ({ onClick, ...rest }) => (
  <Button onClick={onClick} {...rest} aria-label="Play">
    <span className="block ml-1">
      <svg width="18" height="18" viewBox="0 0 11 14" fill="#fff">
        <path d="M0 0V14L11 7L0 0Z"></path>
      </svg>
    </span>
  </Button>
);

export default Play;
