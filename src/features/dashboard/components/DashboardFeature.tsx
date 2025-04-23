import JobSubmissionModal from "@/features/dashboard/components/JobSubmissionModal";
import SubmissionsTable from "@/features/dashboard/components/SubmissionsTable";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DashboardFeature() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let submissions = [];
    if (user) {
        const { data: userData } = await supabase.from('users').select('id').eq('auth_id', user.id).single();

        if (userData) {
            const { data: subs } = await supabase
                .from('submissions')
                .select('*')
                .eq('user', userData.id)
                .order('created_at', { ascending: false });
            submissions = subs || [];
        }
    }

    return (
        <div className="container mx-auto max-w-6xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
                    <p className="text-muted-foreground">Manage your job search pipeline.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/greeting">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to CV
                        </Button>
                    </Link>
                    <JobSubmissionModal>
                        <Button>+ Job Description</Button>
                    </JobSubmissionModal>
                </div>
            </div>

            {user ? (
                <SubmissionsTable initialData={submissions} />
            ) : (
                <div className="rounded-lg border bg-card p-8 text-center text-card-foreground shadow-sm">
                    <h3 className="text-lg font-semibold">Authentication Required</h3>
                    <p className="text-muted-foreground">Please log in or check your email for the confirmation link to view your submissions.</p>
                </div>
            )}
        </div>
    );
}
