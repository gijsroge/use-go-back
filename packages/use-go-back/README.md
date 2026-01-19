# use-go-back

> ⚠️ **This package is deprecated.** Please use [go-back-to](https://github.com/gijsroge/go-back-to) instead, which provides the same functionality as a framework-agnostic utility function.

A React hook that navigates back to a specific route in browser history using the Navigation API, preserving scroll position.

## Features

- 🎯 Navigate back to a specific pathname in history
- 📜 Preserves scroll position automatically (thanks to Navigation API)
- 🔍 Flexible pathname matching (exact string or custom function)
- 🔄 Graceful fallback when Navigation API is not available
- 📦 Zero dependencies (only React as peer dependency)
- 🎨 TypeScript support
- ⚛️ Works with any React framework (uses native browser Navigation API)

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

1. **Navigation API**: The hook uses the native browser [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) to access browser history entries. Because it relies on the browser's native API rather than framework-specific routing, it works with any React framework (React Router, Next.js, Remix, TanStack Router, etc.).
2. **History Search**: It searches backwards through history to find the closest entry matching your target pathname.
3. **Scroll Preservation**: When using `window.history.go()`, the browser automatically restores the scroll position, which is perfect for nested routes.
4. **Fallback**: If the Navigation API is not available or no matching entry is found, it falls back to the provided `fallbackUrl` or uses `history.back()`.

## Browser Support

The hook works in all modern browsers. For browsers that don't support the Navigation API, it gracefully falls back to using `window.location.href` or `history.back()`.

## License

MIT
