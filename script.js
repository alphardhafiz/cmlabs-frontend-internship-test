$(document).ready(function () {
  let list = "";

  // get List of Categories
  $.get(
    "https://www.themealdb.com/api/json/v1/1/categories.php",
    function (data, status) {
      const listOfCategories = [];
      listOfCategories.push(data.categories);
      // console.log(listOfCategories[0]);
      list = "<ol id='list-category'>";
      listOfCategories[0].map((v, i) => {
        list += `
        <li data-category="${v.strCategory}" class="list-category" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url(${v.strCategoryThumb})">
          <h2>${v.strCategory}</h2>
        </li>
        `;
      });
      list += "</ol>";
      $("#title-page").text("See All The Delicious Foods");
      $("main").html(list);

      // get Filter Category on Click
      $(".list-category").on("click", function () {
        var category = $(this).data("category");
        $.get(
          `http://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
          function (data, status) {
            const listOfMeals = [];
            listOfMeals.push(data.meals);
            list = "<ol id='list-meal'>";
            listOfMeals[0].map((v, i) => {
              list += `
              <li data-idmeal="${v.idMeal}" 
              class="list-meal" 
              style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${v.strMealThumb}); 
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;">
                <h2>${v.strMeal}</h2>
              </li>
              `;
            });
            list += "</ol>";
            $("#title-page").text(category);
            $("main").html(list);

            // get Detail Meal
            $(".list-meal").on("click", function () {
              var mealId = $(this).data("idmeal");
              $.get(
                `http://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
                function (data, status) {
                  const mealDetail = [];

                  let recipes = "<ul>";
                  mealDetail.push(data.meals[0]);
                  const youtubeSrc = mealDetail[0].strYoutube;
                  const embedLink = youtubeSrc.replace("watch?v=", "embed/");
                  console.log(youtubeSrc);
                  console.log(embedLink);
                  console.log(mealDetail[0]);

                  for (let i = 1; i <= 20; i++) {
                    // let str = "strIngredient" + i;
                    const ingredient = mealDetail[0]["strIngredient" + i];
                    const measure = mealDetail[0]["strMeasure" + i];

                    if (ingredient && measure) {
                      recipes += `<li>${measure} ${ingredient}</li>`;
                    }
                  }
                  recipes += "</ul>";

                  list = `
                  <h2 class="title-area">${mealDetail[0].strArea} Cullinary</h2>
                  <div class="details">
                    <img
                      src=${mealDetail[0].strMealThumb}
                      alt=""
                    />
                    <div class="description">
                      <h2>Instructions</h2>
                      <p>
                      ${mealDetail[0].strInstructions}
                      </p>
                      <h2>Recipes</h2>
                      ${recipes}
                    </div>
                  </div>
                  <div class="tutorial-video">
                    <h2>Tutorials</h2>
                    <iframe src=${embedLink} frameborder="0" allowfullscreen></iframe>
                  </div>
                  `;

                  $("#title-page").text(mealDetail[0].strMeal);
                  $("main").html(list);
                }
              );
            });
          }
        );
      });
    }
  );
});
