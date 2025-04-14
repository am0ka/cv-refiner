"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CVData } from "@/lib/types";
import { ArrowLeft, Loader2, Mail, Linkedin, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GreetingPage() {
    const [data, setData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("cvData");
            if (storedData) {
                setData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to parse CV data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50 p-4">
                <h2 className="text-xl font-semibold text-zinc-900">No CV data found</h2>
                <p className="text-zinc-500">Please upload your CV first.</p>
                <Link href="/">
                    <Button>
                        Go Home
                    </Button>
                </Link>
            </div>
        );
    }

    const { firstName, lastName, email, phone, linkedin, summary, experiences, education, skills, languages } = data;
    const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Candidate";

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header / Basic Info */}
            <Card>
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <CardTitle className="text-3xl font-bold">{displayName}</CardTitle>
                        {summary && <CardDescription className="mt-2 text-base">{summary}</CardDescription>}
                    </div>
                    <Link href="/">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Upload New
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 text-sm text-zinc-600">
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
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content: Experience & Education */}
                <div className="space-y-6 md:col-span-2">
                    {experiences && experiences.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="border-l-2 border-zinc-200 pl-4">
                                        <h3 className="font-semibold text-zinc-900">{exp.role}</h3>
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-sm font-medium text-zinc-700">{exp.company}</span>
                                            <span className="text-sm text-zinc-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        {exp.description && exp.description.length > 0 && (
                                            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600">
                                                {exp.description.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {education && education.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-semibold text-zinc-900">{edu.institution}</h3>
                                        <p className="text-sm text-zinc-700">{edu.degree}</p>
                                        <p className="text-sm text-zinc-500">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar: Skills */}
                <div className="space-y-6">
                    {skills && skills.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Skills</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {skills.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {languages && languages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Languages</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {languages.map((lang, idx) => (
                                    <Badge key={idx} variant="outline">
                                        {lang}
                                    </Badge>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
