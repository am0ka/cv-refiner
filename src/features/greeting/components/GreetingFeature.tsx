"use client";

import {
    Badge,
    Button,
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui";
import { useGetLocalCVData } from "@/features/greeting/hooks/getLocalCVData";
import { CVData } from "@/features/greeting/types";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

import BioSection from "@/features/greeting/components/BioSection";
import EditableBlock from "@/features/greeting/components/EditableBlock";
import SubmitFloatingButton from "@/features/greeting/components/SubmitFloatingButton";

const NotFound: FC = () => (
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

const Loading: FC = () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
    </div>
);

const GreetingPageContent: FC<{ data: CVData; setData: (d: CVData) => void }> = ({ data, setData }) => {
    const { experiences, education, skills, languages } = data;

    const handleUpdate = (newData: CVData) => {
        setData(newData);
        localStorage.setItem("cvData", JSON.stringify(newData));
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-16 pb-24">
            {/* Fixed Upload New Button */}
            <Link href="/">
                <Button
                    className="fixed top-6 right-6 z-50 shadow-none"
                    variant="outline"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload New
                </Button>
            </Link>

            {/* Header / Basic Info */}
            <BioSection data={data} onUpdate={handleUpdate} />

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
                                    <EditableBlock
                                        key={idx}
                                        item={exp}
                                        onSave={(updated) => {
                                            const newExp = [...experiences];
                                            newExp[idx] = updated;
                                            handleUpdate({ ...data, experiences: newExp });
                                        }}
                                        fields={[
                                            { name: 'role', label: 'Role', type: 'text' },
                                            { name: 'company', label: 'Company', type: 'text' },
                                            { name: 'startDate', label: 'Start Date', type: 'text' },
                                            { name: 'endDate', label: 'End Date', type: 'text' },
                                            { name: 'description', label: 'Description', type: 'list' },
                                        ]}
                                    />
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
                                    <EditableBlock
                                        key={idx}
                                        item={edu}
                                        onSave={(updated) => {
                                            const newEdu = [...education];
                                            newEdu[idx] = updated;
                                            handleUpdate({ ...data, education: newEdu });
                                        }}
                                        fields={[
                                            { name: 'institution', label: 'Institution', type: 'text' },
                                            { name: 'degree', label: 'Degree', type: 'text' },
                                            { name: 'startDate', label: 'Start Date', type: 'text' },
                                            { name: 'endDate', label: 'End Date', type: 'text' },
                                        ]}
                                    />
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

            <SubmitFloatingButton data={data} />
        </div>
    );
};

const GreetingFeature: FC = () => {
    const { data, loading, setData } = useGetLocalCVData();

    if (loading) return <Loading />;
    if (!data) return <NotFound />;

    return <GreetingPageContent data={data} setData={setData} />;
};

export default GreetingFeature;
