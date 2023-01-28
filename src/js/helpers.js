// function: timeout function to terminate fetch or post request if it takes longer time than TIMEOUT_SEC...
/**
 * 
 * @param {number} s time in seconds
 * @returns {Promise} always returns a rejected promise
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// function: function for uploading or retrieving data from API...
/**
 * 
 * @param {String} url url of API 
 * @param {Object | undefined} [uploadData = undefined] data to be uploaded, if undefined then data will be fetched only
 * @returns {Promise} returns a promise
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    let res;
    if (!uploadData) res = await fetch(url);
    else
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function(url){
    try{
        const res = await fetch(
            // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
            url
            );
          const data = await res.json();
      
          if(!res.ok) {
            throw new Error(`${data.message} (${res.status})`);
          }
      
          return data;
    }
    catch(err){
        throw err;
    }
}

export const sendJSON = async function(url, uploadData){
    try{
      const res = await fetch(
          // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(uploadData),
          }
          );
        const data = await res.json();
    
        if(!res.ok) {
          throw new Error(`${data.message} (${res.status})`);
        }
    
        return data;
    }
    catch(err){
      throw err;
    }
}
*/
