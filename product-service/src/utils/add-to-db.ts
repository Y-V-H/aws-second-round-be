export const addToDb = async (dynamoDB, params) => {
    return new Promise(function (resolve, reject) {
        dynamoDB.batchWriteItem(params, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    })
}