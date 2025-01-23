export const getAttributes = (req, default_attr) => {
    const attributes = req.query.attributes ?
        req.query.attributes :
        default_attr
    return attributes.split(',').map(str => str.trim())
}

export const getSortKey = (req, default_key) => {    
    const sort_key = req.query.sort_key ? 
        req.query.sort_key :
        default_key
    const arr_sort_keys = [req.query.sort_key || default_key]
    return arr_sort_keys;
}

export const getLimit = req => {    
    return Number(req.query.limit) || 1000000000000000;
}