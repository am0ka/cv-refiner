# CV Refiner

A personal tool designed to streamline the process of applying for vacancies by tailoring your CV to specific job descriptions.

## Project Idea

The main goal of this project is to create a personal assistant that helps in applying for jobs. The workflow is designed to be simple yet powerful:

1.  **Initial Setup**: The user provides personal information and "manually written" input to create a user profile and generate a PDF CV template.
2.  **Job Application**: At any time, the user can create a new entry with a specific job description and personal notes, highlighting important aspects.
3.  **Smart Tailoring**: The project's logic analyzes the job description and suggests modifications to the template CV to better match the vacancy.
4.  **Final Output**: The app generates a new PDF file with the selected modification suggestions. This generated PDF is designed to look very similar to the original PDF provided/generated in the beginning, ensuring professional consistency.

## Current Progress

> **Note**: This project is constantly in development as new ideas arise and the scope evolves.

- [x] **Profile Creation**: Manual input for personal details and CV data.
- [x] **PDF Parsing**: Ability to parse uploaded PDF files to extract initial data.
- [x] **Job Submission**: Interface to create new entries with Job Description and Notes.
- [x] **Dashboard**: View and manage job submissions/applications.
- [ ] **CV Template Generation**: Creating a standard PDF template from user data.
- [ ] **Smart Modification Logic**: AI/Logic to suggest CV improvements based on job descriptions.
- [ ] **PDF Generation**: Generating the final PDF with applied modifications.
- [ ] **Style Matching**: Ensuring the generated PDF mimics the original design.

## Getting Started

This is a [Next.js](https://nextjs.org) project.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
