document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Create Particles
    const particleCount = 12000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const targetColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 300;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;

        phases[i] = Math.random() * Math.PI * 2;
        
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.5;
        
        targetColors[i * 3] = 0.5;
        targetColors[i * 3 + 1] = 0.5;
        targetColors[i * 3 + 2] = 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 3. Formations
    // Helper to reset color
    function resetColors() {
        for (let i = 0; i < particleCount; i++) {
            targetColors[i * 3] = 0.5;
            targetColors[i * 3 + 1] = 0.5;
            targetColors[i * 3 + 2] = 0.5;
        }
    }

    function setTargetScatter() {
        resetColors();
        for (let i = 0; i < particleCount; i++) {
            targetPositions[i * 3] = (Math.random() - 0.5) * 300;
            targetPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
            targetPositions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 50;
        }
    }

    function setTargetSupplyDemand() {
        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;
            const ratio = i / particleCount;
            if (ratio < 0.2) { // Y-axis
                targetPositions[index] = -60;
                targetPositions[index + 1] = (Math.random() * 100) - 50;
                targetPositions[index + 2] = (Math.random() - 0.5) * 5;
                targetColors[index] = 0.3; targetColors[index+1] = 0.3; targetColors[index+2] = 0.3;
            } else if (ratio < 0.4) { // X-axis
                targetPositions[index] = (Math.random() * 120) - 60;
                targetPositions[index + 1] = -50;
                targetPositions[index + 2] = (Math.random() - 0.5) * 5;
                targetColors[index] = 0.3; targetColors[index+1] = 0.3; targetColors[index+2] = 0.3;
            } else if (ratio < 0.7) { // Supply (brighter)
                const t = Math.random();
                targetPositions[index] = -40 + t * 80;
                targetPositions[index + 1] = -30 + t * 80;
                targetPositions[index + 2] = (Math.random() - 0.5) * 10;
                targetColors[index] = 1.0; targetColors[index+1] = 1.0; targetColors[index+2] = 1.0;
            } else { // Demand (darker grey)
                const t = Math.random();
                targetPositions[index] = -40 + t * 80;
                targetPositions[index + 1] = 50 - t * 80;
                targetPositions[index + 2] = (Math.random() - 0.5) * 10;
                targetColors[index] = 0.5; targetColors[index+1] = 0.5; targetColors[index+2] = 0.5;
            }
        }
    }

    function setTargetPhillipsCurve() {
        resetColors();
        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;
            const ratio = i / particleCount;
            if (ratio < 0.15) { // Y-axis
                targetPositions[index] = -60;
                targetPositions[index + 1] = (Math.random() * 100) - 50;
                targetPositions[index + 2] = (Math.random() - 0.5) * 5;
            } else if (ratio < 0.3) { // X-axis
                targetPositions[index] = (Math.random() * 120) - 60;
                targetPositions[index + 1] = -50;
                targetPositions[index + 2] = (Math.random() - 0.5) * 5;
            } else if (ratio < 0.8) { // Phillips Curve
                const t = Math.random() * 0.9 + 0.1;
                targetPositions[index] = -50 + t * 100;
                targetPositions[index + 1] = -40 + (10 / t);
                targetPositions[index + 2] = (Math.random() - 0.5) * 10;
            } else { // Scatter
                targetPositions[index] = (Math.random() - 0.5) * 300;
                targetPositions[index + 1] = (Math.random() - 0.5) * 300;
                targetPositions[index + 2] = (Math.random() - 0.5) * 200 - 100;
            }
        }
    }

    function setTargetText() {
        resetColors();
        // C + I + G + = Y
        const textLines = [
            [-50, 10, -60, 10], [-60, 10, -60, -10], [-60, -10, -50, -10], // C
            [-45, 0, -35, 0], [-40, 5, -40, -5], // +
            [-30, 10, -30, -10], // I
            [-25, 0, -15, 0], [-20, 5, -20, -5], // +
            [-10, 10, -2, 10], [-10, 10, -10, -10], [-10, -10, -2, -10], [-2, -10, -2, 0], [-5, 0, -2, 0], // G
            [5, 3, 15, 3], [5, -3, 15, -3], // =
            [20, 10, 25, 0], [30, 10, 25, 0], [25, 0, 25, -10] // Y
        ];

        const particlesPerLine = Math.floor((particleCount * 0.6) / textLines.length);
        let currentP = 0;

        for (let j = 0; j < textLines.length; j++) {
            const line = textLines[j];
            for (let k = 0; k < particlesPerLine; k++) {
                if (currentP >= particleCount) break;
                const t = Math.random();
                const x = line[0] + (line[2] - line[0]) * t;
                const y = line[1] + (line[3] - line[1]) * t;
                
                targetPositions[currentP * 3] = x * 1.5;
                targetPositions[currentP * 3 + 1] = y * 1.5;
                targetPositions[currentP * 3 + 2] = (Math.random() - 0.5) * 5;
                currentP++;
            }
        }

        while (currentP < particleCount) {
            targetPositions[currentP * 3] = (Math.random() - 0.5) * 300;
            targetPositions[currentP * 3 + 1] = (Math.random() - 0.5) * 300;
            targetPositions[currentP * 3 + 2] = (Math.random() - 0.5) * 200 - 100;
            currentP++;
        }
    }

    // 4. Scroll Tracking & Animation
    let currentSection = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const scrollRatio = scrollY / maxScroll;

        targetRotationX = scrollRatio * 0.5;
        targetRotationY = scrollRatio * Math.PI * 0.5;

        let newSection = 0;
        if (scrollRatio < 0.25) newSection = 0;
        else if (scrollRatio < 0.55) newSection = 1;
        else if (scrollRatio < 0.85) newSection = 2;
        else newSection = 3;

        if (newSection !== currentSection) {
            currentSection = newSection;
            switch(currentSection) {
                case 0: setTargetScatter(); break;
                case 1: setTargetSupplyDemand(); break;
                case 2: setTargetPhillipsCurve(); break;
                case 3: setTargetText(); break;
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    setTargetScatter();

    // 5. Render Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        const posAttr = geometry.attributes.position;
        const positionsArray = posAttr.array;
        const colAttr = geometry.attributes.color;
        const colorsArray = colAttr.array;
        
        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;
            positionsArray[index] += (targetPositions[index] - positionsArray[index]) * 0.03;
            positionsArray[index+1] += (targetPositions[index+1] - positionsArray[index+1]) * 0.03;
            positionsArray[index+2] += (targetPositions[index+2] - positionsArray[index+2]) * 0.03;

            colorsArray[index] += (targetColors[index] - colorsArray[index]) * 0.05;
            colorsArray[index+1] += (targetColors[index+1] - colorsArray[index+1]) * 0.05;
            colorsArray[index+2] += (targetColors[index+2] - colorsArray[index+2]) * 0.05;

            const phase = phases[i];
            positionsArray[index] += Math.sin(elapsedTime * 0.5 + phase) * 0.05;
            positionsArray[index+1] += Math.cos(elapsedTime * 0.4 + phase) * 0.05;
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        points.rotation.x += (targetRotationX - points.rotation.x) * 0.05;
        points.rotation.y += (targetRotationY - points.rotation.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // 6. Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
