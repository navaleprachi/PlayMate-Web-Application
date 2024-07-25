// Setting the success response
export const setResponse = (data, response) => {
    console.log(data,"response");
    response.status(200)
        .json(data);
}

// Handling the error response
export const setErrorResponse = (err, response) => {
    response.status(500)
        .json({
            code: "ServiceError",
            message: "Error occured while processing your request."
        })
}