const url = "http://localhost:3123/";

const get = async (endpoint) => {
    const response = await fetch(url + endpoint);
    return response.json();
};

const post = async (endpoint, data) => {
    const response = await fetch(url + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    try {
        const r = await response.json();
        return r;
    } catch (e) {
        return;
    }
};

const deleteCall = async (endpoint) => {
    return fetch(url + endpoint, {
        method: "DELETE",
    });
}

const API = {
    getBoard: async () => {
        return get("board");
    },
    submitBoard: async (data) => {
        return post("board", data);
    },
    deleteBoard: async () => {
        return deleteCall("board")
    },
    simulate: async (data) => {
        return post("simulate", data);
    },
    getBalance: async () => {
        return get("balance");
    }
}

export default API;
