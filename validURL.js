function isValidUrl(url) {
  try {
    // Try to parse the URL
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = isValidUrl;
