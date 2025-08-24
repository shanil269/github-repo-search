import React, { useState, useEffect } from "react"
import {
    Search,
    Star,
    GitFork,
    Eye,
    Calendar,
    User,
    ExternalLink,
} from "lucide-react"

interface Repository {
    id: number
    name: string
    full_name: string
    description: string | null
    html_url: string
    stargazers_count: number
    forks_count: number
    watchers_count: number
    language: string | null
    updated_at: string
    owner: {
        login: string
        avatar_url: string
        html_url: string
    }
}

interface SearchResponse {
    total_count: number
    incomplete_results: boolean
    items: Repository[]
}

const GITHUB_API_BASE = "https://api.github.com/search/repositories"
const ITEMS_PER_PAGE = 10

export default function GitHubRepoSearch() {
    const [query, setQuery] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    const searchRepositories = async (page: number = 1) => {
        if (!searchTerm.trim()) return

        setLoading(true)
        setError("")

        try {
            const params = new URLSearchParams({
                q: searchTerm,
                sort: "stars",
                order: "desc",
                page: page.toString(),
                per_page: ITEMS_PER_PAGE.toString(),
            })

            const response = await fetch(`${GITHUB_API_BASE}?${params}`)

            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} ${response.statusText}`
                )
            }

            const data: SearchResponse = await response.json()
            setRepositories(data.items)
            setTotalCount(data.total_count)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            setRepositories([])
            setTotalCount(0)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e?: any) => {
        if (e && e.preventDefault) e.preventDefault()
        setSearchTerm(query)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        if (searchTerm) {
            searchRepositories(currentPage)
        }
    }, [searchTerm, currentPage])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M"
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "k"
        }
        return num.toString()
    }

    const truncateDescription = (
        description: string,
        maxWords: number = 50
    ) => {
        const words = description.split(" ")
        if (words.length <= maxWords) {
            return description
        }
        return words.slice(0, maxWords).join(" ") + "..."
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null

        const pages = []
        const maxVisiblePages = 5
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        )
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 mx-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
        )

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 mx-1 border rounded-md ${
                        i === currentPage
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {i}
                </button>
            )
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 mx-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        )

        return (
            <div className="flex justify-center items-center mt-8">{pages}</div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        GitHub Repository Search
                    </h1>
                    <p className="text-gray-600">
                        Discover amazing repositories on GitHub
                    </p>
                </header>

                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch(e)
                                }
                                placeholder="Search repositories... (e.g., react, javascript, machine learning)"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {searchTerm && (
                    <div className="mb-6 text-gray-600">
                        {totalCount > 0 ? (
                            <>
                                Found {formatNumber(totalCount)} repositories
                                for "{searchTerm}"
                                {totalCount > 1000 && " (showing first 1000)"}
                            </>
                        ) : (
                            `No repositories found for "${searchTerm}"`
                        )}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">
                            Searching repositories...
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {repositories.map((repo) => (
                        <div
                            key={repo.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={repo.owner.avatar_url}
                                            alt={repo.owner.login}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4" />
                                            <a
                                                href={repo.owner.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-600"
                                            >
                                                {repo.owner.login}
                                            </a>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-semibold mb-2">
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                        >
                                            {repo.name}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </h2>

                                    {repo.description && (
                                        <p className="text-gray-700 mb-3">
                                            {truncateDescription(
                                                repo.description
                                            )}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        {repo.language && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                                <span>{repo.language}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                Updated{" "}
                                                {formatDate(repo.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-4 lg:gap-2 lg:items-end">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="font-medium">
                                            {formatNumber(
                                                repo.stargazers_count
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <GitFork className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">
                                            {formatNumber(repo.forks_count)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">
                                            {formatNumber(repo.watchers_count)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {renderPagination()}

                {repositories.length === 0 &&
                    !loading &&
                    searchTerm &&
                    !error && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">
                                No repositories found for your search.
                            </p>
                            <p className="text-gray-500 text-sm">
                                Try different keywords or check your spelling.
                            </p>
                        </div>
                    )}
            </div>
        </div>
    )
}
