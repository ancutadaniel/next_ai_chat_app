import { signInAction } from '@/app/actions';

export default function SignInButton() {
  return (
    <form action={signInAction}>
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
      >
        Sign in with GitHub
      </button>
    </form>
  );
}