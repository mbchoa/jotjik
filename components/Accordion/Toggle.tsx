import useContext from './useContext';

interface Props {
  children: React.ReactNode;
  element: React.ElementType;
  eventKey: number;
  onClick?: () => void;
}

const useAccordionClick = (eventKey, onClick) => {
  const { onToggle, activeEventKey } = useContext();
  return (event) => {
    onToggle(eventKey === activeEventKey ? null : eventKey);
    onClick && onClick(event);
  };
};

const Toggle: React.FC<Props> = ({
  children,
  element: Component = 'h3',
  eventKey,
  onClick,
}) => {
  const { activeEventKey } = useContext();
  const handleAccordionClick = useAccordionClick(eventKey, onClick);

  return (
    <Component className="mt-3 shadow bg-white rounded">
      <button
        aria-expanded={eventKey === activeEventKey}
        className="w-full p-4 text-xl text-left"
        onClick={handleAccordionClick}
      >
        {children}
      </button>
    </Component>
  );
};

export default Toggle;
