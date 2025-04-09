"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GreetingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get("name") || "Guest";
    const email = searchParams.get("email");

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-zinc-900">
                        Greetings {name}!
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    {email && (
                        <p className="text-zinc-600">
                            email: <span className="font-medium text-zinc-900">{email}</span>
                        </p>
                    )}
                    <p className="text-sm text-zinc-500">
                        We have successfully processed your CV.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => router.push("/")} variant="outline">
                        Upload Another CV
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function GreetingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GreetingContent />
        </Suspense>
    );
}
