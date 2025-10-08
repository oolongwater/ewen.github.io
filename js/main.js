import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene, Camera, Renderer
let scene, camera, renderer, controls;
let nintendo3DS = {};
let isOpen = false;
let clickEnabled = true;
let raycaster, mouse;

// Initialize the scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // Light gray background
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const canvas = document.getElementById('three-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    
    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 1.5;
    
    // Lighting setup for better material visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
    
    // Additional fill light to illuminate from the front
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-3, 5, 8);
    scene.add(fillLight);
    
    // Subtle colored accent lights
    const pointLight = new THREE.PointLight(0x009ac7, 0.4);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xe60012, 0.4);
    pointLight2.position.set(5, 3, -5);
    scene.add(pointLight2);
    
    // Raycaster for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Create the Nintendo 3DS
    create3DSModel();
    
    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('click', onCanvasClick);
    
    // Start animation loop
    animate();
}

// Load Nintendo 3DS model from Blender
function create3DSModel() {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    
    // Load textures manually
    const cameraTexture = textureLoader.load('model/textures/Camera_tex_diffuse.png');
    const buttonTexture = textureLoader.load('model/textures/BOTTONI_diffuse.png');
    
    // Configure textures
    cameraTexture.colorSpace = THREE.SRGBColorSpace;
    cameraTexture.flipY = false;
    buttonTexture.colorSpace = THREE.SRGBColorSpace;
    buttonTexture.flipY = false;
    
    // Create black material for console body
    const blackMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, // Dark gray-black
        roughness: 0.4,
        metalness: 0.1
    });
    
    console.log('Loading textures:', { cameraTexture, buttonTexture });
    
    loader.load(
        'model/new_nintendo_3ds.glb',
        function(gltf) {
            nintendo3DS.group = gltf.scene;
            
            console.log('Model loaded, examining structure...');
            console.log('Model children:', nintendo3DS.group.children.length);
            
            // Enable shadows and enhance textures on all meshes
            let meshCount = 0;
            nintendo3DS.group.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    meshCount++;
                    
                    console.log(`Mesh ${meshCount}:`, {
                        name: child.name,
                        position: child.position,
                        material: child.material?.name || 'unnamed',
                        hasMap: !!child.material?.map
                    });
                    
                    // Apply black material to ALL casing/body parts immediately
                    const meshName = child.name.toLowerCase();
                    if (meshName.includes('up_cover') || meshName.includes('copertura') || 
                        meshName.includes('top') || meshName.includes('cover') ||
                        meshName.includes('base') || meshName.includes('connettore') ||
                        meshName.includes('contatto') || meshName.includes('stilo') ||
                        meshName.includes('cube') || meshName.includes('slider') ||
                        meshName.includes('shell') || meshName.includes('case') ||
                        meshName.includes('body') || meshName.includes('casing') ||
                        meshName.includes('schermo_up') || meshName.includes('front') ||
                        meshName.includes('inner') || meshName.includes('up_')) {
                        console.log(`    IMMEDIATELY applying black material to casing: ${child.name}`);
                        child.material = blackMaterial.clone();
                    }
                    
                    // Enhance texture quality and settings
                    if (child.material) {
                        // Handle both single materials and arrays of materials
                        const materials = Array.isArray(child.material) ? child.material : [child.material];
                        
                        materials.forEach((material, index) => {
                            console.log(`  Material ${index}:`, {
                                name: material.name,
                                type: material.type,
                                hasMap: !!material.map,
                                color: material.color?.getHexString()
                            });
                            
                            // Apply textures and materials based on specific mesh names from the console logs
                            const meshName = child.name.toLowerCase();
                            
                            // Apply camera texture only to camera meshes
                            if (meshName.includes('camera')) {
                                console.log(`    Applying camera texture to: ${child.name}`);
                                material.map = cameraTexture;
                            } 
                            // Apply button texture only to button-related meshes
                            else if (meshName.includes('bottoni') || meshName.includes('gommino') || 
                                     meshName.includes('joypad') || meshName.includes('c-stick') ||
                                     meshName.includes('select') || meshName.includes('start')) {
                                console.log(`    Applying button texture to: ${child.name}`);
                                material.map = buttonTexture;
                            }
                            // For screens, keep their default material (they should remain black/gray)
                            else if (meshName.includes('screen') || meshName.includes('schermo') || 
                                     meshName.includes('touch') || meshName.includes('lcd')) {
                                console.log(`    Keeping default material for screen: ${child.name}`);
                            }
                            // Specifically target top front half casing meshes
                            else if (meshName.includes('schermo_up') || meshName.includes('top_screen') ||
                                     meshName.includes('up_screen') || meshName.includes('top_casing') ||
                                     meshName.includes('front_casing') || meshName.includes('inner_casing')) {
                                console.log(`    Applying black material to top front half: ${child.name}`);
                                child.material = blackMaterial.clone();
                            }
                            // FORCE black material on ALL other meshes (casing, body, etc.)
                            else {
                                console.log(`    FORCING black material on: ${child.name}`);
                                child.material = blackMaterial.clone();
                            }
                            
                            // Enhance texture quality
                            if (material.map) {
                                material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                material.map.minFilter = THREE.LinearMipmapLinearFilter;
                                material.map.magFilter = THREE.LinearFilter;
                                material.map.colorSpace = THREE.SRGBColorSpace;
                                material.map.flipY = false;
                                console.log(`    Enhanced texture on material: ${material.name}`);
                            }
                            
                            // Enhance normal maps if present
                            if (material.normalMap) {
                                material.normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                console.log(`    Found normal map on material: ${material.name}`);
                            }
                            
                            // Enhance roughness/metalness maps if present
                            if (material.roughnessMap) {
                                material.roughnessMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                console.log(`    Found roughness map on material: ${material.name}`);
                            }
                            if (material.metalnessMap) {
                                material.metalnessMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                console.log(`    Found metalness map on material: ${material.name}`);
                            }
                            
                            // Ensure material updates
                            material.needsUpdate = true;
                        });
                    }
                }
            });
            
            console.log(`Total meshes processed: ${meshCount}`);
            
            // Debug: List all mesh names for reference
            console.log('=== ALL MESH NAMES ===');
            nintendo3DS.group.traverse((child) => {
                if (child.isMesh) {
                    console.log(`Mesh: "${child.name}" - Material: "${child.material?.name || 'unnamed'}"`);
                }
            });
            console.log('=== END MESH NAMES ===');
            
            // Find the top and bottom halves of the 3DS
            // Adjust these names based on your Blender model's hierarchy
            nintendo3DS.topHalf = nintendo3DS.group.getObjectByName('Top') || 
                                  nintendo3DS.group.getObjectByName('top') ||
                                  nintendo3DS.group.getObjectByName('TopHalf') ||
                                  nintendo3DS.group.children.find(child => 
                                      child.name.toLowerCase().includes('top') ||
                                      child.name.toLowerCase().includes('screen')
                                  );
            
            nintendo3DS.bottomHalf = nintendo3DS.group.getObjectByName('Bottom') || 
                                     nintendo3DS.group.getObjectByName('bottom') ||
                                     nintendo3DS.group.getObjectByName('BottomHalf') ||
                                     nintendo3DS.group.children.find(child => 
                                         child.name.toLowerCase().includes('bottom') ||
                                         child.name.toLowerCase().includes('base')
                                     );
            
            // If specific parts aren't found, use the entire model as one group
            if (!nintendo3DS.topHalf) {
                console.log('Top half not found, creating group from all children');
                nintendo3DS.topHalf = new THREE.Group();
                // Add half of the model's children to top half (you may need to adjust this)
                const halfIndex = Math.floor(nintendo3DS.group.children.length / 2);
                for (let i = halfIndex; i < nintendo3DS.group.children.length; i++) {
                    nintendo3DS.topHalf.add(nintendo3DS.group.children[i].clone());
                }
            }
            
            if (!nintendo3DS.bottomHalf) {
                console.log('Bottom half not found, using base group');
                nintendo3DS.bottomHalf = new THREE.Group();
            }
            
            // Scale and position the model
            const box = new THREE.Box3().setFromObject(nintendo3DS.group);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 6 / maxDim; // Scale to roughly 6 units wide
            nintendo3DS.group.scale.set(scale, scale, scale);
            
            // Center the model
            const center = box.getCenter(new THREE.Vector3());
            nintendo3DS.group.position.set(-center.x * scale, 2 - center.y * scale, -center.z * scale);
            nintendo3DS.group.rotation.y = Math.PI / 6;
            
            // Store the clickable object (use the top half or entire group)
            nintendo3DS.clickableObject = nintendo3DS.topHalf || nintendo3DS.group;
            
            scene.add(nintendo3DS.group);
            
            // Hide loading screen once model is loaded
            document.getElementById('loading-screen').classList.add('hidden');
            
            console.log('Model loaded successfully');
            console.log('Model hierarchy:', nintendo3DS.group);
        },
        function(xhr) {
            // Progress callback
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete) + '% loaded');
        },
        function(error) {
            console.error('Error loading model:', error);
            // Hide loading screen even on error
            document.getElementById('loading-screen').classList.add('hidden');
        }
    );
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle canvas clicks
function onCanvasClick(event) {
    if (!clickEnabled || !nintendo3DS.group) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the ray - check the entire model
    const intersects = raycaster.intersectObjects(nintendo3DS.group.children, true);
    
    if (intersects.length > 0) {
        if (!isOpen) {
            // Trigger open animation
            window.dispatchEvent(new CustomEvent('3ds-open'));
            isOpen = true;
            clickEnabled = false;
            setTimeout(() => { clickEnabled = true; }, 1500);
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Subtle floating animation
    if (nintendo3DS.group && !isOpen) {
        nintendo3DS.group.position.y = 2 + Math.sin(Date.now() * 0.001) * 0.2;
        nintendo3DS.group.rotation.y += 0.002;
    }
    
    // Render scene
    renderer.render(scene, camera);
}

// Export for use in other modules
export { nintendo3DS, isOpen, scene, camera, renderer };

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

