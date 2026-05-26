import { signInWithGoogle } from "@/app/auth/actions";

export function GoogleAuthButton() {
  return (
    <form action={signInWithGoogle}>
      <button className="button secondary full google-button" type="submit">
        <span className="google-g">G</span>
        Continue with Google
      </button>
    </form>
  );
}
