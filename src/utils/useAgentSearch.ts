import { useState, useEffect } from 'react';

export interface AgentIndexEntry {
  title: string;
  description: string;
  route: string;
  lang: string;
}

export function useAgentSearch() {
  const [index, setIndex] = useState<AgentIndexEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchIndex = async () => {
      setLoading(true);
      try {
        const response = await fetch('/agent-index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch agent index');
        }
        const data = await response.json();
        setIndex(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchIndex();
  }, []);

  const search = (query: string, langFilter?: string) => {
    if (!query) return index;
    
    const lowerQuery = query.toLowerCase();
    return index.filter(entry => {
      const matchesQuery = entry.title.toLowerCase().includes(lowerQuery) || 
                           entry.description.toLowerCase().includes(lowerQuery);
      
      const matchesLang = langFilter ? entry.lang === langFilter : true;
      
      return matchesQuery && matchesLang;
    });
  };

  return { index, search, loading, error };
}
