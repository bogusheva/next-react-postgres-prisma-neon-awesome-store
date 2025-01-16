"use client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    return (
        <div className="flex h-[100vh] flex-col items-center justify-center">
            <Image alt={`${APP_NAME} logo`} src="/images/logo.svg" width={48} height={48} priority={true} />
            <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-4">Not Found</div>
                <p className="text-destructive">Could not find requested page</p>
                <Button onClick={() => (window.location.href = "/")} variant="outline" className="mt-4 ml-2">
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
