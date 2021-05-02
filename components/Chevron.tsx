export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

interface Props {
  direction?: Direction;
}

function getRotationByDirection(dir: Direction): string {
  switch (dir) {
    case Direction.Up:
      return 'group-hover:rotate-180';
    case Direction.Right:
      return 'group-hover:-rotate-45';
    case Direction.Left:
      return 'group-hover:rotate-45';
    case Direction.Down:
    default:
      return '';
  }
}
const Chevron: React.FC<Props> = ({ direction = Direction.Down }) => {
  const cx = `w-6 transform transition-transform duration-400 ${getRotationByDirection(direction)}`;
  return (
    <svg className={cx} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
    </svg>
  );
};

export default Chevron;
