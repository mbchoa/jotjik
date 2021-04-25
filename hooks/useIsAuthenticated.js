import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';

const useIsAuthenticated = () => {
  const [session] = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setIsAuthenticated(true);
    }
  }, [session]);

  return isAuthenticated;
};

export default useIsAuthenticated;
