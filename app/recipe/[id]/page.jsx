import { getAllRecipesIds } from "@/app/CompsServer";
import RecipeById from "./RecipeById";

export async function generateStaticParams() {
  let recipes = await getAllRecipesIds();
  // Ensure that you are using parseInt instead of parseString
  return recipes
}


const Recipe = ({ params }) => {

  return (
    <>
      <RecipeById id={params.id} />
    </>
  );
};

export default Recipe;
