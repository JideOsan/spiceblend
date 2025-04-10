import { Link } from 'react-router-dom';

type Props = {
  to?: string;
  className?: string;
  children: React.ReactNode;
};

export const MaybeLink = ({ to, children, className }: Props) => {
  return to ? (
    <Link to={to} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
};
