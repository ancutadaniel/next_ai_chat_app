import { signOutAction } from '@/app/actions';

export default function SignOutButton({ userName }: { userName: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-300">{userName}</span>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-600"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}