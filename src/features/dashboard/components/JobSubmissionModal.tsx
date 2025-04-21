"use client";

import { addJobSubmission } from "@/features/dashboard/actions";
import {
    Button,
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
    Input,
    Label,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Textarea
} from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const PHASES = [
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "intro_call", label: "Intro Call" },
    { value: "assessment", label: "Assessment" },
    { value: "interview", label: "Interview" },
    { value: "onsite", label: "Onsite" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
];

export default function JobSubmissionModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        companyName: "",
        jobTitle: "",
        link: "",
        phase: "draft",
        description: "",
        notes: ""
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isDescriptionRequired = formData.phase === 'draft';

    const handleSubmit = async () => {
        // Validation
        if (!formData.companyName || !formData.jobTitle || !formData.link) {
            toast.error("Please fill in required fields (Company, Title, Link).");
            return;
        }

        // URL validation
        try {
            new URL(formData.link);
        } catch {
            toast.error("Please enter a valid URL for the job link.");
            return;
        }

        if (isDescriptionRequired && !formData.description) {
            toast.error("Job Description is required for Draft phase.");
            return;
        }

        setLoading(true);
        try {
            const result = await addJobSubmission(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Job added successfully!");
                setOpen(false);
                setFormData({
                    companyName: "",
                    jobTitle: "",
                    link: "",
                    phase: "draft",
                    description: "",
                    notes: ""
                });
                router.refresh(); // Refresh Server Component to show new data
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to add job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Job</DialogTitle>
                    <DialogDescription>
                        Track a new job opportunity and refine your CV.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name *</Label>
                            <Input
                                id="company"
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                placeholder="Google"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                value={formData.jobTitle}
                                onChange={(e) => handleChange('jobTitle', e.target.value)}
                                placeholder="Frontend Engineer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link">Job Link *</Label>
                        <Input
                            id="link"
                            value={formData.link}
                            onChange={(e) => handleChange('link', e.target.value)}
                            placeholder="https://linkedin.com/jobs/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phase">Current Phase</Label>
                        <Select value={formData.phase} onValueChange={(val) => handleChange('phase', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select phase" />
                            </SelectTrigger>
                            <SelectContent>
                                {PHASES.map(p => (
                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="flex items-center gap-2">
                            Job Description
                            {!isDescriptionRequired && <span className="text-zinc-400 font-normal">(Optional)</span>}
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="min-h-[100px]"
                            placeholder={isDescriptionRequired ? "Paste the full job description here..." : "Paste job description (optional)..."}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Any personal notes..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Job
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
