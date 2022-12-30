export const state = {
    recipe: {},
}

export const loadRecipe = async function(id){
    try{
        const res = await fetch(
            // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
            `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      
            );
          const data = await res.json();
      
          if(!res.ok) {
            throw new Error(`${data.message} (${res.status})`);
          }
      
        let {recipe} = data.data;
          recipe = {
            title : recipe.title,
            id : recipe.id,
            publisher: recipe.publisher,
            imageUrl: recipe.image_url,
            ingrediensts: recipe.ingredients,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            sourceUrl: recipe.source_url,
          }
        
          state.recipe = recipe;
    }
    catch(err){
        console.log(`${err} 🔥🔥🔥🔥`);
    }
}
