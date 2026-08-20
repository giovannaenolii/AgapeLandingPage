import { useEffect, useRef, useState } from 'react';
import { Heatmap, NeuroNoise, PaperTexture } from '@paper-design/shaders-react';
import { useTheme } from '../context/ThemeContext';

const HEATMAP_LOGO = 'https://shaders.paper.design/images/logos/diamond.svg';
const HEATMAP_COLORS = ['#112069', '#1f3ca3', '#3265e7', '#6bd8ff', '#ffffff', '#1f3ca3', '#18284e'];

function useReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}

function usePointerParallax(enabled = true) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return undefined;

    let frameId = null;
    let nextPointer = { x: 0, y: 0 };

    const handlePointerMove = (event) => {
      nextPointer = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      };

      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        setPointer(nextPointer);
        frameId = null;
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [enabled]);

  return pointer;
}

function useTransparentIconAsset(source) {
  const [preparedSource, setPreparedSource] = useState(() => (source.startsWith('/') ? null : source));

  useEffect(() => {
    if (!source.startsWith('/')) {
      return undefined;
    }

    let cancelled = false;
    const image = document.createElement('img');
    image.decoding = 'async';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colorCounts = new Map();
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] < 32) continue;
        const red = Math.round(pixels[index] / 16) * 16;
        const green = Math.round(pixels[index + 1] / 16) * 16;
        const blue = Math.round(pixels[index + 2] / 16) * 16;
        if (red < 150 || green < 150 || blue < 150) continue;
        const key = `${red},${green},${blue}`;
        colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
      }

      const backgroundKey = [...colorCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      if (!backgroundKey) {
        if (!cancelled) setPreparedSource(source);
        return;
      }

      const background = backgroundKey.split(',').map(Number);
      const hardTolerance = 26;
      const softTolerance = 52;

      for (let index = 0; index < pixels.length; index += 4) {
        const distance = Math.hypot(
          pixels[index] - background[0],
          pixels[index + 1] - background[1],
          pixels[index + 2] - background[2],
        );

        if (distance <= hardTolerance) {
          pixels[index + 3] = 0;
        } else if (distance < softTolerance) {
          pixels[index + 3] = Math.round(((distance - hardTolerance) / (softTolerance - hardTolerance)) * pixels[index + 3]);
        }
      }

      context.putImageData(imageData, 0, 0);
      if (!cancelled) setPreparedSource(canvas.toDataURL('image/png'));
    };
    image.src = source;

    return () => {
      cancelled = true;
    };
  }, [source]);

  return preparedSource;
}

export function NeuroBackdrop({ className = '', strength = 'hero', interactive = true }) {
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotionPreference();
  const pointer = usePointerParallax(strength === 'hero' && !prefersReducedMotion && interactive);
  const shaderConfig = isDark
    ? {
        front: '#e5eeff',
        mid: '#113ca6',
        back: '#000000',
        brightness: 0.13,
        contrast: 0.17,
        speed: 1,
      }
    : {
        front: '#ffffff',
        mid: '#148eff',
        back: '#ffffff',
        brightness: 0.15,
        contrast: 0.25,
        speed: 1,
      };

  return (
    <div
      className={`shader-backdrop shader-backdrop--${strength} ${className}`}
      style={{
        '--shader-parallax-x': `${pointer.x * 18}px`,
        '--shader-parallax-y': `${pointer.y * 18}px`,
      }}
      aria-hidden="true"
    >
      <NeuroNoise
        width="100%"
        height="100%"
        colorFront={shaderConfig.front}
        colorMid={shaderConfig.mid}
        colorBack={shaderConfig.back}
        brightness={shaderConfig.brightness}
        contrast={shaderConfig.contrast}
        speed={prefersReducedMotion ? 0 : shaderConfig.speed}
        scale={strength === 'hero' ? 0.95 : 0.7}
        offsetX={interactive ? pointer.x * 0.26 : 0}
        offsetY={interactive ? pointer.y * 0.26 : 0}
        fit="cover"
        maxPixelCount={strength === 'hero' ? 520000 : 90000}
      />
    </div>
  );
}

