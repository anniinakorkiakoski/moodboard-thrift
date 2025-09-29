import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SearchResult {
  id: string;
  platform: string;
  item_url: string;
  title: string;
  price: number;
  currency: string;
  image_url: string | null;
  similarity_score: number;
  description: string;
}

export interface VisualSearch {
  id: string;
  image_url: string;
  status: 'pending' | 'analyzing' | 'searching' | 'completed' | 'no_matches';
  analysis_data: any;
  created_at: string;
}

export const useVisualSearch = () => {
  const [searches, setSearches] = useState<VisualSearch[]>([]);
  const [currentSearch, setCurrentSearch] = useState<VisualSearch | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startSearch = async (imageUrl: string) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Create search record
      const { data: search, error: searchError } = await supabase
        .from('visual_searches')
        .insert({
          user_id: user.user.id,
          image_url: imageUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (searchError) throw searchError;

      setCurrentSearch(search);

      // Call edge function to perform search
      const { data, error } = await supabase.functions.invoke('visual-search', {
        body: { imageUrl, searchId: search.id },
      });

      if (error) throw error;

      // Fetch updated search and results
      await fetchSearchResults(search.id);

      toast({
        title: data.status === 'no_matches' ? 'No matches found' : 'Search completed',
        description: data.status === 'no_matches' 
          ? 'Consider requesting a personal thrift service.' 
          : `Found ${data.resultsCount} curated matches`,
      });

      return search.id;
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (searchId: string) => {
    const { data: search } = await supabase
      .from('visual_searches')
      .select('*')
      .eq('id', searchId)
      .single();

    if (search) {
      setCurrentSearch(search);

      if (search.status === 'completed') {
        const { data: results } = await supabase
          .from('search_results')
          .select('*')
          .eq('search_id', searchId)
          .order('similarity_score', { ascending: false });

        if (results) setResults(results);
      }
    }
  };

  const fetchRecentSearches = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data } = await supabase
      .from('visual_searches')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setSearches(data);
  };

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  return {
    searches,
    currentSearch,
    results,
    loading,
    startSearch,
    fetchSearchResults,
  };
};