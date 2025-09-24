const { default: axios } = require("axios");
const {
  getCachedLatestNews,
  fetchAndCacheLatestNews,
  getCachedSources,
  fetchAndCacheSources,
} = require("../utils/cache");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

// Fetch news of a particular language
const fetchNewsByLanguage = async (req, res) => {
  const { language = "en" } = req.params;
  const cacheKey = `latestNews:language:${language}`;
  const minArticleCount = 75;
  
  try {
    // Check Redis first
    const cachedData = await getCachedLatestNews(cacheKey);
    if (cachedData) {
      console.log(`Cache Hit: Returning cached News for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    } else {
      // Cache Miss: Fetch from DB with pagination to get at least 50 articles
      console.log(`Cache Miss: Fetching News for ${cacheKey} from DB`);
      
      let allArticles = [];
      let nextPageToken = null;
      let attempts = 0;
      const maxAttempts = 15; // Safeguard against infinite loops
      
      // Continue fetching until we have at least minArticleCount articles or run out of pages
      while (allArticles.length < minArticleCount && attempts < maxAttempts) {
        attempts++;
        
        const params = { language };
        if (nextPageToken) {
          params.page = nextPageToken;
        }
        
        const response = await axios.get(
          `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
          { params }
        );
        
        if (response.data.results && response.data.results.length > 0) {
          allArticles = [...allArticles, ...response.data.results];
        }
        
        // Check if there's another page available
        nextPageToken = response.data.nextPage;
        if (!nextPageToken) break;
      }
      
      // Create a response object with combined results
      const combinedResponse = {
        status: "success",
        totalResults: allArticles.length,
        results: allArticles,
        nextPage: nextPageToken // Include next page token in case frontend wants to fetch more
      };
      
      // Cache the combined data
      await fetchAndCacheLatestNews(cacheKey, combinedResponse);
      
      return res.status(200).json(combinedResponse);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Could Not Fetch News",
      error,
    });
  }
};

// Fetch all sources of a particular language
const fetchSources = async (req, res) => {
  const { language = "en" } = req.params;

  const cacheKey = `sources:${language}`;

  try {
    // Check Redis first
    const cachedData = await getCachedSources(cacheKey);

    if (cachedData) {
      console.log(`Cache Hit: Returning cached News for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));

    } else {
      //  Cache Miss: Fetch from DB
      console.log(`Cache Miss: Fetching News for ${cacheKey} from DB`);

      const response = await axios.get(
        `https://newsdata.io/api/1/sources?country=in&apikey=${API_KEY}`,
        {
          params: { language },
        }
      );

      // Cache the data
      await fetchAndCacheSources(cacheKey, response.data.results);

      return res.status(200).json(response.data.results);
    }
  } catch (error) {
    return res.json(error);
  }
};

// Fetch news containing a particular keyword -> 'SEARCH'
const searchParticularNews = async (req, res) => {
  const { searchWord } = req.query;
  const MIN_ARTICLES = 20;
  let allArticles = [];
  let nextPage = null;
  
  try {
    // Make the first request
    let response = await axios.get(
      `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
      {
        params: { 
          qInTitle: searchWord 
        },
      }
    );
    
    // Add articles from first request
    if (response.data.results) {
      allArticles = [...response.data.results];
    }
    
    // Get the nextPage token
    nextPage = response.data.nextPage;
    
    // Continue fetching until we have at least MIN_ARTICLES or no more pages
    while (nextPage && allArticles.length < MIN_ARTICLES) {
      // Make subsequent requests with the page parameter
      response = await axios.get(
        `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
        {
          params: { 
            qInTitle: searchWord,
            page: nextPage 
          },
        }
      );
      
      // Add more articles
      if (response.data.results) {
        allArticles = [...allArticles, ...response.data.results];
      }
      
      // Update nextPage for the next iteration
      nextPage = response.data.nextPage;
    }
    
    // Return the collected articles
    return res.json({
      ...response.data,
      results: allArticles,
      totalResults: allArticles.length
    });
    
  } catch (error) {
    return res.status(error.status || 500).json({
      message: "No Relevant News found or error fetching news.",
      error,
    });
  }
};

const getNextPageSearchData = async (req, res) => {
  const { page } = req.query;
  const { searchWord } = req.body;

  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
      {
        params: { qInTitle: searchWord, page },
      }
    );
    return res.json(response.data);
  } catch (error) {
    return res.json(error);
  }
};

// Get news of a particular domain -> 'SOURCE'
const getNewsOfParticularDomain = async (req, res) => {
  const domain = req.params.source;
  const MIN_ARTICLES = 50;
  const cacheKey = `latestNews:domain:${domain}`;

  try {
    // Check Redis first
    const cachedData = await getCachedLatestNews(cacheKey);

    if (cachedData) {
      console.log(`Cache Hit: Returning cached News for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    } else {
      // Cache Miss: Fetch from DB
      console.log(`Cache Miss: Fetching News for ${cacheKey} from DB`);
      
      let allArticles = [];
      let nextPage = null;
      let responseData = null;
      
      // Make the first request
      let response = await axios.get(
        `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
        { params: { domain } }
      );
      
      responseData = response.data;
      
      // Add articles from first request
      if (response.data.results) {
        allArticles = [...response.data.results];
      }
      
      // Get the nextPage token
      nextPage = response.data.nextPage;
      
      // Continue fetching until we have at least MIN_ARTICLES or no more pages
      while (nextPage && allArticles.length < MIN_ARTICLES) {
        // Make subsequent requests with the page parameter
        response = await axios.get(
          `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
          {
            params: { 
              domain,
              page: nextPage 
            },
          }
        );
        
        // Add more articles
        if (response.data.results) {
          allArticles = [...allArticles, ...response.data.results];
        }
        
        // Update nextPage for the next iteration
        nextPage = response.data.nextPage;
      }
      
      // Create the final response object with combined articles
      const finalResponse = {
        ...responseData,
        results: allArticles,
        totalResults: allArticles.length
      };
      
      // Cache the data with combined results
      await fetchAndCacheLatestNews(cacheKey, finalResponse);
      
      return res.status(200).json(finalResponse);
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      message: "Error fetching news for domain.",
      error,
    });
  }
};

const getNextPageDomainData = async (req, res) => {
  const { page } = req.query;
  const domain = req.params.source;

  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/latest?country=in&apikey=${API_KEY}`,
      {
        params: { domain, page },
      }
    );
    return res.json(response.data);
  } catch (error) {
    return res.json(error);
  }
};

module.exports = {
  fetchNewsByLanguage,
  fetchSources,
  searchParticularNews,
  getNextPageSearchData,
  getNewsOfParticularDomain,
  getNextPageDomainData,
};
