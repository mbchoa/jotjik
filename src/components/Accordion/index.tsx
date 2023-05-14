import { useMemo, type Dispatch, type SetStateAction } from "react";

import AccordionContext from "./context";
import useContext from "./useContext";

import Panel from "./Panel";
import Toggle from "./Toggle";

interface Props {
  activeEventKey: number;
  children: React.ReactNode;
  onToggle: Dispatch<SetStateAction<number>>;
}

const Accordion: React.FC<Props> = ({ activeEventKey, onToggle, children }) => {
  const context = useMemo(
    () => ({ activeEventKey, onToggle }),
    [activeEventKey, onToggle]
  );

  return (
    <AccordionContext.Provider value={context}>
      <div className="space-y-6">{children}</div>
    </AccordionContext.Provider>
  );
};

export default Accordion;
export { Toggle, Panel, useContext };
