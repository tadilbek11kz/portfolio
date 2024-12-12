// Initialize smooth scrolling with Lenis
const lenis = new Lenis({
    autoRaf: true, // Automatically call requestAnimationFrame
});

// Initialize Swup for page transitions
const swup = new Swup({
    plugins: [
        new SwupHeadPlugin(), // Plugin to handle <head> updates
        new SwupScriptsPlugin({ optin: true }) // Plugin to handle script execution
    ]
});

// Handle sidebar link clicks
swup.hooks.on('link:click', (e) => {
    // Check if the clicked link is a sidebar link
    if (!e.trigger.el.dataset.hasOwnProperty("sidebar")) {
        return;
    }

    const prevPage = document.querySelector('.active');
    const currentPage = e.trigger.el;
    const after = prevPage.querySelector('span');

    // Update previous active link
    prevPage.removeChild(after);
    prevPage.classList.remove('active', 'ml-3', 'text-3xl');
    prevPage.classList.add('hover:after:w-full');

    // Update current active link
    currentPage.classList.remove('hover:after:w-full');
    currentPage.classList.add('active', 'ml-3', 'text-3xl');
    currentPage.appendChild(after);
});

// DOM elements for sidebar functionality
const elements = {
    openMenu: document.querySelector('#open'),
    closeMenu: document.querySelector('#close'),
    sidebar: document.querySelector('#sidebar'),
    collapsedMenu: document.querySelector('#colapsed-sidebar'),
    expandedMenu: document.querySelector('#expanded-sidebar')
};

// Function to toggle sidebar state
function toggleSidebar(expand) {
    elements.openMenu.classList.toggle('hidden', expand);
    elements.collapsedMenu.classList.toggle('hidden', expand);
    elements.closeMenu.classList.toggle('hidden', !expand);
    elements.expandedMenu.classList.toggle('!flex', expand);
    elements.expandedMenu.classList.toggle('!p-8', expand);
    elements.sidebar.classList.toggle('!w-80', expand);
}

// Event listener for opening the sidebar
elements.openMenu.addEventListener('click', () => toggleSidebar(true));

// Event listener for closing the sidebar
elements.closeMenu.addEventListener('click', () => toggleSidebar(false));
