// Base URL for the API
const baseUrl = 'http://localhost:3000';

/**
 * Makes a POST request to the specified path with the provided data.
 * @param path - The path for the POST request.
 * @param data - The data to be sent in the request body.
 * @returns Promise containing the result of the POST request.
 */
export const post = async <T>(path: string, data: any): Promise<T> => {
    // Make a POST request using the fetch API
    const response = await fetch(baseUrl + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Parse and return the JSON response
    const result: T = await response.json();
    return result;
}

/**
 * Makes a POST request to the specified path with the provided data and authorization header.
 * @param path - The path for the POST request.
 * @param data - The data to be sent in the request body.
 * @param accessToken - The access token for authorization.
 * @returns Promise containing the result of the POST request.
 */
export const logoutPost = async <T>(path: string, data: any, accessToken: string): Promise<T> => {
    // Make a POST request with authorization header
    const response = await fetch(baseUrl + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
    });

    // Parse and return the JSON response
    const result: T = await response.json();
    return result;
}

/**
 * Makes a GET request to the specified path.
 * @param path - The path for the GET request.
 * @returns Promise containing the result of the GET request.
 */
export const get = async <T>(path: string): Promise<T> => {
    // Make a GET request using the fetch API
    const response = await fetch(baseUrl + path, {
        method: 'GET',
    });

    // Parse and return the JSON response
    const result: T = await response.json();
    return result;
}

/**
 * Makes a DELETE request to the specified path.
 * @param path - The path for the DELETE request.
 * @returns Promise containing the result of the DELETE request.
 */
export const deleteRequest = async <T>(path: string): Promise<T> => {
    // Make a DELETE request using the fetch API
    const response = await fetch(baseUrl + path, {
        method: 'DELETE',
    });

    // Parse and return the JSON response
    const result: T = await response.json();
    return result;
}

/**
 * Makes a PUT request to the specified path with the provided data.
 * @param path - The path for the PUT request.
 * @param data - The data to be sent in the request body.
 * @returns Promise containing the result of the PUT request.
 */
export const update = async <T>(path: string, data: any): Promise<T> => {
    // Make a PUT request using the fetch API
    const response = await fetch(baseUrl + path, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Parse and return the JSON response
    const result: T = await response.json();
    return result;
}