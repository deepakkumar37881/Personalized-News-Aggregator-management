import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

const LatestNews = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const [dateFilter, setDateFilter] = useState("");
  const [articles, setArticles] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]); 
  const [totalPages, setTotalPages] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);

      try {
        // Only filter by language on the backend
        const url = `${API_URL}/news/lang/${language}`;
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllArticles(response.data.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [language]); // Only re-fetch when language changes

  // Apply date filtering in frontend
  useEffect(() => {
    if (allArticles.length === 0) return;
    
    let filtered = [...allArticles];
    
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(article => {
            const pubDate = new Date(article.pubDate);
            return pubDate >= today;
          });
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          filtered = filtered.filter(article => {
            const pubDate = new Date(article.pubDate);
            return pubDate >= yesterday && pubDate < today;
          });
          break;
        case 'last7days':
          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);
          filtered = filtered.filter(article => {
            const pubDate = new Date(article.pubDate);
            return pubDate >= last7Days;
          });
          break;
        case 'last30days':
          const last30Days = new Date(today);
          last30Days.setDate(last30Days.getDate() - 30);
          filtered = filtered.filter(article => {
            const pubDate = new Date(article.pubDate);
            return pubDate >= last30Days;
          });
          break;
        default:
          // No filter or unrecognized filter
          break;
      }
    }
    
    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allArticles, dateFilter]);

  // Update articles based on filteredArticles and pagination
  useEffect(() => {
    // Calculate pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    
    // Update articles state
    setArticles(currentArticles);
    
    // Update pagination numbers
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    setTotalPages(totalPages);
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    setPageNumbers(pageNumbers);
  }, [filteredArticles, currentPage, articlesPerPage]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/news/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { searchWord: searchTerm.trim().toLowerCase(), date: dateFilter, language },
      });
      setFilteredArticles(response.data.results); // Update filteredArticles instead of articles directly
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setSearchTerm("");
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700 text-lg font-semibold animate-pulse">
          Loading news articles...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
      </div>
    );

    return (
      <>
        <Sidebar />
        <Navbar/>
        <div className="min-h-screen bg-gray-50 p-10 text-gray-800">
          <div className="max-w-7xl mx-auto">
            
            {/* Search & Filters */}
            <div className="flex flex-col w-full md:flex-row items-end gap-4 mb-6">
              <form onSubmit={handleSearch} className="relative w-full md:w-2/3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full bg-white border border-gray-300 py-3 px-5 pl-12 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Search news..."
                />
                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition">
                  Search
                </button>
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  🔍
                </span>
              </form>
              
              {/* Filters */}
              <div className="flex gap-6">
                <select
                  id="language-filter"
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-white text-gray-700 p-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="ml">Malayalam</option>
                  <option value="kn">Kannada</option>
                  <option value="pa">Punjabi</option>
                  <option value="bn">Bengali</option>
                  <option value="gu">Gujarati</option>
                </select>
                <select
                  id="date-filter"
                  value={dateFilter}
                  onChange={handleDateChange}
                  className="bg-white text-gray-700 p-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                </select>
              </div>
            </div>
            <h2 className="text-gray-800 text-3xl mt-6 mb-8 font-bold tracking-tight text-center">
              Latest News
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  No articles available for your search or selected filters.
                </p>
              )}
            </div>
          </div>
          
          {/* Pagination Controls */}
          {filteredArticles.length > articlesPerPage && (
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`mx-1 px-3 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer border border-gray-300"
                  }`}
                >
                  Previous
                </button>
                
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`mx-1 px-4 py-2 rounded-md cursor-pointer ${
                      currentPage === number
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`mx-1 px-3 py-2 rounded-md ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer border border-gray-300"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  
};

export default LatestNews;