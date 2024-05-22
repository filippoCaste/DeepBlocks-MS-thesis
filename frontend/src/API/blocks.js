import URL from "./connection";

const postNetwork = async (blocks, edges, parameters) => {
    const network = {blocks, edges, parameters};
    const response = await fetch(URL + "/api/blocks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(network),
    });
    const data = await response.json();
    return data;
};

export const BLOCKS_API = {
    postNetwork
}
