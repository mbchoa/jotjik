import Image from 'next/image';
import { signIn } from 'next-auth/client';

const GoogleSignInButton = ({ redirectUrl }) => (
  <button
    className="w-full inline-flex items-center rounded-sm bg-pink-900 text-center"
    onClick={() => signIn('google', { callbackUrl: redirectUrl })}
  >
    <Image src="/btn_google_light_normal.svg" width={46} height={46} />
    <span className="text-white font-medium mx-auto">Sign in with Google</span>
  </button>
);

export default GoogleSignInButton;
