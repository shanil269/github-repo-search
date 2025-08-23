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
}
