export const SignOut = () => {
  const signOut = async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <form action={signOut}>
      <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
        Sign Out :(
      </button>
    </form>
  );
}


