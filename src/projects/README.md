# Projects Directory

This directory is designed to house embedded project demos that will be showcased in the portfolio.

## Structure

Each project should be organized in its own subdirectory:

```
src/projects/
├── algorithm-visualizer/
│   ├── components/
│   └── index.tsx
├── data-structures/
│   ├── components/
│   └── index.tsx
└── game-engine/
    ├── components/
    └── index.tsx
```

## Integration

Projects are integrated into the main portfolio through the `ProjectsSection` component. Each embedded project should:

1. Export a main component from `index.tsx`
2. Be self-contained with minimal external dependencies
3. Follow the same design system (Tailwind CSS classes)
4. Be responsive and accessible
