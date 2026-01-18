# use-go-back

A React hook that navigates back to a specific route in browser history using the Navigation API, preserving scroll position.

<img src="./docs/assets/demo.gif" alt="use-go-back demo" width="350" />

## Features

- 🎯 Navigate back to a specific pathname in history
- 📜 Preserves scroll position automatically (thanks to Navigation API)
- 🔍 Flexible pathname matching (exact string or custom function)
- 🔄 Graceful fallback when Navigation API is not available
- 📦 Zero dependencies (only React as peer dependency)
- 🎨 TypeScript support

## Installation

```bash
npm install use-go-back
# or
pnpm add use-go-back
# or
yarn add use-go-back
```

## Usage

### Basic Example

```tsx
import { useGoBack } from "use-go-back";

function MyComponent() {
  const goBack = useGoBack({ targetPathname: "/" });

  return <button onClick={goBack}>Go to Home</button>;
}
```

### With Custom Pathname Matcher

```tsx
import { useGoBack } from "use-go-back";

function SearchLayout() {
  // Go back to any search-related page
  const goBack = useGoBack({
    targetPathname: (pathname) => pathname.startsWith("/search"),
  });

  return <button onClick={goBack}>Back to Search</button>;
}
```

### With Fallback URL

```tsx
import { useGoBack } from "use-go-back";

function MyComponent() {
  const goBack = useGoBack({
    targetPathname: "/dashboard",
    fallbackUrl: "/dashboard", // Used if Navigation API is unavailable
  });

  return <button onClick={goBack}>Back to Dashboard</button>;
}
```

## API

### `useGoBack(options?)`

Returns a function that navigates back to the target route.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targetPathname` | `string \| ((pathname: string) => boolean)` | `"/"` | The target pathname to go back to. Can be an exact string match or a custom matcher function. |
| `fallbackUrl` | `string` | `undefined` | Fallback URL to navigate to if Navigation API is not available and no matching history entry is found. |

#### Returns

A function `() => void` that navigates back to the target route when called.

## How It Works

1. **Navigation API**: The hook uses the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) to access browser history entries.
2. **History Search**: It searches backwards through history to find the closest entry matching your target pathname.
3. **Scroll Preservation**: When using `window.history.go()`, the browser automatically restores the scroll position, which is perfect for nested routes.
4. **Fallback**: If the Navigation API is not available or no matching entry is found, it falls back to the provided `fallbackUrl` or uses `history.back()`.

## Browser Support

The hook works in all modern browsers. For browsers that don't support the Navigation API, it gracefully falls back to using `window.location.href` or `history.back()`.

## Development

This is a monorepo using pnpm workspaces. To develop:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Start dev mode (watch mode)
pnpm run dev
```

### Test Apps

There are test apps available to test the hook with different routers:

- `test-apps/react-router-esm` - React Router (ESM)
- `test-apps/tanstack-router` - TanStack Router

To run a test app:

```bash
cd test-apps/tanstack-router
pnpm dev
```

## License

MIT
