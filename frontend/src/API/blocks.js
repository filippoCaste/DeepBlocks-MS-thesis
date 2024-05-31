import URL from "./connection";
import {sessionId} from "./session";

const postNetwork = async (blocks, edges, params) => {
    const network = {blocks, edges, params};
    console.log(JSON.stringify({ network, sessionId }))
    try {
        const response = await fetch(URL + "/api/blocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({network, sessionId}),
        });
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error)
        throw new Error(error.message);
    }
};

const postInputFiles = async (files) => {
    const data = new FormData();
    data.append('sessionId', sessionId);

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
        console.log(error)
        throw new Error(error.message);
    }
}

const exportNetwork = async (blocks, edges, params, type, appName) => {
    const network = { blocks, edges, params };

    // check type
    if(type !== 'onnx' && type !== 'pth') {
        return {'message':'Export type not available'}
    }
    try {
        const response = await fetch (URL+`/api/blocks/export`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({network, type, appName, sessionId}),
        });

        const data = await response.blob();
        return data;
    } catch(error) {
        console.log(error)
        throw new Error(error.message);
    }
} 

export const BLOCKS_API = {
    postNetwork,
    postInputFiles,
    exportNetwork,
}
