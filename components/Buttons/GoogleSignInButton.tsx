import { signIn } from 'next-auth/client';
import Image from 'next/image';

interface Props {
  redirectUrl: string;
}

const GoogleSignInButton: React.FC<Props> = ({ redirectUrl }) => (
  <button
    className="w-full inline-flex items-center rounded-sm bg-pink-900 text-center"
    onClick={() => signIn('google', { callbackUrl: redirectUrl })}
  >
    <Image src="/btn_google_light_normal.svg" alt="Google Logo" width={46} height={46} />
    <span className="text-white font-medium mx-auto">Sign in with Google</span>
  </button>
);

export default GoogleSignInButton;
