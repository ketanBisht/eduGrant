import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Loader2, Sparkles, Filter, X, ChevronDown, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import '../styles/Scholarships.css';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'createdAt', order: 'desc' },
    { label: 'Highest Amount', value: 'amount', order: 'desc' },
    { label: 'Deadline Soon', value: 'deadline', order: 'asc' },
    { label: 'Best Match', value: 'relevance', order: 'desc' },
];

const AMOUNT_RANGES = [
    { label: 'Any Amount', min: '', max: '' },
    { label: 'Under ₹10,000', min: '', max: '10000' },
    { label: '₹10K – ₹50K', min: '10000', max: '50000' },
    { label: '₹50K – ₹1L', min: '50000', max: '100000' },
    { label: 'Above ₹1 Lakh', min: '100000', max: '' },
];

const DEFAULT_FILTERS = {
    keyword: '',
    source: '',
    category: '',
    state: '',
    gender: '',
    amountRange: 0, // index into AMOUNT_RANGES
    sortBy: 'createdAt',
    sortOrder: 'desc',
};

export default function ScholarshipList() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const LIMIT = 12;

    const activeFilterCount = [
        filters.source, filters.category, filters.state, filters.gender
    ].filter(Boolean).length + (filters.amountRange !== 0 ? 1 : 0);

    const fetchScholarships = useCallback(async (currentPage = 1) => {
        try {
            setLoading(true);
            setError('');
            const range = AMOUNT_RANGES[filters.amountRange];
            const res = await axios.get('/api/scholarships', {
                params: {
                    keyword: filters.keyword || undefined,
                    source: filters.source || undefined,
                    category: filters.category || undefined,
                    state: filters.state || undefined,
                    gender: filters.gender || undefined,
                    minAmount: range.min || undefined,
                    maxAmount: range.max || undefined,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                    page: currentPage,
                    limit: LIMIT,
                }
            });
            setScholarships(res.data.data);
            setTotal(res.data.pagination.total);
            setTotalPages(res.data.pagination.pages);
            setPage(currentPage);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("The platform is currently synchronizing official data. Please refresh in a moment.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Debounce keyword, instant for other filters
    useEffect(() => {
        const delay = filters.keyword ? 450 : 0;
        const timer = setTimeout(() => fetchScholarships(1), delay);
        return () => clearTimeout(timer);
    }, [filters, fetchScholarships]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSort = (opt) => {
        setFilters(prev => ({ ...prev, sortBy: opt.value, sortOrder: opt.order }));
    };

    const clearAll = () => setFilters(DEFAULT_FILTERS);

    return (
        <div className="scholarship-page">
            {/* Hero */}
            <header className="hero-banner">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="page-title">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="text-secondary" size={24} />
                            <span className="text-secondary font-bold tracking-widest uppercase text-xs">Official Portal 2025</span>
                        </div>
                        <h2>Discovery Hub</h2>
                        <p>Verified government schemes, CSR grants, and private foundation awards in one secure vault.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-4xl font-black text-primary">{total.toLocaleString()}</div>
                        <div className="text-text-muted text-sm font-bold uppercase tracking-widest">Scholarships Found</div>
                    </div>
                </div>
            </header>

            {/* Search + Sort Bar */}
            <div className="filters-bar mb-4">
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        id="scholarship-search"
                        placeholder="Search schemes, grants, or providers..."
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 pr-2 shrink-0">
                    <ArrowUpDown className="text-text-muted" size={16} />
                    <select
                        id="sort-select"
                        className="filter-select"
                        value={filters.sortBy}
                        onChange={(e) => {
                            const opt = SORT_OPTIONS.find(o => o.value === e.target.value);
                            if (opt) handleSort(opt);
                        }}
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Filter Toggle */}
                <button
                    id="filter-toggle-btn"
                    type="button"
                    onClick={() => setShowFilters(prev => !prev)}
                    className="filter-select flex items-center gap-2 shrink-0"
                    style={{ background: activeFilterCount > 0 ? 'rgba(16,185,129,0.15)' : undefined, borderColor: activeFilterCount > 0 ? 'var(--primary)' : undefined, color: activeFilterCount > 0 ? 'var(--primary)' : 'white' }}
                >
                    <SlidersHorizontal size={16} />
                    Filters
                    {activeFilterCount > 0 && (
                        <span style={{ background: 'var(--primary)', color: 'var(--bg-main)', borderRadius: '100px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 900 }}>
                            {activeFilterCount}
                        </span>
                    )}
                    <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
            </div>

            {/* Expanded Filter Panel */}
            {showFilters && (
                <div className="glass-card p-8 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                    {/* Source */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Source</label>
                        <select id="source-filter" className="filter-select w-full" value={filters.source} onChange={e => handleFilterChange('source', e.target.value)}>
                            <option value="">All Sources</option>
                            <option value="GOVERNMENT">Govt / NSP</option>
                            <option value="CORPORATE_CSR">Corporate / CSR</option>
                        </select>
                    </div>

                    {/* Caste / Category */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Caste / Category</label>
                        <select id="category-filter" className="filter-select w-full" value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                        </select>
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Domicile State</label>
                        <select id="state-filter" className="filter-select w-full" value={filters.state} onChange={e => handleFilterChange('state', e.target.value)}>
                            <option value="">All States</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Gender</label>
                        <select id="gender-filter" className="filter-select w-full" value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)}>
                            <option value="">Any Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>

                    {/* Amount Range */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Award Amount</label>
                        <select id="amount-filter" className="filter-select w-full" value={filters.amountRange} onChange={e => handleFilterChange('amountRange', parseInt(e.target.value))}>
                            {AMOUNT_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                        </select>
                    </div>

                    {/* Clear */}
                    {activeFilterCount > 0 && (
                        <button
                            id="clear-filters-btn"
                            type="button"
                            onClick={clearAll}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm transition-colors"
                        >
                            <X size={16} /> Clear All Filters
                        </button>
                    )}
                </div>
            )}

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {filters.source && <FilterChip label={filters.source.replace('_', ' ')} onRemove={() => handleFilterChange('source', '')} />}
                    {filters.category && <FilterChip label={`Caste: ${filters.category}`} onRemove={() => handleFilterChange('category', '')} />}
                    {filters.state && <FilterChip label={filters.state} onRemove={() => handleFilterChange('state', '')} />}
                    {filters.gender && <FilterChip label={filters.gender} onRemove={() => handleFilterChange('gender', '')} />}
                    {filters.amountRange !== 0 && <FilterChip label={AMOUNT_RANGES[filters.amountRange].label} onRemove={() => handleFilterChange('amountRange', 0)} />}
                </div>
            )}

            {/* Grid */}
            <main className="scholarship-grid">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24 col-span-full gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p className="text-text-muted font-medium">Syncing with official servers...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-24 text-red-400 col-span-full glass-card border-red-500/20 p-8">
                        <p className="text-lg font-bold">{error}</p>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="empty-state py-24 col-span-full">
                        <div className="empty-icon text-6xl mb-6">🔭</div>
                        <h3>No Schemes Found</h3>
                        <p>Try adjusting your filters or expanding your search criteria.</p>
                        {activeFilterCount > 0 && (
                            <button onClick={clearAll} className="mt-6 apply-btn max-w-[200px] mx-auto">
                                <X size={16} /> <span>Clear Filters</span>
                            </button>
                        )}
                    </div>
                ) : (
                    scholarships.map((scholarship) => (
                        <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                    ))
                )}
            </main>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                    <button
                        id="prev-page-btn"
                        disabled={page === 1}
                        onClick={() => fetchScholarships(page - 1)}
                        className="filter-select disabled:opacity-40"
                    >
                        ← Prev
                    </button>
                    <span className="text-text-muted font-bold">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        id="next-page-btn"
                        disabled={page === totalPages}
                        onClick={() => fetchScholarships(page + 1)}
                        className="filter-select disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/30 bg-primary/10">
            {label}
            <button type="button" onClick={onRemove} className="hover:text-white transition-colors">
                <X size={12} />
            </button>
        </span>
    );
}
