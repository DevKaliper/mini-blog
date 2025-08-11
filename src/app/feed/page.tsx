import { FeedPage } from "@/components/feed";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



export default async function BlogFeed() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/feed");
  }

  return (
    <FeedPage session={session} />
  );
}
