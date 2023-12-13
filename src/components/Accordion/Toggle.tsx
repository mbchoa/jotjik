import React from 'react';
import { Card } from '../Card';
import { useAccordionContext } from './AccordonProvider';

interface IToggleProps {
  children: React.ReactNode;
  eventKey: number;
  id: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Toggle = ({ children, eventKey, id, onClick, ...rest }: IToggleProps) => {
  const { activeEventKey, onToggle } = useAccordionContext();
  return (
    <Card>
      <button
        aria-expanded={eventKey === activeEventKey}
        className="w-full text-xl text-left"
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
    </Card>
  );
};

export default Toggle;
