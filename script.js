//Meal app js file


//Variables declaration 
const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

fetchFavMeals();


//Function to get meals by its id
async function getMealById(id) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const responseData = await response.json();
    const meal = responseData.meals[0];

    return meal;
}


//Function to get meals by the search input
async function getMealsBySearch(temp) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+temp);

    const responseData = await response.json();
    const meals = await responseData.meals;

    return meals;


}


//Function to add meal to meal container
function addMeal(mealData, random = false) {
    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
    <div class="meal-header">
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}s</h4>
        <button class="fav-btn">
            Add Favorite
        </button>
    </div>`;


    //Listner to favorite button
    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {

        if(btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        }

        else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }

        //clean the container
        
        fetchFavMeals();
 });

    meal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    mealsEl.appendChild(meal);
}

function addMealLS(mealId) {
    const mealIds = getMealsLS();
    
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id != mealId)));
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}


//Function to fetch meals in fovorite container
async function fetchFavMeals() {

    // clean the container
    favoriteContainer.innerHTML = "";
    const mealIds = getMealsLS();

    const meals = [];

    for(let i =0; i< mealIds.length; i++) {

        const mealId = mealIds[i];

        meal = await getMealById(mealId);

        addMealFav(meal);
    }

}


//Function to add meals in favorite container
function addMealFav(mealData) {
  
    const favmeal = document.createElement('li');

    favmeal.innerHTML = `
    <li><img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span></li>
    <button class = "clear"><i class="fas fa-trash"></i></button>`;

    const btn = favmeal.querySelector('.clear');    

    btn.addEventListener("click", () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });
    
    favmeal.addEventListener("click", () => {
        showMealInfo(mealData);
    });
    favoriteContainer.appendChild(favmeal);
}


//function to show meal information
function showMealInfo(mealData) {
    //clean it up

    mealInfoEl.innerHTML = '';
    //update the mealInfo
    const mealEl = document.createElement('div');

    const ingredients = [];

    //get ingredients and measures 
    for(let i = 1; i <= 20; i++) {
        if(mealData['strIngredient'+i]) {
            ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure' + i]} `)
        } else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="">
        <p>${mealData.strInstructions}</p>
        <h3> Ingredients:</h3>
        <ul>
            ${ingredients.map( (ing) => `
                <li>${ing}</li>`
                ).join("")}
        </ul>
        `;

    mealInfoEl.appendChild(mealEl);

    mealPopup.classList.remove('hidden');
} 


//Listener to search button to search the input
searchBtn.addEventListener("click", async () => {

    mealsEl.innerHTML = "";
 
     const search = searchTerm.value;

     const meals = await getMealsBySearch(search);

     if(meals){

     meals.forEach((meal) => {
         addMeal(meal);
     });
    }

});

popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
})