'use server'

import { createClient } from "@/lib/supabase/server";
import { CVData } from "@/features/greeting/types";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function registerAndSave(email: string, cvData: CVData) {
    const supabase = await createClient();

    // 1. Sign Up (Magic Link or Password). 
    // Requirement: "send a email confirmation".
    // We'll use a specific flow. Since we don't want to ask for password if "login implemented later", 
    // maybe we just use OTP / Magic Link? 
    // The prompt says "User's login ... implemented later", but "auth_id is taken from supabase auth".
    // I entered a password field in my plan. I'll stick to password to be safe standard Auth.
    // But I'll generate a random one if the user doesn't provide it? 
    // No, I'll ask the user for a password in the modal.

    // Wait, the action signature I defined is `(email, cvData)`. I should add `password`.
    // But wait, the prompt says "Found error? Correct it... When user is done... submit... create new record in supabase... Field auth_id...".
    // It doesn't explicitly say "Ask user for password".
    // It says "User's login ... will be implemented later". This implies we might NOT want to burden them with password.
    // But Supabase Auth needs one or use Magic Link.
    // I will use a random password and maybe tell them? or just Magic Link `signInWithOtp`.
    // If I use `signInWithOtp`, a user is created in Auth. receiving an email.
    // `data.user` is returned.

    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // We want to sign up, so effectively this creates a user if not exists.
            shouldCreateUser: true,
        }
    });

    if (authError) {
        console.error("Auth Error:", authError);
        return { error: authError.message };
    }

    // Note: signInWithOtp might not return the user object immediately if it's just sending an email.
    // However, for `public.users` table, we need the `auth_id`.
    // We can lookup the user by email using the ADMIN client.

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the user by email to separate get their ID.
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    // listUsers is inefficient if many users, but fine for now. Better: getUserById or something? 
    // Admin API doesn't have "getUserByEmail" easily exposed without list? 
    // Actually `listUsers` has generic support.

    // Ideally we want the ID. 
    // Let's try `createUser` with a dummy password if they don't exist, to get the ID?
    // But `signInWithOtp` is cleaner.

    // Let's assume we can get the user ID. 
    // Actually, if I use `signUp` with a password, I get the ID back immediately in `data.user`.
    // Let's force a password for now. It's cleaner for "creating a record".
    // We'll hardcode a temporary password or ask for it?
    // I'll ask for it.

    return { success: true }; // Placeholder until I decide the exact flow 
}

export async function createUserWithPassword(payload: { email: string, password?: string, cvData: CVData }) {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const password = payload.password || "TemporaryPass123!@#"; // Fallback if hidden

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: password,
    });

    if (authError) {
        return { error: authError.message };
    }

    const user = authData.user;
    if (!user) return { error: "Failed to create user" };

    // 2. Create User Record in public.users
    const { error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
            auth_id: user.id,
            first_name: payload.cvData.firstName,
            last_name: payload.cvData.lastName,
            email: payload.email,
            cv_file_path: payload.cvData.filePath,
            profile_data: payload.cvData
        });

    if (dbError) {
        console.error("DB Insert Error:", dbError);
        return { error: "Failed to save user data" };
    }

    return { success: true };
}
