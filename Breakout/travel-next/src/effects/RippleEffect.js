
import {Curtains, Plane, Vec2} from '../curtain/index.mjs';

export function initFaviconRippleEffect() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupRippleEffect);
    } else {
        setupRippleEffect();
    }
}

function setupRippleEffect() {
    // Find the favicon container
    const faviconContainer = document.querySelector('.favicon-container');
    const faviconImage = document.querySelector('.favicon-image');
    
    if (!faviconContainer || !faviconImage) {
        console.warn('Favicon container or image not found');
        return;
    }

    // Track mouse positions
    const mousePosition = new Vec2();
    const mouseLastPosition = new Vec2();

    const deltas = {
        max: 0,
        applied: 0,
    };

    // Create a canvas container for WebGL within the favicon container
    const webglContainer = document.createElement('div');
    webglContainer.id = 'favicon-webgl-container';
    webglContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
    `;

    // Make favicon container relative positioned
    faviconContainer.style.position = 'relative';
    
    // Add webgl container to favicon container
    faviconContainer.appendChild(webglContainer);

    // Set up WebGL context
    const curtains = new Curtains({
        container: webglContainer,
        watchScroll: false,
        pixelRatio: Math.min(1.5, window.devicePixelRatio)
    });

    // Handle errors
    curtains.onError(() => {
        webglContainer.style.display = 'none';
        console.warn('WebGL not supported, falling back to original image');
    }).onContextLost(() => {
        curtains.restoreContext();
    });

    // Create a plane element dynamically with the same image
    const planeElement = document.createElement('div');
    planeElement.className = 'favicon-curtain';
    planeElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    `;

    const imageElement = document.createElement('img');
    imageElement.src = faviconImage.src;
    imageElement.crossOrigin = '';
    imageElement.setAttribute('data-sampler', 'faviconTexture');
    imageElement.style.display = 'none';
    
    planeElement.appendChild(imageElement);
    webglContainer.appendChild(planeElement);

    // Vertex shader
    const vertexShader = `
        precision mediump float;

        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        uniform mat4 faviconTextureMatrix;

        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMousePosition;
        uniform float uMouseMoveStrength;

        void main() {
            vec3 vertexPosition = aVertexPosition;

            // Calculate distance from mouse
            float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));

            // Create wave effect
            float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));

            // Attenuate based on distance
            float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

            // Calculate distortion
            float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;

            // Apply distortion to vertex position
            vertexPosition.z += distortionEffect / 30.0;
            vertexPosition.x += (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
            vertexPosition.y += distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);

            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

            vTextureCoord = (faviconTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            vVertexPosition = vertexPosition;
        }
    `;

    // Fragment shader
    const fragmentShader = `
        precision mediump float;

        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform sampler2D faviconTexture;

        void main() {
            vec4 finalColor = texture2D(faviconTexture, vTextureCoord);

            // Add lighting effects based on vertex displacement
            finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
            finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);

            // Handle premultiplied alpha
            finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

            gl_FragColor = finalColor;
        }
    `;

    // Plane parameters
    const params = {
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        widthSegments: 20,
        heightSegments: 20,
        uniforms: {
            resolution: {
                name: "uResolution",
                type: "2f",
                value: [300, 200], // Match your image dimensions
            },
            time: {
                name: "uTime",
                type: "1f",
                value: 0,
            },
            mousePosition: {
                name: "uMousePosition",
                type: "2f",
                value: mousePosition,
            },
            mouseMoveStrength: {
                name: "uMouseMoveStrength",
                type: "1f",
                value: 0,
            }
        }
    };

    // Create the plane
    const faviconPlane = new Plane(curtains, planeElement, params);

    // Handle plane ready
    if (faviconPlane) {
        faviconPlane.onReady(() => {
            // Set perspective
            faviconPlane.setPerspective(35);
    
            // Hide the original Next.js Image component
            faviconImage.style.opacity = '0';
    
            // Apply initial effect
            deltas.max = 2;
    
            // Add mouse event listeners to favicon container
            faviconContainer.addEventListener("mousemove", (e) => {
                handleMovement(e, faviconPlane, faviconContainer);
            });
    
            faviconContainer.addEventListener("touchmove", (e) => {
                handleMovement(e, faviconPlane, faviconContainer);
            }, {
                passive: true
            });
    
            // Add mouse enter/leave for activation
            faviconContainer.addEventListener("mouseenter", () => {
                deltas.max = 3;
            });
    
            faviconContainer.addEventListener("mouseleave", () => {
                deltas.max = 0;
            });
    
        }).onRender(() => {
            // Update time
            faviconPlane.uniforms.time.value++;
    
            // Apply damping
            deltas.applied += (deltas.max - deltas.applied) * 0.02;
            deltas.max += (0 - deltas.max) * 0.01;
    
            // Update mouse move strength
            faviconPlane.uniforms.mouseMoveStrength.value = deltas.applied;
    
        }).onAfterResize(() => {
            const planeBoundingRect = faviconPlane.getBoundingRect();
            faviconPlane.uniforms.resolution.value = [planeBoundingRect.width, planeBoundingRect.height];
        }).onError(() => {
            // Fallback: show original image
            faviconImage.style.opacity = '1';
            webglContainer.style.display = 'none';
        });
    }

    // Handle movement function
    function handleMovement(e, plane, container) {
        // Update last position
        mouseLastPosition.copy(mousePosition);

        const mouse = new Vec2();
        const rect = container.getBoundingClientRect();

        // Handle touch vs mouse events
        if (e.targetTouches) {
            mouse.set(
                e.targetTouches[0].clientX - rect.left,
                e.targetTouches[0].clientY - rect.top
            );
        } else {
            mouse.set(
                e.clientX - rect.left,
                e.clientY - rect.top
            );
        }

        // Smooth mouse position
        mousePosition.set(
            curtains.lerp(mousePosition.x, mouse.x, 0.3),
            curtains.lerp(mousePosition.y, mouse.y, 0.3)
        );

        // Convert to plane coordinates
        plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(mousePosition);

        // Calculate movement strength
        if (mouseLastPosition.x && mouseLastPosition.y) {
            let delta = Math.sqrt(
                Math.pow(mousePosition.x - mouseLastPosition.x, 2) + 
                Math.pow(mousePosition.y - mouseLastPosition.y, 2)
            ) / 30;
            
            delta = Math.min(4, delta);
            
            if (delta >= deltas.max) {
                deltas.max = delta;
            }
        }
    }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
    initFaviconRippleEffect();
}