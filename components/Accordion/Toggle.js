import useContext from './useContext';

const useAccordionClick = (eventKey, onClick) => {
  const { onToggle, activeEventKey } = useContext();
  return (event) => {
    onToggle(eventKey === activeEventKey ? null : eventKey);
    onClick && onClick(event);
  };
};

const Toggle = ({
  className,
  element: Component = 'h3',
  eventKey,
  onClick,
  children,
  ariaControls,
  id,
}) => {
  const { activeEventKey } = useContext();
  const handleAccordionClick = useAccordionClick(eventKey, onClick);

  return (
    <Component className={className}>
      <button
        aria-controls={ariaControls}
        aria-expanded={eventKey === activeEventKey}
        className="w-full p-4 text-xl text-left"
        id={id}
        onClick={handleAccordionClick}
      >
        {children}
      </button>
    </Component>
  );
};

export default Toggle;
