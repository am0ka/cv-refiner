"use client";

import {
    Badge,
    Button,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";

export default function SubmissionsTable({ initialData }: { initialData: any[] }) {
    // We could use real-time subscription here or just display initialData

    if (initialData.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No submissions yet. Click on "+ Job Description" to add one.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.company_name}</TableCell>
                            <TableCell>
                                <a href={submission.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-blue-600">
                                    {submission.job_title}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    submission.phase === 'draft' ? 'secondary' :
                                        submission.phase === 'rejected' ? 'destructive' :
                                            submission.phase === 'offered' ? 'default' : 'outline'
                                }>
                                    {submission.phase}
                                </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={submission.notes}>
                                {submission.notes}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {/* Action logic: icon of document, if draft -> arrow right */}

                                    <Button variant="ghost" size="icon" title="View CV">
                                        <FileText className="h-4 w-4 text-zinc-500" />
                                    </Button>

                                    {submission.phase === 'draft' && (
                                        <Button variant="ghost" size="icon" title="Continue">
                                            <ArrowRight className="h-4 w-4 text-zinc-500" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
