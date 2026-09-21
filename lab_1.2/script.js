const featuresButton = document.querySelector("#featuresButton");
const featuresSection = document.querySelector("#features");

featuresButton.addEventListener("click", () => {
    featuresSection.scrollIntoView({
        behavior: "smooth"
    });
});