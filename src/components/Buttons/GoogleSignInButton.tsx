import { signIn } from "next-auth/react";
import Image from "next/image";

interface Props {
  redirectUrl: string;
}

const GoogleSignInButton: React.FC<Props> = ({ redirectUrl }) => {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: redirectUrl });
  };

  return (
    <button
      className="inline-flex w-full items-center rounded-sm bg-pink-900 text-center"
      onClick={() => void handleSignIn()}
    >
      <Image
        src="/btn_google_light_normal.svg"
        alt="Google Logo"
        width={46}
        height={46}
      />
      <span className="mx-auto font-medium text-white">
        Sign in with Google
      </span>
    </button>
  );
};

export default GoogleSignInButton;
