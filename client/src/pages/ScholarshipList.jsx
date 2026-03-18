import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import axios from 'axios';
import ScholarshipCard from '../components/ScholarshipCard';
import '../styles/Scholarships.css';

export default function ScholarshipList() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                // Determine API query params based on UI state
                let query = '?';
                if (search) query += `keyword=${search}&`;
                // Basic mapping since schema changed 
                if (filterType !== 'all') query += `type=${filterType}&`;

                const res = await axios.get(`http://localhost:3000/api/scholarships${query}`);
                setScholarships(res.data.data);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Failed to fetch scholarships. Please check if the server is running.');
            } finally {
                setLoading(false);
            }
        };

        // Adding a basic debounce for search (using timeout)
        const timeoutId = setTimeout(() => {
            fetchScholarships();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, filterType]);

    // The backend handles filtering via query params now.
    const filteredScholarships = scholarships;

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
                        <option value="low">Under ₹10,000</option>
                        <option value="mid">₹10,000 - ₹20,000</option>
                        <option value="high">₹20,000+</option>
                    </select>
                </div>
            </div>

            <div className="scholarship-grid">
                {loading ? (
                    <div className="flex justify-center items-center py-12 col-span-full">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500 col-span-full">
                        <p>{error}</p>
                    </div>
                ) : (
                    filteredScholarships.map((scholarship, index) => (
                        <ScholarshipCard key={scholarship._id || scholarship.title + index} scholarship={scholarship} />
                    ))
                )}
            </div>

            {!loading && !error && filteredScholarships.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p>No scholarships found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
