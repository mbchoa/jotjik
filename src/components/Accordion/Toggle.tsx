import useContext from './useContext';

interface Props {
  children: React.ReactNode;
  element: React.ElementType;
  eventKey: number;
  id: string;
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
  id,
  onClick,
  ...rest
}) => {
  const { activeEventKey } = useContext();
  const handleAccordionClick = useAccordionClick(eventKey, onClick);

  return (
    <Component className="mt-3 shadow bg-white rounded">
      <button
        aria-expanded={eventKey === activeEventKey}
        className="w-full p-4 text-xl text-left"
        id={id}
        onClick={handleAccordionClick}
        {...rest}
      >
        {children}
      </button>
    </Component>
  );
};

export default Toggle;
