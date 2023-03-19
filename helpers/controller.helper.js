/**
 * ============================================================================
 * * CONTROLLER HELPERS
 * ----------------------------------------------------------------------------
 * This are custom-defined methods used for eliminating repetitive blocks of
 * code in controller files
 * ============================================================================
 */

/**
 * This will return an internal server error (500) response.
 * Commonly called in catch promise to return error message
 *
 * @param {*} res - throw the response parameter here
 * @param {*} err - throw the error parameter here from catch() or set a custom error message
 * @returns
 */
exports.errResponse = (res, err) => {
    return res.status(500).send({
        error: true,
        message: `${err}`,
    })
}

/**
 * This will return an OK (200) response regardless if doesn't have data.
 *
 * @param {*} res - throw the response parameter here
 * @param {*} data - set the data object here
 * @param {*} withDataMsg - set a custom message here if has data
 * @param {*} nullDataMsg - set a custom message here if no data
 * @returns
 */
exports.dataResponse = (res, data, withDataMsg, nullDataMsg) => {
    // If no data return empty response
    // ? data.length === 0
    if (data == null)
        return res.send({
            error: false,
            data: [],
            message: nullDataMsg,
        })

    // else return response with data
    return res.send({
        error: false,
        data: data,
        message: withDataMsg,
    })
}

/**
 * This is used for empty data responses
 * This will return an OK (200) response with custom message.
 *
 * @param {*} res - throw the response parameter here
 * @param {*} message - set a custom message here for empty data
 * @returns
 */
exports.emptyDataResponse = (res, message) => {
    return res.send({
        error: false,
        message: message,
    })
}
