import Button from './Button';

const Reset = ({ onClick, ...rest }) => (
  <Button onClick={onClick} {...rest} aria-label="Reset">
    <span className="block mr-1">
      <svg width="30" height="30" viewBox="0 0 21 18" fill="#fff">
        <path d="M14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9ZM12 0C7.03 0 3 4.03 3 9H0L4 13L8 9H5C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 12.87 15.87 16 12 16C10.49 16 9.09 15.51 7.94 14.7L6.52 16.14C8.04 17.3 9.94 18 12 18C16.97 18 21 13.97 21 9C21 4.03 16.97 0 12 0Z"></path>
      </svg>
    </span>
  </Button>
);

export default Reset;
