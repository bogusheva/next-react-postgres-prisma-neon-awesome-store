"use client";
import Link from "next/link";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import { signUpUser } from "@/lib/actions/user.actions";

const SignUpForm = () => {
    const [data, formAction] = useActionState(signUpUser, {
        success: false,
        message: "",
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const SignUpButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button disabled={pending} className="w-full" variant="default">
                {pending ? "Submitting..." : "Sign Up"}
            </Button>
        );
    };

    return (
        <form action={formAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        defaultValue={signUpDefaultValues.name}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoComplete="email"
                        defaultValue={signUpDefaultValues.email}
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        required
                        autoComplete="password"
                        defaultValue={signUpDefaultValues.password}
                    />
                </div>
                <div>
                    <Label htmlFor="password">Confirm password</Label>
                    <Input
                        type="confirmPassword"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        autoComplete="confirmPassword"
                        defaultValue={signUpDefaultValues.confirmPassword}
                    />
                </div>
                <div>
                    <SignUpButton />
                </div>
                {data && !data.success && <div className="text-center text-destructive">{data.message}</div>}
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/sign-in" target="_self" className="link">
                        Sign In
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default SignUpForm;
