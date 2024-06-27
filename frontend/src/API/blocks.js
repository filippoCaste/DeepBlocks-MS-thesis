import URL from "./connection";
import {sessionId} from "./session";

const postNetwork = async (blocks, edges, params) => {
    const network = {blocks, edges, params};
    // console.log(JSON.stringify({ network, sessionId }))
    try {
        const response = await fetch(URL + "/api/blocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({network, sessionId}),
        });
        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error) {
        // console.log(error.message)
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
        if(response.ok) {
            const resData = await response.json();
            return resData;
        } else {
            const message = await response.text();
            throw new Error(message);
        }
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
        if(response.ok) {
            const data = await response.blob();
            return data;
        } else {
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error) {
        console.log(error)
        throw new Error(error.message);
    }
}

const forwardBlock = async (blocks, edges, params) => {
    const network = { blocks, edges, params };
    try {
        const response = await fetch(URL + "/api/blocks/forward", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ network, sessionId }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const message = await response.text();
            throw new Error(message);
        }
    } catch (error) {
        console.log(error.message)
        throw new Error(error.message);
    }

}

export const BLOCKS_API = {
    postNetwork,
    postInputFiles,
    exportNetwork,
    forwardBlock,
}
