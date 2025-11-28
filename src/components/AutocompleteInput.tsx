import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface AutocompleteInputProps {
  label: string;
  suggestions: string[];
  selectedItems: string[];
  onItemAdd: (item: string) => void;
  onItemRemove: (item: string) => void;
  placeholder?: string;
}

export const AutocompleteInput = ({
  label,
  suggestions,
  selectedItems,
  onItemAdd,
  onItemRemove,
  placeholder = 'Start typing...'
}: AutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedItems.includes(item)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, selectedItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item: string) => {
    onItemAdd(item);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() && filteredSuggestions.length > 0) {
      e.preventDefault();
      handleSelectSuggestion(filteredSuggestions[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block">
        {label}
      </label>
      
      <div className="min-h-[100px] w-full rounded-md border border-input bg-background p-3">
        {/* Selected items */}
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedItems.map(item => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/10 text-xs font-mono"
              >
                {item}
                <button
                  onClick={() => onItemRemove(item)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(filteredSuggestions.length > 0)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-sm font-mono placeholder:text-muted-foreground"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map(item => (
            <button
              key={item}
              onClick={() => handleSelectSuggestion(item)}
              className="w-full text-left px-4 py-2 text-sm font-mono hover:bg-accent transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
