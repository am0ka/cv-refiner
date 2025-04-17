"use client";

import { createUserWithPassword } from "@/features/greeting/actions";
import {
    Button,
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
    Input,
    Label
} from "@/components/ui";
import { CVData } from "@/features/greeting/types";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SubmitFloatingButton({ data }: { data: CVData }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(data.email || "");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const result = await createUserWithPassword({
                email,
                password,
                cvData: data
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Profile saved!", {
                    description: "Please check your email for confirmation."
                });
                setOpen(false);
                // Redirect to dashboard
                // We should probably set a cookie or something to identify them in dashboard since they aren't 'confirmed' logged in yet?
                // But the dashboard is protected?
                // For now, assume dashboard is accessible or specific to this flow.
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="fixed bottom-8 right-8 z-50">
                    <Button size="lg" className="h-14 rounded-full px-8 shadow-lg transition-transform hover:scale-105">
                        <Send className="mr-2 h-5 w-5" />
                        Save & Continue
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Save your profile</DialogTitle>
                    <DialogDescription>
                        Create an account to save your CV and start tracking jobs.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-zinc-500">Used for future login (Authentication).</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
