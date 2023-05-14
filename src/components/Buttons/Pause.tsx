import Button from './Button';

const Pause: React.FC<React.ComponentPropsWithoutRef<'button'>> = ({ onClick, ...rest }) => (
  <Button onClick={onClick} {...rest} aria-label="Pause">
    <svg width="15" height="15" viewBox="0 0 12 14" fill="#fff">
      <path d="M0 14H4V0H0V14ZM8 0V14H12V0H8Z"></path>
    </svg>
  </Button>
);

export default Pause;
