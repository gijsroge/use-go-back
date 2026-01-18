# use-go-back

## 1.1.0

### Minor Changes

- b7c3452: Enhanced `targetPathname` matcher function to receive the full URL object instead of just the pathname string. This allows matching based on pathname, origin, search params, hash, and other URL properties.

## 1.0.0

### Initial Release

- Added `useGoBack` hook for navigating back to a specific route in browser history
- Supports Navigation API for preserving scroll position
- Flexible pathname matching (exact string or custom function)
- Graceful fallback when Navigation API is not available
- Full TypeScript support
- Comprehensive test suite
