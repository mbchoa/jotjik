import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCsrfToken } from 'next-auth/client';

const GoogleSignInButton = ({ redirectUrl }) => {
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(async () => {
    const token = await getCsrfToken();
    setCsrfToken(token);
  }, []);

  return (
    <form className="w-full" action="/api/auth/signin/google" method="POST">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value={redirectUrl} />
      <button
        type="submit"
        className="w-full inline-flex items-center rounded-sm bg-blue-500 text-center"
      >
        <Image src="/btn_google_light_normal.svg" width={46} height={46} />
        <span className="text-white font-medium mx-auto">Sign in with Google</span>
      </button>
    </form>
  );
};

export default GoogleSignInButton;
