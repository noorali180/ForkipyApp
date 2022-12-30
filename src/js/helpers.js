import { API_URL } from "./config";

export const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

export const getJSON = async function(id){
    try{
        const res = await fetch(
            // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
            `${API_URL}/${id}`
      
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
