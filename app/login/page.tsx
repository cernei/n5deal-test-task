import LoginForm from './LoginForm';

export const metadata = {
  title: 'Log In - N5Deal',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-950">
          Sign in to your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your email and password to access the platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100 sm:px-10">
          <LoginForm submitLabel="Sign In" />
        </div>
      </div>
    </main>
  );
}
