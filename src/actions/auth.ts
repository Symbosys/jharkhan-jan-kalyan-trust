"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Please enter both email and password." };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/admin",
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid email or password." };
                default:
                    return { error: "Something went wrong. Please try again." };
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}
