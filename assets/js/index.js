// Add event listeners to update button
document.querySelector('#reload-button').addEventListener('click', () => {
    // Change the source of the image to force a reload of three.js
    const backgroundImg = document.querySelector('#background-img');
    backgroundImg.src = backgroundImg.src;
})