import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface GreetingPageProps {
    searchParams: Promise<{
        name?: string;
        email?: string;
    }>;
}

export default async function GreetingPage({ searchParams }: GreetingPageProps) {
    const { name, email } = await searchParams;
    const displayName = name || "Guest";

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-zinc-900">
                        Greetings {displayName}!
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
                    <Link href="/">
                        <Button variant="outline">
                            Upload Another CV
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
