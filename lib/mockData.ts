import { User, Post, Comment } from './types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    email: 'bob@example.com',
    password: 'password123',
    name: 'Bob Johnson',
    createdAt: new Date('2024-02-01'),
  },
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    excerpt: 'Learn the fundamentals of Next.js 15 and build modern web applications.',
    content: `# Getting Started with Next.js 15

Next.js 15 is the latest version of the popular React framework that makes building web applications a breeze.

## Key Features

- **App Router**: The new file-system based router built on top of React Server Components
- **Server Actions**: Write server-side code directly in your components
- **Improved Performance**: Faster builds and better runtime performance

## Installation

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Creating Your First Page

Simply create a file in the \`app\` directory:

\`\`\`tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
\`\`\`

Start building amazing applications today!`,
    category: 'Web Development',
    authorId: '1',
    authorName: 'John Doe',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    title: 'Mastering TypeScript in 2024',
    excerpt: 'A comprehensive guide to TypeScript and its advanced features.',
    content: `# Mastering TypeScript in 2024

TypeScript has become an essential tool for modern web development. Let's explore its powerful features.

## Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Code Documentation**: Types serve as inline documentation

## Advanced Types

TypeScript offers many advanced type features:

### Union Types

\`\`\`typescript
type Status = 'pending' | 'approved' | 'rejected';
\`\`\`

### Generics

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

TypeScript makes your code more maintainable and scalable!`,
    category: 'Programming',
    authorId: '2',
    authorName: 'Jane Smith',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    id: '3',
    title: 'Building Responsive UIs with Tailwind CSS',
    excerpt: 'Create beautiful, responsive designs with utility-first CSS framework.',
    content: `# Building Responsive UIs with Tailwind CSS

Tailwind CSS is a utility-first CSS framework that streamlines the design process.

## Benefits

- **Rapid Development**: Build UIs faster with utility classes
- **Consistent Design**: Use a predefined design system
- **Responsive by Default**: Mobile-first responsive design

## Example

\`\`\`html
<div class="container mx-auto px-4">
  <h1 class="text-4xl font-bold text-gray-900">
    Welcome to Tailwind
  </h1>
</div>
\`\`\`

## Responsive Design

\`\`\`html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
\`\`\`

Tailwind makes responsive design effortless!`,
    category: 'Design',
    authorId: '1',
    authorName: 'John Doe',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: '4',
    title: 'Introduction to React Hooks',
    excerpt: 'Understanding useState, useEffect, and other essential React hooks.',
    content: `# Introduction to React Hooks

React Hooks revolutionized how we write React components by allowing us to use state and lifecycle features in functional components.

## useState

The most basic hook for managing state:

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect

Handle side effects in your components:

\`\`\`jsx
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

## Custom Hooks

Create reusable logic:

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });
  
  return [value, setValue];
}
\`\`\`

Hooks make React more powerful and easier to use!`,
    category: 'React',
    authorId: '2',
    authorName: 'Jane Smith',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '5',
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies shaping the web.',
    content: `# The Future of Web Development

The web development landscape is constantly evolving. Let's look at what's coming next.

## Emerging Trends

1. **AI Integration**: AI-powered development tools and features
2. **WebAssembly**: Near-native performance in the browser
3. **Edge Computing**: Faster response times with edge functions
4. **Progressive Web Apps**: Bridging the gap between web and native

## New Technologies

- **Astro**: Content-focused framework
- **Remix**: Full-stack web framework
- **Solid.js**: Fine-grained reactivity

## Best Practices

- Focus on performance
- Prioritize accessibility
- Embrace modern CSS
- Use TypeScript

The future is bright for web developers!`,
    category: 'Technology',
    authorId: '3',
    authorName: 'Bob Johnson',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '6',
    title: 'CSS Grid vs Flexbox: When to Use Each',
    excerpt: 'Understanding the differences and use cases for CSS Grid and Flexbox.',
    content: `# CSS Grid vs Flexbox: When to Use Each

Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes.

## Flexbox

Best for **one-dimensional** layouts:

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Use Cases:**
- Navigation bars
- Card layouts
- Button groups

## CSS Grid

Perfect for **two-dimensional** layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

**Use Cases:**
- Page layouts
- Photo galleries
- Dashboard layouts

## Combining Both

You can use Grid and Flexbox together for maximum flexibility!

Choose the right tool for the job!`,
    category: 'CSS',
    authorId: '1',
    authorName: 'John Doe',
    createdAt: new Date('2024-12-22'),
    updatedAt: new Date('2024-12-22'),
  },
  {
    id: '7',
    title: 'Understanding JavaScript Closures',
    excerpt: 'A deep dive into one of JavaScript\'s most powerful features.',
    content: `# Understanding JavaScript Closures

Closures are a fundamental concept in JavaScript that every developer should master.

## What is a Closure?

A closure is a function that has access to variables in its outer scope, even after the outer function has returned.

\`\`\`javascript
function outer() {
  const message = 'Hello';
  
  function inner() {
    console.log(message);
  }
  
  return inner;
}

const myFunc = outer();
myFunc(); // Prints: Hello
\`\`\`

## Practical Uses

### Private Variables

\`\`\`javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
\`\`\`

### Event Handlers

Closures are commonly used in event handlers to maintain state.

Master closures to write better JavaScript!`,
    category: 'JavaScript',
    authorId: '2',
    authorName: 'Jane Smith',
    createdAt: new Date('2024-12-25'),
    updatedAt: new Date('2024-12-25'),
  },
  {
    id: '8',
    title: 'Optimizing React Performance',
    excerpt: 'Tips and techniques to make your React applications faster.',
    content: `# Optimizing React Performance

Performance optimization is crucial for creating smooth user experiences.

## Key Techniques

### 1. React.memo

Prevent unnecessary re-renders:

\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
\`\`\`

### 2. useMemo

Memoize expensive calculations:

\`\`\`jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`

### 3. useCallback

Memoize callback functions:

\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
\`\`\`

### 4. Code Splitting

Use dynamic imports:

\`\`\`jsx
const Component = lazy(() => import('./Component'));
\`\`\`

## Profiling

Use React DevTools Profiler to identify bottlenecks.

Optimize wisely and measure results!`,
    category: 'React',
    authorId: '3',
    authorName: 'Bob Johnson',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great article! Very helpful for beginners.',
    postId: '1',
    authorId: '2',
    authorName: 'Jane Smith',
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02'),
  },
  {
    id: '2',
    content: 'Thanks for sharing this. The code examples are clear and easy to follow.',
    postId: '1',
    authorId: '3',
    authorName: 'Bob Johnson',
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-03'),
  },
  {
    id: '3',
    content: 'I love TypeScript! This guide covers all the essentials.',
    postId: '2',
    authorId: '1',
    authorName: 'John Doe',
    createdAt: new Date('2024-12-06'),
    updatedAt: new Date('2024-12-06'),
  },
  {
    id: '4',
    content: 'Tailwind CSS has completely changed how I approach styling.',
    postId: '3',
    authorId: '2',
    authorName: 'Jane Smith',
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-11'),
  },
  {
    id: '5',
    content: 'Hooks are amazing! This is a great introduction.',
    postId: '4',
    authorId: '3',
    authorName: 'Bob Johnson',
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16'),
  },
];
