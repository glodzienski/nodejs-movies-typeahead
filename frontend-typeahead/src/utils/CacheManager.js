class CacheManager {
    static get(key) {
        const cacheData = JSON.parse(localStorage.getItem(key));
        if (cacheData && cacheData.timestamp > Date.now()) {
            return cacheData.data;
        }
        return null;
    }

    static store(key, data, durationInMinutes) {
        const timestamp = Date.now() + durationInMinutes * 60 * 1000;
        const cacheData = { data, timestamp };
        localStorage.setItem(key, JSON.stringify(cacheData));
    }
}

export default CacheManager;