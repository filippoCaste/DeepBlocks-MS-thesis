import URL from "./connection";

const postNetwork = async (blocks, edges, params) => {
    const network = {blocks, edges, params};

    try {
        const response = await fetch(URL + "/api/blocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(network),
        });
        const data = await response.json();
        return data;
    } catch(error) {

    }
};

const postInputFiles = async (files) => {
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
        data.append(`files`, files[i]);
    }
    try {
        const response = await fetch(URL + "/api/blocks/input", {
            method: "POST",
            body: data
        });
        const resData = await response.json();
        return resData;
    } catch(error) {
        return error;
    }
}   

const exportNetwork = async (type) => {
    // check type
    if(type !== 'onnx' || type !== 'pytorch') {
        return {'message':'Export type not available'}
    }
    try {
        const response = await fetch (URL+`/api/blocks/?type=${type}`, {
            method: "GET"
        });

        const data = await response.json();
        return data;
    } catch(error) {
        return error;
    }
} 

export const BLOCKS_API = {
    postNetwork,
    postInputFiles,
    exportNetwork,
}
