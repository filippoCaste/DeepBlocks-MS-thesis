import URL from "./connection";

export let sessionId;

const getSession = async () => {

    try {
        const response = await fetch(URL + "/api/session", {
            method: "GET"
        });
        const data = await response.json();
        sessionId = data.sessionId
        console.log("Assigned session id: ", sessionId)
        return data;
    } catch (error) {

    }
};

const deleteSession = async () => {

    try {
        const response = await fetch(URL + "/api/session", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({sessionId}),
        });
        const data = await response.json();
        return data;
    } catch (error) {

    }
};

export const SESSION_API = {
    getSession,
    deleteSession
}
