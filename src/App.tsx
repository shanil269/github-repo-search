interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

const GITHUB_API_BASE = 'https://api.github.com/search/repositories';
const ITEMS_PER_PAGE = 10;