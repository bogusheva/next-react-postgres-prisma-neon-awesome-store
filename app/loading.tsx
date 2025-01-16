import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
    return (
        <div className="flex justify-center items-center h-[100vh] w-[100vw]">
            <Image alt="Loading..." src={loader} height={150} width={150} />
        </div>
    );
};

export default LoadingPage;
