/**
 * Henter attributter fra forespørgsel eller standard
 * @param {Object} query req.query objekt
 * @param {string} default_attr defaulkt attributes
 * @returns {Array} En liste af attributter
 */
export const getQueryAttributes = (query, default_attr) => {
    const { attributes } = query
    const valid_attr = attributes ? attributes : default_attr
    return valid_attr.split(',').map(str => str.trim())
}

/**
 * Henter sorteringsparametre fra forespørgsel eller standard
 * @param {Object} query req.query objekt
 * @returns {Array} Et array i Sequelize's order-format [['column', 'direction']].
 */
export const getQueryOrder = query => {
    const { order_key = 'id', order_dir = 'ASC' } = query;
    return [[order_key, order_dir]];
}

/**
 * Henter grænseværdi (limit) fra forespørgsel eller standard (1000)
 * @param {Object} req.query object
 * @returns {number} En numerisk grænseværdi
 */
export const getQueryLimit = query => {
    const { limit } = query
    return Number(limit) || 1000
}