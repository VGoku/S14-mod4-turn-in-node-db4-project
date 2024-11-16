const db = require("../../data/db-config");

async function getRecipeById(recipe_id) {
  // Get all the data in one query
  const recipeRows = await db("recipes as r")
    .leftJoin("steps as s", "r.recipe_id", "s.recipe_id")
    .leftJoin("step_ingredients as si", "si.step_id", "s.step_id")
    .leftJoin("ingredients as i", "i.ingredient_id", "si.ingredient_id") // fixed column name typo: ingredients_id to ingredient_id
    .select(
      "r.recipe_id",
      "r.recipe_name",
      "s.step_id",
      "s.step_number",
      "s.step_text",
      "i.ingredient_id",
      "i.ingredient_name",
      "si.quantity"
    )
    .orderBy("s.step_number")
    .where("r.recipe_id", recipe_id);

  // If no rows are found, return null or an empty object
  if (recipeRows.length === 0) {
    return null;
  }

  // Map the recipe details and reduce steps and ingredients into the required format
  const recipe = {
    recipe_id: recipeRows[0].recipe_id,
    recipe_name: recipeRows[0].recipe_name,
    steps: [],
  };

  // Reduce rows into a structured format
  recipeRows.forEach((row) => {
    const stepIndex = recipe.steps.findIndex((step) => step.step_id === row.step_id);
    
    // If the step doesn't exist, add it
    if (stepIndex === -1) {
      recipe.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        step_text: row.step_text,
        ingredients: [],
      });
    }

    // Find the correct step
    const step = recipe.steps.find((step) => step.step_id === row.step_id);

    // Add ingredient to the step if it's not already there
    if (row.ingredient_id && !step.ingredients.find((ingredient) => ingredient.ingredient_id === row.ingredient_id)) {
      step.ingredients.push({
        ingredient_id: row.ingredient_id,
        ingredient_name: row.ingredient_name,
        quantity: row.quantity,
      });
    }
  });

  return recipe;
}

module.exports = { getRecipeById };
