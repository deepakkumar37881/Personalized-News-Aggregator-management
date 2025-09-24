const {
  latestNewsBloomFilter,
  sourcesBloomFilter,
  redisClient,
} = require("../config/redisConfig");

async function fetchAndCacheSources(cacheKey, sourcesData) {
  // Cache the analytics data in Redis for 30 minutes
  await redisClient.setEx(cacheKey, 1800, JSON.stringify(sourcesData));
  // Add department to Bloom Filter
  sourcesBloomFilter.add(cacheKey);
  console.log(`Sources cached for ${cacheKey}`);
}

async function getCachedSources(cacheKey) {
  // **Bloom Filter Check**
  if (sourcesBloomFilter.has(cacheKey)) {
    console.log(`Bloom Filter: Checking Redis cache for ${cacheKey}`);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
}

async function fetchAndCacheLatestNews(cacheKey, newsData) {
  // Cache the analytics data in Redis for 30 minutes
  await redisClient.setEx(cacheKey, 1800, JSON.stringify(newsData));
  // Add department to Bloom Filter
  latestNewsBloomFilter.add(cacheKey);
  console.log(`Latest News cached for ${cacheKey}`);
}

async function getCachedLatestNews(cacheKey) {
  // **Bloom Filter Check**
  if (latestNewsBloomFilter.has(cacheKey)) {
    console.log(`Bloom Filter: Checking Redis cache for ${cacheKey}`);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
}

module.exports = {
  fetchAndCacheSources,
  getCachedSources,
  fetchAndCacheLatestNews,
  getCachedLatestNews,
};
