""

import { FeedPage } from "@/components/feed";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function BlogFeed() {
  const session = await getServerSession(authOptions);

  // Permitir acceso tanto con sesión como sin ella (para invitados)
  return <FeedPage session={session} />;
}
