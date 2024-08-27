export interface CardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return <div className="bg-white shadow rounded p-4 w-full">{children}</div>;
};