export function WaveField({ className = '', interactive = true }) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const pointer = { x: 0.5, y: 0.42 };
    const targetPointer = { x: 0.5, y: 0.42 };
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let time = 0;
    let previousTime = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const handlePointerMove = (event) => {
      if (!interactive) return;
      targetPointer.x = event.clientX / window.innerWidth;
      targetPointer.y = event.clientY / window.innerHeight;
    };

    const render = (frameTime = 0) => {
      const delta = previousTime ? Math.min(48, frameTime - previousTime) / 1000 : 0;
      previousTime = frameTime;
      time += delta;

      pointer.x += (targetPointer.x - pointer.x) * 0.065;
      pointer.y += (targetPointer.y - pointer.y) * 0.065;

      context.clearRect(0, 0, width, height);

      const cursorX = pointer.x * width;
      const cursorY = pointer.y * height;
      const lineCount = width < 700 ? 20 : 30;
      const color = isDark ? '113, 190, 255' : '30, 113, 190';

      for (let line = 0; line < lineCount; line += 1) {
        const progress = line / (lineCount - 1);
        const baseY = height * (0.12 + progress * 0.82);
        const depth = 1 - Math.abs(progress - 0.48) * 0.75;
        const opacity = (0.08 + depth * 0.14) * (isDark ? 1 : 0.72);

        context.beginPath();
        for (let x = -36; x <= width + 36; x += 18) {
          const distance = Math.hypot(x - cursorX, baseY - cursorY);
          const cursorInfluence = Math.exp(-distance / Math.max(width, height) * 2.4);
          const cursorWave = Math.sin(distance * 0.035 - time * 3.2) * 22 * cursorInfluence;
          const ambientWave = Math.sin(x * 0.008 + time * 0.72 + line * 0.22) * 9;
          const secondaryWave = Math.sin(x * 0.0025 - time * 0.38 + line) * 13;
          const y = baseY + ambientWave + secondaryWave + cursorWave;

          if (x === -36) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle = `rgba(${color}, ${opacity})`;
        context.lineWidth = line % 5 === 0 ? 1.25 : 0.75;
        context.stroke();
      }

      if (!prefersReducedMotion) animationFrame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    if (interactive) window.addEventListener('pointermove', handlePointerMove, { passive: true });
    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    };
  }, [interactive, isDark, prefersReducedMotion]);

  return <canvas ref={canvasRef} className={`wave-field ${className}`} aria-hidden="true" />;
}

export function PaperGrain({ className = '' }) {
  return (
    <div className={`shader-grain ${className}`} aria-hidden="true">
      <PaperTexture
        width="100%"
        height="100%"
        colorBack="#00000000"
        colorFront="#ffffff20"
        contrast={0}
        roughness={0.75}
        fiber={0.28}
        fiberSize={0.2}
        crumples={0.55}
        crumpleSize={0.22}
        folds={0.1}
        foldCount={3}
        drops={0.08}
        fade={0}
        seed={6}
        scale={1.5}
        fit="cover"
        maxPixelCount={180000}
      />
    </div>
  );
}

export function HeatmapIcon({
  className = '',
  image = HEATMAP_LOGO,
  colors = HEATMAP_COLORS,
  colorBack = '#000000',
  contour = 0.5,
  angle = 0,
  noise = 0.06,
  innerGlow = 0.5,
  outerGlow = 0.43,
  speed = 0.4,
  scale = 0.75,
  offsetX = 0,
}) {
  const prefersReducedMotion = useReducedMotionPreference();
  const preparedImage = useTransparentIconAsset(image);

  return (
    <div className={`heatmap-icon ${className}`} aria-hidden="true">
      {preparedImage && (
        <Heatmap
          width="100%"
          height="100%"
          image={preparedImage}
          colors={colors}
          colorBack={colorBack}
          contour={contour}
          angle={angle}
          noise={noise}
          innerGlow={innerGlow}
          outerGlow={outerGlow}
          speed={prefersReducedMotion ? 0 : speed}
          scale={scale}
          offsetX={offsetX}
          fit="contain"
          maxPixelCount={32000}
        />
      )}
    </div>
  );
}
