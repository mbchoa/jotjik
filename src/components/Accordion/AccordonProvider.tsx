import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';

interface IAccordionContext {
  activeEventKey: number;
  onToggle: Dispatch<SetStateAction<number>>;
}

const AccordionContext = createContext<IAccordionContext | null>(null);

interface IAccordionProviderProps {
  children: React.ReactNode;
}

export const AccordionProvider = ({ children }: IAccordionProviderProps) => {
  const [activeEventKey, setActiveEventKey] = useState(-1);

  return (
    <AccordionContext.Provider
      value={{
        activeEventKey,
        onToggle: setActiveEventKey,
      }}
    >
      {children}
    </AccordionContext.Provider>
  );
};

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion context is null');
  }
  return context;
};
