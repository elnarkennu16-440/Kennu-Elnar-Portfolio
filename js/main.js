// Initialize AOS
AOS.init({
  once: true,
  duration: 800
});

// Typing Animation for Hero Section with proper word wrapping
document.addEventListener('DOMContentLoaded', function() {
  const typingText = document.querySelector('.typing-text');
  if (typingText) {
    const text = "An Undergraduate BSIS student at Camarines Norte State College. Aspiring QA tester in the IT industry — passionate about testing, automation, and delivering reliable software experiences.";
    
    // Split text into words for proper wrapping
    const words = text.split(' ');
    let wordIndex = 0;
    let charIndex = 0;
    let currentWord = '';
    let isDelaying = false;
    
    function type() {
      if (wordIndex >= words.length) {
        // Typing complete - hide cursor
        typingText.classList.add('typing-done');
        return;
      }
      
      if (!isDelaying) {
        currentWord = words[wordIndex];
        charIndex++;
        
        // Build displayed text with proper spacing
        let displayText = '';
        for (let i = 0; i <= wordIndex; i++) {
          displayText += words[i] + (i < words.length - 1 ? ' ' : '');
        }
        
        typingText.textContent = displayText;
        
        // Check if we need to break to next line (for long text)
        if (typingText.scrollWidth > typingText.clientWidth || 
            typingText.getBoundingClientRect().height > 60) {
          // Add line break before current word
          displayText = '';
          for (let i = 0; i < wordIndex; i++) {
            displayText += words[i] + ' ';
          }
          displayText += '\n' + currentWord;
          typingText.textContent = displayText;
        }
        
        // Check if current word is complete
        if (charIndex >= currentWord.length) {
          wordIndex++;
          charIndex = 0;
          
          // Check for punctuation pauses
          const punctuation = currentWord.match(/[.,;!?]$/);
          isDelaying = true;
          const delay = punctuation ? (punctuation[0] === '.' ? 400 : 200) : 50;
          
          setTimeout(() => {
            isDelaying = false;
            type();
          }, delay);
        } else {
          setTimeout(type, 50);
        }
      }
    }
    
    // Start typing after a short delay
    setTimeout(type, 800);
  }
});

// Fix for Bootstrap Modal and Accordion - prevents JSON parse errors
document.addEventListener('DOMContentLoaded', function() {
  // Get the modal element
  const nobleclassicsModal = document.getElementById('nobleclassicsModal');
  
  if (nobleclassicsModal) {
    // Fix close button (X)
    const closeBtn = nobleclassicsModal.querySelector('.btn-close');
    const closeFooterBtn = nobleclassicsModal.querySelector('.modal-footer .btn-secondary');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modal = bootstrap.Modal.getInstance(nobleclassicsModal);
        if (modal) {
          modal.hide();
        } else {
          // If no instance, create one and hide
          const newModal = new bootstrap.Modal(nobleclassicsModal);
          newModal.hide();
        }
      });
    }
    
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modal = bootstrap.Modal.getInstance(nobleclassicsModal);
        if (modal) {
          modal.hide();
        } else {
          const newModal = new bootstrap.Modal(nobleclassicsModal);
          newModal.hide();
        }
      });
    }
    
    // Custom accordion button handlers - completely bypass Bootstrap's collapse
    const accordionBtns = nobleclassicsModal.querySelectorAll('.custom-accordion-btn');
    
    accordionBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = this.getAttribute('data-target');
        const targetCollapse = document.getElementById(targetId);
        
        if (targetCollapse) {
          // Check if currently expanded
          const isExpanded = !this.classList.contains('collapsed');
          
          // Close all accordions first
          accordionBtns.forEach(function(otherBtn) {
            otherBtn.classList.add('collapsed');
            otherBtn.setAttribute('aria-expanded', 'false');
          });
          
          const allCollapses = nobleclassicsModal.querySelectorAll('.custom-collapse');
          allCollapses.forEach(function(collapse) {
            collapse.classList.add('collapsed');
          });
          
          // If it wasn't expanded, expand it now
          if (!isExpanded) {
            this.classList.remove('collapsed');
            this.setAttribute('aria-expanded', 'true');
            targetCollapse.classList.remove('collapsed');
          }
        }
      });
    });
    
    // Prevent modal from being stuck open
    nobleclassicsModal.addEventListener('hidden.bs.modal', function() {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      
      // Remove backdrop if exists
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(function(backdrop) {
        backdrop.remove();
      });
      
      // Reset accordion states - close all
      accordionBtns.forEach(function(btn) {
        btn.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
      });
      
      const allCollapses = nobleclassicsModal.querySelectorAll('.custom-collapse');
      allCollapses.forEach(function(collapse) {
        collapse.classList.add('collapsed');
      });
    });
    
    // Clean up on backdrop click outside modal
    nobleclassicsModal.addEventListener('click', function(e) {
      if (e.target === nobleclassicsModal) {
        const modal = bootstrap.Modal.getInstance(nobleclassicsModal);
        if (modal) {
          modal.hide();
        }
      }
    });
  }
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
