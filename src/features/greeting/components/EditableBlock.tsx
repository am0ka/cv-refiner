"use client";

import { Button, Input, Textarea } from "@/components/ui";
import { Pencil, Save, X } from "lucide-react";
import { FC, useState } from "react";

export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'list';
}

interface EditableBlockProps {
    item: any;
    onSave: (updated: any) => void;
    fields: FieldConfig[];
}

const EditableBlock: FC<EditableBlockProps> = ({ item, onSave, fields }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(item);

    const handleSave = () => {
        onSave(editedItem);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedItem(item);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="space-y-3">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 uppercase">{field.label}</label>
                            {field.type === 'list' ? (
                                <Textarea
                                    value={Array.isArray(editedItem[field.name]) ? editedItem[field.name].join('\n') : editedItem[field.name]}
                                    onChange={(e) => setEditedItem({ ...editedItem, [field.name]: e.target.value.split('\n') })}
                                    rows={5}
                                />
                            ) : (
                                <Input
                                    value={editedItem[field.name] || ''}
                                    onChange={(e) => setEditedItem({ ...editedItem, [field.name]: e.target.value })}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Save</Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel} className="gap-2"><X className="h-4 w-4" /> Cancel</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative border-l-2 border-zinc-200 pl-4 transition-colors">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900">{item.role || item.institution}</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-zinc-400 opacity-100 transition-colors hover:text-zinc-900"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil className="h-3 w-3" />
                </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-zinc-700">{item.company || item.degree}</span>
                <span className="text-sm text-zinc-500">{item.startDate} - {item.endDate}</span>
            </div>
            {item.description && item.description.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600">
                    {item.description.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EditableBlock;
