import { renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useGoBack } from "."

describe("useGoBack", () => {
	const mockHistoryGo = vi.fn()
	const mockHistoryBack = vi.fn()
	let locationHref = ""

	beforeEach(() => {
		// Mock window.history
		Object.defineProperty(window, "history", {
			value: {
				go: mockHistoryGo,
				back: mockHistoryBack,
			},
			writable: true,
		})

		// Mock window.location
		locationHref = ""
		Object.defineProperty(window, "location", {
			value: {
				get href() {
					return locationHref
				},
				set href(value: string) {
					locationHref = value
				},
			},
			writable: true,
		})

		// Clear mocks
		mockHistoryGo.mockClear()
		mockHistoryBack.mockClear()
		locationHref = ""
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("should return a function", () => {
		const { result } = renderHook(() => useGoBack())
		expect(typeof result.current).toBe("function")
	})

	it("should use fallback when Navigation API is not available and fallbackUrl is provided", () => {
		// Mock no Navigation API
		Object.defineProperty(window, "navigation", {
			value: undefined,
			writable: true,
		})

		const { result } = renderHook(() => useGoBack({ targetPathname: "/test", fallbackUrl: "/fallback" }))

		result.current()

		expect(mockHistoryGo).not.toHaveBeenCalled()
		expect(locationHref).toBe("/fallback")
	})

	it("should use history.back() when Navigation API is not available and no fallback", () => {
		// Mock no Navigation API
		Object.defineProperty(window, "navigation", {
			value: undefined,
			writable: true,
		})

		const { result } = renderHook(() => useGoBack({ targetPathname: (url) => url.pathname.startsWith("/test") }))

		result.current()

		expect(mockHistoryBack).toHaveBeenCalled()
	})

	it("should use Navigation API when available and find matching entry", () => {
		const mockEntries = [
			{ url: "https://example.com/", index: 0 },
			{ url: "https://example.com/page1", index: 1 },
			{ url: "https://example.com/page2", index: 2 },
		]

		const mockNavigation = {
			currentEntry: { index: 2 },
			entries: () => mockEntries,
		}

		Object.defineProperty(window, "navigation", {
			value: mockNavigation,
			writable: true,
		})

		const { result } = renderHook(() => useGoBack({ targetPathname: "/" }))

		result.current()

		expect(mockHistoryGo).toHaveBeenCalledWith(-2)
	})

	it("should handle custom pathname matcher function", () => {
		const mockEntries = [
			{ url: "https://example.com/search", index: 0 },
			{ url: "https://example.com/search/results", index: 1 },
			{ url: "https://example.com/search/results/123", index: 2 },
		]

		const mockNavigation = {
			currentEntry: { index: 2 },
			entries: () => mockEntries,
		}

		Object.defineProperty(window, "navigation", {
			value: mockNavigation,
			writable: true,
		})

		const { result } = renderHook(() =>
			useGoBack({
				targetPathname: (url) => url.pathname.startsWith("/search"),
			})
		)

		result.current()

		// Should go back to the closest matching entry (index 1)
		expect(mockHistoryGo).toHaveBeenCalledWith(-1)
	})

	it("should handle custom matcher with URL object (search params)", () => {
		const mockEntries = [
			{ url: "https://example.com/search?filter=active", index: 0 },
			{ url: "https://example.com/search/results", index: 1 },
			{ url: "https://example.com/search/results/123", index: 2 },
		]

		const mockNavigation = {
			currentEntry: { index: 2 },
			entries: () => mockEntries,
		}

		Object.defineProperty(window, "navigation", {
			value: mockNavigation,
			writable: true,
		})

		const { result } = renderHook(() =>
			useGoBack({
				targetPathname: (url) => url.searchParams.has("filter"),
			})
		)

		result.current()

		// Should go back to the closest matching entry (index 0)
		expect(mockHistoryGo).toHaveBeenCalledWith(-2)
	})

	it("should use fallback when Navigation API is available but no match found", () => {
		const mockEntries = [
			{ url: "https://example.com/other", index: 0 },
			{ url: "https://example.com/page1", index: 1 },
		]

		const mockNavigation = {
			currentEntry: { index: 1 },
			entries: () => mockEntries,
		}

		Object.defineProperty(window, "navigation", {
			value: mockNavigation,
			writable: true,
		})

		const { result } = renderHook(() => useGoBack({ targetPathname: "/target", fallbackUrl: "/fallback" }))

		result.current()

		expect(mockHistoryGo).not.toHaveBeenCalled()
		expect(locationHref).toBe("/fallback")
	})
})
