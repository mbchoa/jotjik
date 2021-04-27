import { useMemo } from 'react';

import AccordionContext from './context';

import Toggle from './Toggle';
import Panel from './Panel';

const Accordion = ({ activeEventKey, onToggle, children }) => {
  const context = useMemo(() => ({ activeEventKey, onToggle }), [activeEventKey, onToggle]);

  return (
    <AccordionContext.Provider value={context}>
      <div className="space-y-6">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.Toggle = Toggle;
Accordion.Panel = Panel;

export default Accordion;
