import React from 'react';
import { useAccordionContext } from './AccordonProvider';

interface IToggleProps {
  children: React.ReactNode;
  element: React.ElementType;
  eventKey: number;
  id: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Toggle = ({
  children,
  element: Component = 'h3',
  eventKey,
  id,
  onClick,
  ...rest
}: IToggleProps) => {
  const { activeEventKey, onToggle } = useAccordionContext();
  return (
    <Component className="mt-3 shadow bg-white rounded">
      <button
        aria-expanded={eventKey === activeEventKey}
        className="w-full p-4 text-xl text-left"
        id={id}
        onClick={(event) => {
          onToggle(eventKey === activeEventKey ? -1 : eventKey);
          if (onClick) {
            onClick(event);
          }
        }}
        {...rest}
      >
        {children}
      </button>
    </Component>
  );
};

export default Toggle;
