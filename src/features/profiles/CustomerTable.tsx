import React, { useState, useMemo } from 'react';
import type { Profile } from '../../types';
import { useProfileStore } from '../../stores/profileStore';
import { STAGES_METADATA } from '../../config/journeyConfig';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, UserRound, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import Fuse from 'fuse.js';

interface CustomerTableProps {
  onSelectClient: (client: Profile) => void;
}

interface SearchQueryObj {
  keywords: string[];
  filters: Record<string, string>;
}

// Parses queries like: city:"Pune" Software Engineer Vegetarian age > 28
function parseSearchQuery(query: string): SearchQueryObj {
  const keywords: string[] = [];
  const filters: Record<string, string> = {};

  // Regex to match key:value (e.g., city:Pune, profession:"Software Engineer")
  const filterRegex = /(\w+):(?:"([^"]*)"|(\S+))/g;
  let match;
  let cleanQuery = query;

  while ((match = filterRegex.exec(query)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2] || match[3];
    filters[key] = value.toLowerCase();
    cleanQuery = cleanQuery.replace(match[0], '');
  }

  // Parse remaining keywords
  const keywordRegex = /"([^"]*)"|(\S+)/g;
  while ((match = keywordRegex.exec(cleanQuery)) !== null) {
    const word = match[1] || match[2];
    if (word) {
      keywords.push(word.toLowerCase());
    }
  }

  return { keywords, filters };
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ onSelectClient }) => {
  const { profiles } = useProfileStore();
  const [searchVal, setSearchVal] = useState('');
  const debouncedSearch = useDebounce(searchVal, 150);
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'income' | 'completeness'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered and sorted profiles
  const processedProfiles = useMemo(() => {
    let result = [...profiles];

    // 1. Stage filter dropdown
    if (stageFilter !== 'All') {
      result = result.filter(p => p.stage === stageFilter);
    }

    // 2. Smart Search input
    if (debouncedSearch.trim()) {
      const { keywords, filters } = parseSearchQuery(debouncedSearch);

      // Pre-filter by key-value pairs
      result = result.filter((p) => {
        // Evaluate key-value filters
        if (filters.city && p.city.toLowerCase() !== filters.city) return false;
        if (filters.profession && !p.designation.toLowerCase().includes(filters.profession) && !p.company.toLowerCase().includes(filters.profession)) return false;
        if (filters.diet && p.diet.toLowerCase() !== filters.diet) return false;
        if (filters.religion && p.religion.toLowerCase() !== filters.religion) return false;
        
        // Evaluate age comparisons if typed, e.g. age>28 or age<35
        if (filters.age) {
          const matchNum = filters.age.match(/(?:>|<|=)?\s*(\d+)/);
          if (matchNum) {
            const targetAge = parseInt(matchNum[1], 10);
            if (filters.age.startsWith('>') && p.age <= targetAge) return false;
            if (filters.age.startsWith('<') && p.age >= targetAge) return false;
            if (!filters.age.startsWith('>') && !filters.age.startsWith('<') && p.age !== targetAge) return false;
          }
        }

        return true;
      });

      // Apply Fuse.js fuzzy matching on keywords
      if (keywords.length > 0) {
        const searchPattern = keywords.join(' ');
        const fuse = new Fuse(result, {
          keys: [
            { name: 'fullName', weight: 0.4 },
            { name: 'designation', weight: 0.2 },
            { name: 'company', weight: 0.1 },
            { name: 'city', weight: 0.1 },
            { name: 'religion', weight: 0.1 },
            { name: 'caste', weight: 0.1 },
            { name: 'diet', weight: 0.1 },
            { name: 'college', weight: 0.1 }
          ],
          threshold: 0.35
        });
        result = fuse.search(searchPattern).map(r => r.item);
      }
    }

    // 3. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'age') {
        comparison = a.age - b.age;
      } else if (sortBy === 'income') {
        comparison = a.income - b.income;
      } else if (sortBy === 'completeness') {
        comparison = a.profileCompleteness - b.profileCompleteness;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [profiles, debouncedSearch, stageFilter, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white border border-border rounded-card p-6 shadow-sm w-full flex flex-col gap-4">
      {/* Table Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Smart Search Bar */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder='Search (e.g. Pune engineer vegetarian or city:Pune)...'
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-background border border-border rounded-[14px] pl-10 pr-4 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-secondary/70"
          />
        </div>

        {/* Filters Panel */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-background border border-border px-2 py-1 rounded-interactive text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Stages</option>
              <option value="Verified">Verified</option>
              <option value="Consultation">Consultation</option>
              <option value="Matching">Matching</option>
              <option value="Meeting">Meeting</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table List */}
      <div className="overflow-x-auto w-full border border-border rounded-interactive">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-background-secondary border-b border-border text-text-secondary font-medium">
              <th className="py-3 px-4 font-medium cursor-pointer select-none hover:text-text-primary" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium cursor-pointer select-none hover:text-text-primary" onClick={() => handleSort('age')}>
                <div className="flex items-center gap-1">
                  <span>Age</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">City</th>
              <th className="py-3 px-4 font-medium">Marital Status</th>
              <th className="py-3 px-4 font-medium cursor-pointer select-none hover:text-text-primary" onClick={() => handleSort('income')}>
                <div className="flex items-center gap-1">
                  <span>Income (LPA)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium cursor-pointer select-none hover:text-text-primary" onClick={() => handleSort('completeness')}>
                <div className="flex items-center gap-1">
                  <span>Profile Completion</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {processedProfiles.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-text-secondary bg-white">
                  No customers matched your search query. Try modifying your filter keywords.
                </td>
              </tr>
            ) : (
              processedProfiles.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectClient(p)}
                  className="border-b border-border/50 hover:bg-background-secondary/30 transition-all duration-150 cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-text-primary flex items-center gap-3">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.fullName} className="w-7 h-7 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                        <UserRound className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <span className="group-hover:text-primary transition-colors">{p.fullName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-text-primary font-mono">{p.age}</td>
                  <td className="py-3.5 px-4 text-text-secondary">{p.city}</td>
                  <td className="py-3.5 px-4 text-text-secondary">{p.maritalStatus}</td>
                  <td className="py-3.5 px-4 text-text-primary font-mono">{p.income} LPA</td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] w-8">{p.profileCompleteness}%</span>
                      <div className="w-16 bg-zinc-100 h-1.5 rounded-full overflow-hidden border border-border">
                        <div
                          className="bg-accent h-full"
                          style={{ width: `${p.profileCompleteness}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${STAGES_METADATA[p.stage].color}`}>
                      {p.stage}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center text-[10px] text-text-secondary">
        <span>Showing {processedProfiles.length} of {profiles.length} clients</span>
        <span>ID Format: TDC-2026-XXX</span>
      </div>
    </div>
  );
};
