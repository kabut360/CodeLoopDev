import { getLoop } from "@/lib/firestore";
import { Playground } from "@/components/playground/Playground";
import { notFound } from "next/navigation";

// This component is a server component that fetches data
// and then passes it to the client component Playground.
export default async function LoopPage({ params }: { params: { id: string } }) {
  const loop = await getLoop(params.id);

  if (!loop) {
    notFound();
  }
  
  return <Playground initialLoop={loop} />;
}
