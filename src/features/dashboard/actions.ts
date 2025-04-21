'use server'

import { createClient } from "@/lib/supabase/server";

export async function addJobSubmission(data: {
    companyName: string;
    jobTitle: string;
    link: string;
    phase: string;
    description?: string;
    notes?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // We need the internal user ID from public.users
    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

    if (!userData) {
        return { error: "User profile not found." };
    }

    const { error } = await supabase.from('submissions').insert({
        user_id: userData.id,
        company_name: data.companyName,
        job_title: data.jobTitle,
        link: data.link,
        phase: data.phase,
        description: data.description,
        notes: data.notes
    });

    if (error) {
        console.error("Submission Error:", error);
        return { error: "Failed to create submission." };
    }

    return { success: true };
}
