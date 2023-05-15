import { useAccordionContext } from '@/components/Accordion/AccordonProvider';

interface Props {
  children: React.ReactNode;
  eventKey: number;
  id: string;
}

const Panel: React.FC<Props> = ({ eventKey, children, id, ...rest }) => {
  const { activeEventKey } = useAccordionContext();
  const cx = `overflow-hidden transition-max-height duration-500 ease-in-out ${
    eventKey === activeEventKey ? 'max-h-screen' : 'max-h-0'
  }`;
  return (
    <div className={cx} role="region" id={id} {...rest}>
      {children}
    </div>
  );
};

export default Panel;
