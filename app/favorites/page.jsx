'use client'
import React, { useContext } from 'react'
import { AddNewRecipeButton } from "../CompsClient"
import { RecipeList } from "../CompsServer"
import { AppContext } from '../AppContextWrapper';
const Favorites = () => {
  const { user } = useContext(AppContext);
  return (
    <RecipeList   
    action={"GetFlavourites"}  
    author={user}
    showInstructions={true}
    showIngredients={true}/>
  )
}

export default Favorites

