class ParticleBackground {
    constructor() {
        // Initialize Three.js scene, camera, and renderer
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.mouse = new THREE.Vector2();
        this.time = 0;

        // Array of image paths
        this.images = [
            '/assets/images/code.png',
            '/assets/images/brain.png',
            '/assets/images/waves.png'
        ];
        this.currentImageIndex = 0;

        this.init();
        this.setupEvents();
    }

    init() {
        // Set up renderer and append to DOM
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 100;

        // Load initial image
        const loader = new THREE.ImageLoader();
        loader.load(this.images[this.currentImageIndex], (image) => {
            this.createParticles(image);
        });
    }

    createParticles(image) {
        // Create canvas to process image data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Create geometry for particles
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        // Process image data to create particles
        for (let y = 0; y < imageData.height; y += 2) {
            for (let x = 0; x < imageData.width; x += 2) {
                const i = (y * imageData.width + x) * 4;
                const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;

                if (brightness > 34) {
                    // Add position and color data for bright pixels
                    positions.push(
                        x - imageData.width / 2,
                        y - imageData.height / 2,
                        0
                    );
                    colors.push(
                        imageData.data[i] / 255,
                        imageData.data[i + 1] / 255,
                        imageData.data[i + 2] / 255
                    );
                }
            }
        }

        // Set attributes for geometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create material for particles
        const material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            sizeAttenuation: true
        });

        // Create and add particles to the scene
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    changeImage() {
        // Remove existing particles
        if (this.particles) {
            this.scene.remove(this.particles);
        }

        // Update image index
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;

        // Load new image and create particles
        const loader = new THREE.ImageLoader();
        loader.load(this.images[this.currentImageIndex], (image) => {
            this.createParticles(image);
        });
    }

    setupEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Track mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Start animation loop
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.05;

        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;

            // Animate particles
            for (let i = 0; i < positions.length; i += 3) {
                // Apply wave effect
                positions[i + 2] = Math.sin((positions[i] / 10) + this.time) *
                    Math.cos((positions[i + 1] / 10) + this.time) * 10;

                // Apply mouse interaction
                const dx = positions[i] - this.mouse.x * 50;
                const dy = positions[i + 1] - this.mouse.y * 50;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 50) {
                    positions[i + 2] += (50 - dist) * 0.5;
                }
            }

            // Update particle positions
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application
const background = new ParticleBackground();

// Get the background image element
const backgroundImg = document.querySelector('#background-img');

// Change particle image when background image loads
backgroundImg.addEventListener('load', () => {
    background.changeImage();
});
