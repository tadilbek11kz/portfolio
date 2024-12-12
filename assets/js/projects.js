// Add event listeners to each project element
document.querySelectorAll('#project').forEach(project => {
    project.addEventListener('mouseover', () => {
        // Add hover effect to project element
        project.parentNode.querySelector('span').classList.add('after:w-full')
    })
    project.addEventListener('mouseout', () => {
        // Remove hover effect from project element
        project.parentNode.querySelector('span').classList.remove('after:w-full')
    })
})

