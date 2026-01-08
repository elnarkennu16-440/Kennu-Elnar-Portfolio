// Initialize AOS
AOS.init({
  once: true,
  duration: 800
});

// Contact form handler (mock)
document.getElementById('contactForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const status = document.getElementById('contactStatus');
  status.textContent = 'Sending...';
  setTimeout(()=> {
    status.textContent = 'Message sent — thank you!';
    this.reset();
  }, 900);
});

// Set copyright year
document.getElementById('copyYear').textContent = new Date().getFullYear();

// Animate progress bars on scroll
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease';
        bar.style.width = width;
      }, 100);
    }
  });
}

window.addEventListener('scroll', animateProgressBars);
window.addEventListener('load', animateProgressBars);



// Simple three.js rotating object for subtle 3D feel
function initThree(){
  const container = document.getElementById('hero-canvas');
  if(!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  // geometry with nice material
  const geometry = new THREE.IcosahedronGeometry(1.8, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x826bff,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x1f1633,
    emissiveIntensity: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(-2, 1, 0);
  scene.add(mesh);

  // floating small torus
  const tor = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 16, 60), new THREE.MeshStandardMaterial({ color:0x6b9eff, roughness:0.6 }));
  tor.position.set(2.4, -0.8, 0);
  tor.rotation.x = 0.8;
  scene.add(tor);

  // lights
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2, 3, 4);
  scene.add(key);
  const fill = new THREE.PointLight(0x6b5bff, 0.6, 10);
  fill.position.set(-3, -2, 2);
  scene.add(fill);

  // subtle camera movement following mouse
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  });

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.008;
    tor.rotation.y -= 0.01;

    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
}

if (typeof THREE !== 'undefined') {
  initThree();
} else {
  window.addEventListener('load', function() {
    if (typeof THREE !== 'undefined') {
      initThree();
    }
  });
}
