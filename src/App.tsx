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
}
