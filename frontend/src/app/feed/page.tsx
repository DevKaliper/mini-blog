import { FeedPage } from "@/components/feed";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function BlogFeed() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <FeedPage session={session} />
  );
}
