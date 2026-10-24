function placeorder(){
    const inputs = document.querySelectorAll(".inputs")
    if (inputs.value === "" ) {
        alert("Order didnt placed some values are empty!")
    }else{
        alert("Order was placed successfuly")
    }
}
const THEME_KEY = "carzoneTheme";
const CUSTOM_CARS_KEY = "carzoneCustomCars";
function showdark() {
    setTheme("dark");
}
function showlight() {
    setTheme("light");
}
function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
}
(function loadSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    setTheme(savedTheme === "light" ? "light" : "dark");
})();
