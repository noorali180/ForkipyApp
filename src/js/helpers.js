export const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

export const AJAX = async function(url, uloadData){
  
}

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
