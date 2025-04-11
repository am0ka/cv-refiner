"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { processFileUploadErrorMessage } from "@/lib/utils";
import { ChangeEvent, DragEvent, useState } from "react";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover")
      setDragActive(true);

    if (event.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf")
      setFile(droppedFile);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || file.type !== "application/pdf") {
      toast.error("Please select a PDF before continuing.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max size is 10 MB.");
      return;
    }

    // {
    //   setUploading(true);

    //   const supabase = createClient();

    //   const uploadResult = await supabase.storage
    //     .from("cv")
    //     .upload(uuid(), file, {
    //       metadata: { filename: file.name },
    //     });

    //   if (uploadResult.error) {
    //     toast.error("Upload failed.", {
    //       description: processFileUploadErrorMessage(
    //         uploadResult.error.message
    //       ),
    //     });
    //     console.log(uploadResult.error, null, 2);
    //     setUploading(false);
    //     return;
    //   }

    //   toast.success("Upload successful.");
    //   console.log("Uploaded file:", uploadResult.data);
    //   setUploading(false);
    // }

    {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error("Parsing failed.", {
            description: errorData.error || "Unknown error occurred.",
          });
          setUploading(false);
          return;
        }

        const data = await response.json();
        console.log({ data });
        const params = new URLSearchParams();
        if (data.name) params.set("name", data.name);
        if (data.email) params.set("email", data.email);
        router.push(`/greeting?${params.toString()}`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("An error occurred during upload.");
        setUploading(false);
      }
    }


  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Let&apos;s get started</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <label
            htmlFor="cv"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${dragActive
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-200 bg-white"
              }`}
          >
            <div className="flex flex-col items-center gap-2 text-zinc-700">
              <span className="text-base font-semibold">
                Upload your CV here
              </span>
              <span className="text-sm text-zinc-500">
                PDF only, up to 10 MB
              </span>
            </div>
            <input
              id="cv"
              name="cv"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="text-sm text-zinc-500">
              {file ? `Selected: ${file.name}` : "No file chosen yet."}
            </div>
          </label>
        </CardContent>

        {file && (
          <CardFooter className="flex items-center justify-end gap-3">
            <Button
              type="reset"
              variant="ghost"
              onClick={() => {
                setDragActive(false);
                setFile(null);
              }}
            >
              Clear
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  )
};
