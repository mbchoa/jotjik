import { useMemo, Dispatch, SetStateAction } from 'react';

import AccordionContext from './context';
import useContext from './useContext';

import Toggle from './Toggle';
import Panel from './Panel';

interface Props {
  activeEventKey: number
  children: React.ReactNode
  onToggle: Dispatch<SetStateAction<number>>
}

const Accordion: React.FC<Props> = ({ activeEventKey, onToggle, children }) => {
  const context = useMemo(() => ({ activeEventKey, onToggle }), [activeEventKey, onToggle]);

  return (
    <AccordionContext.Provider value={context}>
      <div className="space-y-6">{children}</div>
    </AccordionContext.Provider>
  );
};

export default Accordion;
export { Toggle, Panel, useContext };
