import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vTexcoord;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vTexcoord = uv;
  }
`;

const fragmentShader = `
  varying vec2 vTexcoord;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uPixelRatio;
  uniform float uShapeSize;
  uniform float uRoundness;
  uniform float uBorderSize;
  uniform float uCircleSize;
  uniform float uCircleEdge;
  uniform float uVariation;

  #define PI 3.141592653589793
  #define TWO_PI 6.283185307179586

  vec2 coord(vec2 point) {
    point /= uResolution.xy;
    if (uResolution.x > uResolution.y) {
      point.x *= uResolution.x / uResolution.y;
      point.x += (uResolution.y - uResolution.x) / uResolution.y / 2.0;
    } else {
      point.y *= uResolution.y / uResolution.x;
      point.y += (uResolution.x - uResolution.y) / uResolution.x / 2.0;
    }
    point -= 0.5;
    return point * vec2(-1.0, 1.0);
  }

  float sdRoundRect(vec2 point, vec2 bounds, float radius) {
    vec2 distance = abs(point - 0.5) * 4.2 - bounds + vec2(radius);
    return min(max(distance.x, distance.y), 0.0) + length(max(distance, 0.0)) - radius;
  }

  float sdCircle(vec2 point, vec2 center) {
    return length(point - center) * 2.0;
  }

  float antiAliasedStep(float threshold, float value) {
    float width = length(vec2(dFdx(value), dFdy(value))) * 0.70710678;
    return smoothstep(threshold - width, threshold + width, value);
  }

  float fill(float value) {
    return 1.0 - antiAliasedStep(0.0, value);
  }

  float fill(float value, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, value);
  }

  float strokeAA(float value, float size, float width, float edge) {
    float antiAlias = length(vec2(dFdx(value), dFdy(value))) * 0.70710678;
    float outer = smoothstep(size - edge - antiAlias, size + edge + antiAlias, value + width * 0.5);
    float inner = smoothstep(size - edge - antiAlias, size + edge + antiAlias, value - width * 0.5);
    return clamp(outer - inner, 0.0, 1.0);
  }

  void main() {
    vec2 point = coord(gl_FragCoord.xy) + 0.5;
    vec2 mouse = coord(uMouse * uPixelRatio) * vec2(1.0, -1.0) + 0.5;
    float cursorRing = fill(sdCircle(point, mouse), uCircleSize, uCircleEdge);
    float border;
    if (uVariation > 1.5 && uVariation < 2.5) {
      float circle = sdCircle(point, vec2(0.5));
      border = strokeAA(circle, 0.58, 0.02, cursorRing) * 4.0;
    } else {
      float shape = sdRoundRect(point, vec2(uShapeSize), uRoundness);
      border = strokeAA(shape, 0.0, uBorderSize, cursorRing) * 4.0;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, border);
  }
`;

export default function ShapeBlur({
  className = '',
  variation = 0,
  pixelRatioProp = 2,
  shapeSize = 1.1,
  roundness = 0.45,
  borderSize = 0.025,
  circleSize = 0.24,
  circleEdge = 0.75,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }

    let active = true;
    let animationFrameId;
    let lastTime = performance.now();
    const mouse = new THREE.Vector2();
    const dampedMouse = new THREE.Vector2();
    const resolution = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMouse: { value: dampedMouse },
        uResolution: { value: resolution },
        uPixelRatio: { value: pixelRatioProp },
        uShapeSize: { value: shapeSize },
        uRoundness: { value: roundness },
        uBorderSize: { value: borderSize },
        uCircleSize: { value: circleSize },
        uCircleEdge: { value: circleEdge },
        uVariation: { value: variation },
      },
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(1, 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    mount.appendChild(renderer.domElement);

    const updatePointer = (event) => {
      const rect = mount.getBoundingClientRect();
      mouse.set(event.clientX - rect.left, event.clientY - rect.top);
    };

    const resize = () => {
      if (!active) return;
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioProp);
      renderer.setSize(width, height);
      renderer.setPixelRatio(devicePixelRatio);
      plane.scale.set(width, height, 1);
      resolution.set(width, height).multiplyScalar(devicePixelRatio);
      material.uniforms.uPixelRatio.value = devicePixelRatio;
    };

    const render = (now) => {
      if (!active) return;
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      dampedMouse.x = THREE.MathUtils.damp(dampedMouse.x, mouse.x, 8, delta);
      dampedMouse.y = THREE.MathUtils.damp(dampedMouse.y, mouse.y, 8, delta);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [borderSize, circleEdge, circleSize, pixelRatioProp, roundness, shapeSize, variation]);

  return <div ref={mountRef} className={`shape-blur ${className}`} aria-hidden="true" />;
}
