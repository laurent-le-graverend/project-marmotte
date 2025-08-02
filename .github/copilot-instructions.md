# Copilot Instructions for Conjugation Game Project

## Project Context

This project is a simple French conjugation quiz game built in **Next.js 15.4+** using the **App Router**.

The app allows kids to:
- Input their name
- Choose and play a conjugation game
- Answer questions for common French verbs (être, avoir, etc.)
- Earn points and view feedback
- Store their name and score locally

## Features

- Conjugation quiz UI
- Supports multiple tenses: présent, imparfait, futur, passé composé
- Local score tracking with `localStorage`
- React hooks for state
- Dynamic questions based on subject, verb, and tense

## Stack

- **Next.js 15.4+** with App Router
- **React (useState, useEffect)** with functional components
- **Tailwind CSS** for styling
- `localStorage` for storing name and score

## Code Style Guidelines

- Use **arrow functions** and **functional components** only
- Use **React hooks** (`useState`, `useEffect`) in Client Components
- Keep logic simple and readable
- No server components needed

## Naming Conventions

- `camelCase` for variables and functions
- `PascalCase` for React components
- Use clear, descriptive names: `playerName`, `question`, `score`, etc.

## Folder Layout

Follows `app/` structure:

```
app/
components/
lib/
```

## Styling

- Use **Tailwind CSS** classes only
- No CSS-in-JS or inline styles
- Use semantic HTML (`<main>`, `<section>`, `<h1>` etc.)

## What Copilot should avoid

- Do not suggest class-based React components
- Do not suggest Redux or other state libs
- Do not use direct DOM manipulation
- Do not use jQuery or outdated libraries
- Do not suggest server components or external APIs

## Notes

- The game is meant to be simple, fast, and fun for kids
- Keep UI responsive and accessible
- Feedback must be clear and immediate
- Code should be beginner-friendly and easy to iterate on
