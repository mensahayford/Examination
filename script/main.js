// SIMPLE WATER ANIMATION (CLEAN & SAFE)
AFRAME.registerComponent('water-animate', {
  init: function () {
    this.baseY = this.el.object3D.position.y;
  },

  tick: function (time) {
    const wave = Math.sin(time * 0.002) * 0.03;
    this.el.object3D.position.y = this.baseY + wave;
  }
});

// FURNITURE HOVER 
AFRAME.registerComponent('furniture-hover', {
  init: function () {
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('animation', {
        property: 'scale', to: '1.08 1.08 1.08',
        dur: 280, easing: 'easeOutElastic'
      });
    });
    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('animation', {
        property: 'scale', to: '1 1 1',
        dur: 280, easing: 'easeOutQuad'
      });
    });
  }
});

// CUSTOM WATER SHADER
AFRAME.registerShader('waterShader', {
  schema: {
    color: { type: 'color', is: 'uniform' },
    time:  { type: 'time',  is: 'uniform' }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float time;
    varying vec2 vUv;
    void main() {
      float wave = sin(vUv.x * 10.0 + time * 0.002) * 0.04
                 + sin(vUv.y * 8.0  + time * 0.003) * 0.04;
      gl_FragColor = vec4(color, 0.65 + wave);
    }
  `
});

// ROOM PROXIMITY GLOW
AFRAME.registerComponent('room-glow', {
  init: function () {
    const s = this.el.getAttribute('scale');
    this._base = { x: s.x, y: s.y, z: s.z };
  },
  tick: function () {
    const cam = this.el.sceneEl.camera;
    if (!cam) return;
    const dist   = this.el.object3D.position.distanceTo(cam.el.object3D.position);
    const factor = Math.max(1, 1.12 - dist * 0.012);
    const b      = this._base;
    this.el.setAttribute('scale', `${b.x * factor} ${b.y * factor} ${b.z * factor}`);
  }
});
