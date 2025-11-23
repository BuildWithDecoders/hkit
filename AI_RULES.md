# AI Editor Rules and Project Guidelines

This document outlines the technical stack and specific rules for the AI editor (Dyad) to ensure consistency, maintainability, and adherence to project standards.

## 1. Project Tech Stack

The application is built using the following core technologies:

*   **Frontend Framework:** React (with TypeScript).
*   **Build Tool:** Vite.
*   **Styling:** Tailwind CSS for utility-first styling, ensuring all components are responsive.
*   **UI Components:** shadcn/ui (built on Radix UI primitives).
*   **Routing:** React Router DOM (v6).
*   **Data Management:** TanStack Query (React Query) for server state management.
*   **Icons:** Lucide React.
*   **Data Visualization:** Recharts.
*   **Notifications:** Sonner (for modern toasts) and shadcn/ui Toast.

## 2. Code Structure and Conventions

*   **Directory Structure:**
    *   Pages must reside in `src/pages/`.
    *   Reusable components must reside in `src/components/`.
    *   Hooks must reside in `src/hooks/`.
*   **Routing:** All main routes are defined in `src/App.tsx`.
*   **Styling:** Always use Tailwind CSS classes. All designs must be responsive.

## 3. Mandatory Library Usage Rules

The following libraries must be used for their specific purposes:

| Feature | Mandatory Library | Notes |
| :--- | :--- | :--- |
| **UI Components** | shadcn/ui (Radix UI) | Use pre-built components from `src/components/ui/`. Do not introduce new UI libraries. |
| **Routing & Navigation** | `react-router-dom` | Use for all navigation and routing logic. |
| **Server State/Data Fetching** | `@tanstack/react-query` | Use for managing asynchronous data operations. |
| **Icons** | `lucide-react` | Use for all visual icons. |
| **Charts & Graphs** | `recharts` | Use for all data visualization components. |
| **User Notifications** | `sonner` | Prioritize `sonner` for simple, non-blocking user feedback (toasts). |
| **Forms** | `react-hook-form` & `zod` | Use for form validation and management. |