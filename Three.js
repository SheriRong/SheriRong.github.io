// ============================================
// Three.js Hero Section - Professional 3D Design
// ============================================

class HeroThreeScene {
    constructor() {
        this.container = document.getElementById('three-canvas-container');
        if (!this.container) return;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;

        this.init();
        this.createScene();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 30;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    createScene() {
        // Create main geometric group
        this.geometryGroup = new THREE.Group();
        this.scene.add(this.geometryGroup);

        // Create floating particles
        this.createFloatingParticles();

        // Create geometric shapes
        this.createGeometricShapes();

        // Create connecting lines
        this.createConnectingLines();

        // Create ambient glow orbs
        this.createGlowOrbs();
    }

    createFloatingParticles() {
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0x00ADB5); // Accent teal
        const color2 = new THREE.Color(0x222831); // Primary dark
        const color3 = new THREE.Color(0x393E46); // Secondary

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Spread particles in a spherical pattern
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 20 + Math.random() * 25;

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Color variation
            const colorChoice = Math.random();
            let particleColor;
            if (colorChoice < 0.5) {
                particleColor = color1;
            } else if (colorChoice < 0.8) {
                particleColor = color2;
            } else {
                particleColor = color3;
            }

            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for particles
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, particleMaterial);
        this.geometryGroup.add(this.particles);
    }

    createGeometricShapes() {
        this.shapes = [];

        // Material with gradient-like effect
        const createMaterial = (color, opacity = 0.3) => {
            return new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity,
                wireframe: true
            });
        };

        // Icosahedron - positioned on the right side
        const icoGeometry = new THREE.IcosahedronGeometry(4, 1);
        const icoMaterial = createMaterial(0x00ADB5, 0.4);
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        icosahedron.position.set(15, 5, -5);
        icosahedron.userData = {
            rotationSpeed: { x: 0.003, y: 0.005, z: 0.002 },
            floatSpeed: 0.001,
            floatOffset: 0
        };
        this.geometryGroup.add(icosahedron);
        this.shapes.push(icosahedron);

        // Octahedron
        const octGeometry = new THREE.OctahedronGeometry(3, 0);
        const octMaterial = createMaterial(0x393E46, 0.35);
        const octahedron = new THREE.Mesh(octGeometry, octMaterial);
        octahedron.position.set(20, -8, 5);
        octahedron.userData = {
            rotationSpeed: { x: 0.004, y: 0.003, z: 0.006 },
            floatSpeed: 0.0012,
            floatOffset: Math.PI / 3
        };
        this.geometryGroup.add(octahedron);
        this.shapes.push(octahedron);

        // Dodecahedron
        const dodecGeometry = new THREE.DodecahedronGeometry(2.5, 0);
        const dodecMaterial = createMaterial(0x00ADB5, 0.3);
        const dodecahedron = new THREE.Mesh(dodecGeometry, dodecMaterial);
        dodecahedron.position.set(25, 0, -8);
        dodecahedron.userData = {
            rotationSpeed: { x: 0.002, y: 0.004, z: 0.003 },
            floatSpeed: 0.0008,
            floatOffset: Math.PI / 2
        };
        this.geometryGroup.add(dodecahedron);
        this.shapes.push(dodecahedron);

        // Torus
        const torusGeometry = new THREE.TorusGeometry(2, 0.5, 8, 24);
        const torusMaterial = createMaterial(0x222831, 0.25);
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(12, -5, 8);
        torus.userData = {
            rotationSpeed: { x: 0.005, y: 0.002, z: 0.004 },
            floatSpeed: 0.0015,
            floatOffset: Math.PI
        };
        this.geometryGroup.add(torus);
        this.shapes.push(torus);

        // Small tetrahedrons scattered
        for (let i = 0; i < 8; i++) {
            const tetraGeometry = new THREE.TetrahedronGeometry(0.8, 0);
            const tetraMaterial = createMaterial(0x00ADB5, 0.2 + Math.random() * 0.2);
            const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);

            const angle = (i / 8) * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            tetra.position.set(
                Math.cos(angle) * radius + 10,
                (Math.random() - 0.5) * 20,
                Math.sin(angle) * radius - 5
            );

            tetra.userData = {
                rotationSpeed: {
                    x: 0.01 + Math.random() * 0.01,
                    y: 0.01 + Math.random() * 0.01,
                    z: 0.01 + Math.random() * 0.01
                },
                floatSpeed: 0.001 + Math.random() * 0.001,
                floatOffset: Math.random() * Math.PI * 2
            };

            this.geometryGroup.add(tetra);
            this.shapes.push(tetra);
        }
    }

    createConnectingLines() {
        this.lines = [];
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ADB5,
            transparent: true,
            opacity: 0.15
        });

        // Create random connections
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6);

            // Random start and end points
            const startAngle = Math.random() * Math.PI * 2;
            const endAngle = Math.random() * Math.PI * 2;
            const startRadius = 10 + Math.random() * 20;
            const endRadius = 10 + Math.random() * 20;

            positions[0] = Math.cos(startAngle) * startRadius + 10;
            positions[1] = (Math.random() - 0.5) * 30;
            positions[2] = Math.sin(startAngle) * startRadius;

            positions[3] = Math.cos(endAngle) * endRadius + 10;
            positions[4] = (Math.random() - 0.5) * 30;
            positions[5] = Math.sin(endAngle) * endRadius;

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const line = new THREE.Line(geometry, lineMaterial);
            line.userData = {
                pulseSpeed: 0.002 + Math.random() * 0.002,
                pulseOffset: Math.random() * Math.PI * 2
            };

            this.geometryGroup.add(line);
            this.lines.push(line);
        }
    }

    createGlowOrbs() {
        this.orbs = [];

        for (let i = 0; i < 5; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ADB5,
                transparent: true,
                opacity: 0.6
            });

            const orb = new THREE.Mesh(orbGeometry, orbMaterial);

            const angle = (i / 5) * Math.PI * 2;
            const radius = 18;
            orb.position.set(
                Math.cos(angle) * radius + 12,
                Math.sin(angle * 2) * 8,
                Math.sin(angle) * radius
            );

            orb.userData = {
                originalPosition: orb.position.clone(),
                orbitSpeed: 0.0003 + Math.random() * 0.0003,
                orbitRadius: 2 + Math.random() * 3,
                orbitOffset: Math.random() * Math.PI * 2
            };

            this.geometryGroup.add(orb);
            this.orbs.push(orb);
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Scroll listener to fade out
        window.addEventListener('scroll', () => this.onScroll());
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(event) {
        this.targetMouseX = (event.clientX / this.width) * 2 - 1;
        this.targetMouseY = -(event.clientY / this.height) * 2 + 1;
    }

    onScroll() {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        const opacity = Math.max(0, 1 - (scrollY / heroHeight) * 1.5);

        this.container.style.opacity = opacity;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Smooth mouse movement
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Rotate entire group based on mouse
        this.geometryGroup.rotation.y = this.mouseX * 0.3;
        this.geometryGroup.rotation.x = this.mouseY * 0.2;

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            this.particles.rotation.x += 0.0002;
        }

        // Animate shapes
        this.shapes.forEach(shape => {
            const { rotationSpeed, floatSpeed, floatOffset } = shape.userData;

            shape.rotation.x += rotationSpeed.x;
            shape.rotation.y += rotationSpeed.y;
            shape.rotation.z += rotationSpeed.z;

            // Floating motion
            shape.position.y += Math.sin(time * floatSpeed * 100 + floatOffset) * 0.01;
        });

        // Animate lines (pulsing opacity)
        this.lines.forEach(line => {
            const { pulseSpeed, pulseOffset } = line.userData;
            line.material.opacity = 0.1 + Math.sin(time * pulseSpeed * 100 + pulseOffset) * 0.05;
        });

        // Animate orbs (orbital motion)
        this.orbs.forEach(orb => {
            const { originalPosition, orbitSpeed, orbitRadius, orbitOffset } = orb.userData;

            orb.position.x = originalPosition.x + Math.cos(time * orbitSpeed * 100 + orbitOffset) * orbitRadius;
            orb.position.y = originalPosition.y + Math.sin(time * orbitSpeed * 100 + orbitOffset) * orbitRadius * 0.5;
            orb.position.z = originalPosition.z + Math.sin(time * orbitSpeed * 100 + orbitOffset + Math.PI / 4) * orbitRadius * 0.7;

            // Pulsing glow
            orb.material.opacity = 0.4 + Math.sin(time * 2 + orbitOffset) * 0.2;
            const scale = 1 + Math.sin(time * 2 + orbitOffset) * 0.2;
            orb.scale.set(scale, scale, scale);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE !== 'undefined') {
        new HeroThreeScene();
    }
});