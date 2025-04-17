"use client";

import { Button, Card, CardDescription, CardHeader, CardTitle, Input, Textarea } from "@/components/ui";
import { CVData } from "@/features/greeting/types";
import { Linkedin, Mail, Pencil, Phone, Save, X } from "lucide-react";
import { FC, useState, useEffect } from "react";

interface BioSectionProps {
    data: CVData;
    onUpdate: (data: CVData) => void;
}

const BioSection: FC<BioSectionProps> = ({ data, onUpdate }) => {
    const { firstName, lastName, email, phone, linkedin, summary } = data;
    const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Candidate";

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editedBio, setEditedBio] = useState({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phone: phone || "",
        linkedin: linkedin || "",
        summary: summary || ""
    });

    // Update local state when data changes (e.g. initial load)
    useEffect(() => {
        setEditedBio({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            linkedin: data.linkedin || "",
            summary: data.summary || ""
        });
    }, [data]);

    const handleSaveBio = () => {
        const newData = { ...data, ...editedBio };
        onUpdate(newData);
        setIsEditingBio(false);
    };

    const handleCancelBio = () => {
        setEditedBio({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            linkedin: data.linkedin || "",
            summary: data.summary || ""
        });
        setIsEditingBio(false);
    };

    return (
        <Card>
            <CardHeader>
                {isEditingBio ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-zinc-500">First Name</label>
                                <Input
                                    value={editedBio.firstName}
                                    onChange={(e) => setEditedBio({ ...editedBio, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-zinc-500">Last Name</label>
                                <Input
                                    value={editedBio.lastName}
                                    onChange={(e) => setEditedBio({ ...editedBio, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-zinc-500">Summary</label>
                            <Textarea
                                rows={4}
                                value={editedBio.summary}
                                onChange={(e) => setEditedBio({ ...editedBio, summary: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-zinc-500">Email</label>
                                <Input
                                    value={editedBio.email}
                                    onChange={(e) => setEditedBio({ ...editedBio, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-zinc-500">Phone</label>
                                <Input
                                    value={editedBio.phone}
                                    onChange={(e) => setEditedBio({ ...editedBio, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-zinc-500">LinkedIn</label>
                                <Input
                                    value={editedBio.linkedin}
                                    onChange={(e) => setEditedBio({ ...editedBio, linkedin: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={handleSaveBio} className="gap-2"><Save className="h-4 w-4" /> Save</Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelBio} className="gap-2"><X className="h-4 w-4" /> Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <CardTitle className="text-3xl font-bold">{displayName}</CardTitle>
                                {summary && <CardDescription className="mt-2 text-base">{summary}</CardDescription>}
                                <div className="mt-4 flex items-center gap-2 rounded-md bg-blue-50 p-2 text-sm text-blue-700">
                                    <span className="font-semibold">Tip:</span>
                                    Found an error? Correct it by clicking the pencil icon.
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditingBio(true)}>
                                    <Pencil className="h-4 w-4" />
                                    Edit Bio
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600">
                            {email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{email}</span>
                                </div>
                            )}
                            {phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{phone}</span>
                                </div>
                            )}
                            {linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="h-4 w-4" />
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        LinkedIn
                                    </a>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardHeader>
        </Card>
    );
};

export default BioSection;
