/**
 * Sender et succesrespons til klienten.
 *
 * @param {Object} res - Express response-objektet, som bruges til at sende svaret tilbage.
 * @param {any} data - De data, der skal sendes som svar (f.eks. en liste af byer eller en enkelt by).
 * @param {string} [message="Success"] - En valgfri besked, der beskriver svaret (default er "Success").
 * @param {number} [statusCode=200] - HTTP-statuskode for svaret (default er 200 OK).
 */
export const successResponse = (res, data, message = "Success", statusCode = 200) => {
    const response = { message };
    // Inkluder data, hvis den er "true"
    if (data) { 
        response.data = data;
    }

    res.status(statusCode).json(response);
};

/**
 * Sender et fejlrespons til klienten.
 *
 * @param {Object} res - Express response-objektet, som bruges til at sende svaret tilbage.
 * @param {string} [message="Internal Server Error"] - En valgfri fejlbesked, der beskriver fejlen (default er "Internal Server Error").
 * @param {number} [statusCode=500] - HTTP-statuskode for fejlen (default er 500 Internal Server Error).
 */
export const errorResponse = (res, message = "Internal Server Error", error = {}, statusCode = 500) => {    
    let obj_error = { message: message }

    //console.error(error.name)

    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        obj_error.sequlize_validation_errors = error.errors.map(err => ({
            field: err.path,
            message: err.message
        }));
    }

    res.status(statusCode).json(obj_error);
};