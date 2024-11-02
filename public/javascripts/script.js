// Wait for the DOM to load
// document.addEventListener("DOMContentLoaded", function () {
//     // Get the flash message element
//     const flashMessage = document.getElementById("flash-message");

//     // Check if the flash message exists
//     if (flashMessage) {
//         // Set a timeout to hide the flash message after 3 seconds (3000 ms)
//         setTimeout(() => {
//             flashMessage.style.display = "none";
//         }, 2000);
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    // Get the flash container element
    const flashContainer = document.getElementById("flash-container");

    // Check if the flash container exists
    if (flashContainer) {
        // Set a timeout to hide the flash container after 3 seconds (3000 ms)
        setTimeout(() => {
            flashContainer.style.display = "none";
        }, 2000);
    }
});
