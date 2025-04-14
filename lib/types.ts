export interface CVExperience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[]; // bullet points
    summary?: string;
}

export interface CVEducation {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface CVData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    linkedin?: string;
    summary?: string;
    experiences: CVExperience[];
    education: CVEducation[];
    skills: string[];
    languages: string[];
}
