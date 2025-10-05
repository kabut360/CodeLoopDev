"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLoopsByUser } from "@/lib/firestore";
import type { Loop } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

function LoopCard({ loop }: { loop: Loop }) {
    return (
        <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline text-lg tracking-tight">{loop.language}</CardTitle>
                <CardDescription className="line-clamp-2 h-10 font-body">{loop.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <Badge variant="outline">{loop.createdAt ? formatDistanceToNow(loop.createdAt.toDate()) : '...'} ago</Badge>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/loop/${loop.id}`}>
                        Open Loop <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function MyLoopsPage() {
  const { user } = useAuth();
  const [loops, setLoops] = useState<Loop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getLoopsByUser(user.uid)
        .then(setLoops)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <div className="container max-w-screen-2xl py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-headline font-bold">My Loops</h1>
            <p className="text-muted-foreground">All your saved code generations.</p>
        </div>
        <Button asChild size="lg">
            <Link href="/"><PlusCircle className="mr-2 h-4 w-4" /> New Loop</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-1/2" />
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : loops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loops.map((loop) => (
            <LoopCard key={loop.id} loop={loop} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg bg-card mt-10">
          <h2 className="text-2xl font-headline font-semibold">No loops yet!</h2>
          <p className="mt-2 max-w-md text-muted-foreground">Start by creating a new loop in the playground and your saved work will appear here.</p>
          <Button asChild className="mt-6">
            <Link href="/">
                <PlusCircle className="mr-2 h-4 w-4" /> Go to Playground
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
