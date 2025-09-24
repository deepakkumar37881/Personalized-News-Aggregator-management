const express = require("express");
const {
  fetchNewsByLanguage,
  fetchSources,
  searchParticularNews,
  getNextPageSearchData,
  getNewsOfParticularDomain,
  getNextPageDomainData,
} = require("../controllers/newsController");

const router = express.Router();

router.get("/lang/:language", fetchNewsByLanguage);
router.get("/sources/:language", fetchSources);
router.get("/search", searchParticularNews);
router.get("/next-search", getNextPageSearchData);
router.get("/:source", getNewsOfParticularDomain);
router.get("/next-page/:source", getNextPageDomainData);

module.exports = router;
