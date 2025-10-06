"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Loop } from "@/types";
import { generateCode } from "@/ai/flows/generate-code-from-prompt";
import { explainGeneratedCode } from "@/ai/flows/explain-generated-code";
import { addLoop } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2, Play, Copy, GitFork, BookOpen, ChevronRight, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";

const languages = ["JavaScript", "Python", "HTML", "Go", "TypeScript", "CSS"];

const playgroundSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters."),
  language: z.string().min(1, "Please select a language."),
});

type PlaygroundFormValues = z.infer<typeof playgroundSchema>;

type Props = {
  initialLoop?: Loop;
};

export function Playground({ initialLoop }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isExplaining, startExplanationTransition] = useTransition();

  const [code, setCode] = useState(initialLoop?.code ?? "");
  const [explanation, setExplanation] = useState(initialLoop?.explanation ?? "");
  const [parentLoopId, setParentLoopId] = useState<string | null>(initialLoop?.parentLoopId ?? null);
  const [currentLoopId, setCurrentLoopId] = useState<string | null>(initialLoop?.id ?? null);
  const [executionOutput, setExecutionOutput] = useState("");

  const form = useForm<PlaygroundFormValues>({
    resolver: zodResolver(playgroundSchema),
    defaultValues: {
      prompt: initialLoop?.prompt ?? "",
      language: initialLoop?.language ?? "JavaScript",
    },
  });

  const handleGenerateCode = async (values: PlaygroundFormValues) => {
    if (!user) return;

    startGenerationTransition(async () => {
      try {
        const result = await generateCode(values);
        setCode(result.code);
        setExplanation(""); // Clear previous explanation
        setExecutionOutput(""); // Clear execution output
        
        const newLoopId = await addLoop({
          userId: user.uid,
          prompt: values.prompt,
          language: values.language,
          code: result.code,
          parentLoopId: parentLoopId,
        });

        toast({
          title: "Loop Saved!",
          description: "Your new code has been generated and saved.",
        });

        // Navigate to the new loop's URL
        router.push(`/loop/${newLoopId}`);
        setCurrentLoopId(newLoopId);
        setParentLoopId(null); // Reset parent ID after saving

      } catch (error) {
        console.error("Code generation failed:", error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate code. Please try again.",
        });
      }
    });
  };
  
  const handleExplainCode = async () => {
    if (!code) return;
    
    startExplanationTransition(async () => {
        try {
            const result = await explainGeneratedCode({ code });
            setExplanation(result.explanation);
        } catch (error) {
            console.error("Explanation failed:", error);
            toast({
                variant: "destructive",
                title: "Explanation Failed",
                description: "Could not generate an explanation. Please try again.",
            });
        }
    });
  };

  const handleFork = () => {
    if (!currentLoopId) return;
    
    setParentLoopId(currentLoopId);
    setCurrentLoopId(null);
    router.push('/');
    toast({
      title: "Loop Forked!",
      description: "You're now working on a new version. Generate to save.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied to clipboard!" });
  };
  
  const handleRunCode = () => {
    setExecutionOutput("Simulating code execution...\n\n> This is a demo feature. Actual code execution is not implemented.");
  }

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Panel: Prompt */}
      <Card className="lg:col-span-3 sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary"/> Prompt
          </CardTitle>
          <CardDescription>Describe the code you want to create.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateCode)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Idea</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A React button that shows a confetti animation on click." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Middle Panel: Code */}
      <div className="lg:col-span-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated Code</CardTitle>
            <div className="flex items-center gap-2 pt-2">
                <Button onClick={handleRunCode} size="sm" variant="outline" disabled={!code}><Play className="mr-2"/>Run</Button>
                <Button onClick={handleCopy} size="sm" variant="outline" disabled={!code}><Copy className="mr-2"/>Copy</Button>
                <Button onClick={handleFork} size="sm" variant="outline" disabled={!currentLoopId}><GitFork className="mr-2"/>Fork</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-md p-4 h-96 overflow-auto font-code text-sm">
                {isGenerating ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Generating...
                    </div>
                ) : code ? (
                    <pre><code>{code}</code></pre>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Your generated code will appear here.
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
        <Card className={executionOutput ? 'block' : 'hidden'}>
            <CardHeader><CardTitle className="font-headline">Execution Output</CardTitle></CardHeader>
            <CardContent>
                <div className="bg-muted/50 rounded-md p-4 font-code text-sm text-muted-foreground">
                    <pre>{executionOutput}</pre>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Right Panel: Explanation */}
      <Card className="lg:col-span-3 sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="text-primary"/>AI Explainer</CardTitle>
          <CardDescription>Get a line-by-line explanation of the code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button onClick={handleExplainCode} className="w-full" variant="secondary" disabled={!code || isExplaining}>
                {isExplaining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                Explain Code
            </Button>
            <div className="prose prose-sm dark:prose-invert max-w-none h-80 overflow-auto rounded-md border p-4">
                {isExplaining ? (
                     <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Thinking...
                    </div>
                ) : explanation ? (
                    <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                       <BookOpen className="h-8 w-8 mb-2" />
                        Click "Explain Code" to get an analysis.
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
