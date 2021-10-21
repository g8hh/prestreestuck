var map;

function loadSburb() {
    return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070710);
    const camera = new THREE.OrthographicCamera( 
        window.innerWidth / -200, window.innerWidth / 200, 
        window.innerHeight / 200, window.innerHeight / -200, 
        1, 1000
    );
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.classList.add("sburbCanvas");
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(0.4, 0.4)
    map = new THREE.TextureLoader().load("data/spirograph.png")
    map.minFilter = THREE.NearestFilter;
    map.magFilter = THREE.NearestFilter;
    const material = new THREE.MeshBasicMaterial({ 
        map: map,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    updateScene();

    function updateScene() {
        requestAnimationFrame( updateScene );
        camera.left = -(camera.right = window.innerWidth / 200);
        camera.bottom = -(camera.top = window.innerHeight / 200);
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
        cube.rotation.x += 0.025;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.015;
        renderer.render( scene, camera );
    }
}
