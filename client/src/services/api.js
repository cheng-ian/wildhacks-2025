const API_BASE_URL = 'http://localhost:5000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const apiService = {
    // Generate recipe
    generateRecipe: async (query) => {
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        return handleResponse(response);
    },

    // Add a new user
    addUser: async (uid, name) => {
        const response = await fetch(`${API_BASE_URL}/add_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, name }),
        });
        return handleResponse(response);
    },

    // Add a produce listing
    addListing: async (uid, location, time, produceItems) => {
        const response = await fetch(`${API_BASE_URL}/add_listing/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location, time, produce_items: produceItems }),
        });
        return handleResponse(response);
    },

    // Get user details
    getUser: async (uid) => {
        const response = await fetch(`${API_BASE_URL}/user/${uid}`);
        return handleResponse(response);
    },

    // Query produce listings
    queryProduce: async (produce, zip, lat, lon, limit = 20) => {
        const params = new URLSearchParams();
        if (produce) params.append('produce', produce);
        if (zip) params.append('zip', zip);
        if (lat) params.append('lat', lat);
        if (lon) params.append('lon', lon);
        params.append('limit', limit);

        const response = await fetch(`${API_BASE_URL}/query_produce?${params}`);
        return handleResponse(response);
    },

    // Get most sold products
    getMostSoldProducts: async (limit = 10) => {
        const response = await fetch(`${API_BASE_URL}/most_sold_products?limit=${limit}`);
        return handleResponse(response);
    },
}; 