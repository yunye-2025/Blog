(function (global) {
  const cacheKey = "umami-share-cache";
  const cacheTTL = 3600_000;

  async function fetchShareData(baseUrl, shareId) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheTTL) {
          return parsed.value;
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    const res = await fetch(`${baseUrl}/api/share/${shareId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch Umami share data");
    }
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), value: data }));
    return data;
  }

  global.getUmamiShareData = function (baseUrl, shareId) {
    if (!global.__umamiSharePromise) {
      global.__umamiSharePromise = fetchShareData(baseUrl, shareId).catch((err) => {
        delete global.__umamiSharePromise;
        throw err;
      });
    }
    return global.__umamiSharePromise;
  };

  global.clearUmamiShareCache = function () {
    localStorage.removeItem(cacheKey);
    delete global.__umamiSharePromise;
  };

  global.fetchUmamiStats = async function (baseUrl, shareId, queryParams) {
    async function doFetch(isRetry = false) {
      const { websiteId, token } = await global.getUmamiShareData(baseUrl, shareId);
      const currentTimestamp = Date.now();
      const params = new URLSearchParams({
        startAt: 0,
        endAt: currentTimestamp,
        unit: "hour",
        timezone: queryParams.timezone || "Asia/Shanghai",
        compare: false,
        ...queryParams,
      });

      const statsUrl = `${baseUrl}/api/websites/${websiteId}/stats?${params.toString()}`;
      const res = await fetch(statsUrl, {
        headers: {
          "x-umami-share-token": token,
        },
      });

      if (!res.ok) {
        if (res.status === 401 && !isRetry) {
          global.clearUmamiShareCache();
          return doFetch(true);
        }
        throw new Error("Failed to fetch Umami stats");
      }

      return await res.json();
    }

    return doFetch();
  };
})(window);
