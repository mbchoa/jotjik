import Button from './Button';

const Delete = ({ onClick, ...rest }) => (
  <Button onClick={onClick} {...rest}>
    <svg width="20" height="20" viewBox="0 0 10 10" fill="#fff">
      <path d="M2.17161 0.757355L0.757385 2.17156L3.58582 4.99999L0.757385 7.82839L2.17161 9.2426L5.00003 6.41421L7.82846 9.2426L9.2427 7.82839L6.41425 4.99999L9.2427 2.17156L7.82846 0.757355L5.00003 3.58578L2.17161 0.757355Z"></path>
    </svg>
  </Button>
);

export default Delete;
