import UploadForm from "@/features/parser/components/UploadForm";
import LoginModal from "@/features/auth/components/LoginModal";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="absolute top-0 right-0 p-4">
        <LoginModal />
      </div>
      <UploadForm />
    </div>
  );
}
