import useContext from './useContext';

const Panel = ({ eventKey, children, id, ariaLabelledBy }) => {
  const { activeEventKey } = useContext();
  let cx = `overflow-hidden transition-max-height duration-500 ease-in-out ${
    eventKey === activeEventKey ? 'max-h-screen' : 'max-h-0'
  }`;
  return (
    <div className={cx} aria-labelledby={ariaLabelledBy} role="region" id={id}>
      {children}
    </div>
  );
};

export default Panel;
