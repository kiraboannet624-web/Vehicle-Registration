

# Vehicle Registration & Management Platform

A production-grade frontend dashboard for registering and managing vehicles, built with React + Vite.

## Features

- Public vehicle list (no login required)
- Client-side authentication with protected routes
- 3-step vehicle registration wizard with full Zod validation
- Tabbed vehicle detail view (Info, Owner, Registration, Insurance)
- Edit and delete vehicles with confirmation modal
- Toast notifications for all actions
- TanStack Query caching per data segment

## Tech Stack

- React 19, Vite
- React Router v7
- TanStack Query v5 (data fetching & caching)
- Axios (HTTP client)
- Zod (validation)
- React Hot Toast (notifications)
- Tailwind CSS / Custom CSS

## Getting Started

bash
npm install
npm run dev


Open [http://localhost:5173](http://localhost:5173)

## Login Credentials
Email:    test@gmail.com
Password: Password!234

## API Base URL

Configured via .env:

VITE_API_BASE_URL=https://student-management-system-backend.up.railway.app

## Routes

| Path | Access | Description |

  | Public | Vehicle list table |
 login | Public | Sign in page |
 dashboard | Protected | Stats + manage vehicles |
 vehicle/new | Protected | 3-step registration form |
 vehicle | Protected | Tabbed vehicle details |
 vehicle | Protected | Edit vehicle form |
