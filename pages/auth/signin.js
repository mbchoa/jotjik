import GoogleSignInButton from '../../components/Buttons/GoogleSignInButton';

const Signin = () => {
  return (
    <section className="flex flex-col justify-center h-full">
      <h1 className="mb-6 text-3xl font-bold">Log in to your account</h1>
      <GoogleSignInButton redirectUrl={`${process.env.NEXT_PUBLIC_HOST_URL}/stats`} />
    </section>
  );
};

export default Signin;
