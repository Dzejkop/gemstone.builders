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
    return response.json();
};

const delete_call = async (endpoint) => {
    return fetch(url + endpoint, {
        method: "DELETE",
    });
}

const API = {
    get_board: async () => {
        return get("board");
    },
    submit: async (data) => {
        return post("board", data);
    },
    delete_board: async () => {
        return delete_call("board")
    },
    simulate: async (data) => {
        return post("simulate", data);
    },
    get_balance: async () => {
        return get("balance");
    }
}

export default API;
