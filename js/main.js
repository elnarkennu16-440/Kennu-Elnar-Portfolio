// Initialize AOS
AOS.init({
  once: true,
  duration: 800
});

// Contact form handler with PHP backend
document.getElementById('contactForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const status = document.getElementById('contactStatus');
  status.textContent = 'Sending...';

  // Create FormData from the form
  const formData = new FormData(this);

  // Send data to PHP script (using fallback for now)
  fetch('send_email_fallback.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      status.textContent = 'Message sent — thank you!';
      e.target.reset();
    } else {
      status.textContent = data.message || 'Failed to send message. Please try again.';
      console.log('Server response:', data); // Debug info
    }
  })
  .catch(error => {
    status.textContent = 'Failed to send message. Please try again.';
    console.log('Error:', error);
  });
});

// Set copyright year
document.getElementById('copyYear').textContent = new Date().getFullYear();







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
