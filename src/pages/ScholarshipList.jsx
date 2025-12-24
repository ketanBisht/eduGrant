import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import '../styles/Scholarships.css';

export default function ScholarshipList() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Mock Data
    const scholarships = [
        {
            id: 1,
            title: 'Global Future Leaders Scholarship',
            provider: 'World Education Foundation',
            amount: '$10,000',
            deadline: 'Oct 30, 2024',
            categories: ['Merit-based', 'International'],
            isNew: true
        },
        {
            id: 2,
            title: 'Women in STEM Grant',
            provider: 'Tech Innovations Corp',
            amount: '$5,000',
            deadline: 'Nov 15, 2024',
            categories: ['Engineering', 'Women only'],
            isNew: false
        },
        {
            id: 3,
            title: 'Community Service Award',
            provider: 'Local Rotary Club',
            amount: '$2,500',
            deadline: 'Dec 01, 2024',
            categories: ['Community', 'Need-based'],
            isNew: false
        },
        {
            id: 4,
            title: 'Arts & Design Fellowship',
            provider: 'Creative Arts Alliance',
            amount: '$7,500',
            deadline: 'Nov 05, 2024',
            categories: ['Arts', 'Portfolio needed'],
            isNew: true
        },
        {
            id: 5,
            title: ' Undergraduate Access Fund',
            provider: 'EduGrant Official',
            amount: '$3,000',
            deadline: 'Dec 15, 2024',
            categories: ['Undergraduate', 'Need-based'],
            isNew: false
        },
        {
            id: 6,
            title: 'Postgrad Research Stipend',
            provider: 'National Research Council',
            amount: '$15,000',
            deadline: 'Jan 10, 2025',
            categories: ['Research', 'PhD'],
            isNew: false
        }
    ];

    const filteredScholarships = scholarships.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="scholarship-page">
            <div className="page-header">
                <div className="page-title">
                    <h2>Find Scholarships</h2>
                    <p>Discover financial aid opportunities tailored for you.</p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, provider, or keyword..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="merit">Merit-based</option>
                        <option value="need">Need-based</option>
                        <option value="international">International</option>
                    </select>
                </div>

                <div className="filter-group">
                    <select className="filter-select">
                        <option value="any">Any Amount</option>
                        <option value="low">Under $1,000</option>
                        <option value="mid">$1,000 - $5,000</option>
                        <option value="high">$5,000+</option>
                    </select>
                </div>
            </div>

            <div className="scholarship-grid">
                {filteredScholarships.map(scholarship => (
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
            </div>

            {filteredScholarships.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p>No scholarships found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
