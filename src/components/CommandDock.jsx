import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BriefcaseBusiness, Command, Mail, Moon, Quote, Sun, Waves } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './CommandDock.css';

const DEFAULT_DOCK_ITEMS = [
  { label: 'Soluções', icon: Waves, target: 'features' },
  { label: 'Cases', icon: BriefcaseBusiness, target: 'products' },
  { label: 'Manifesto', icon: Quote, target: 'about' },
  { label: 'Contato', icon: Mail, target: 'contact' },
];

function DockLabel({ children, isHovered }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return undefined;
    return isHovered.on('change', (latest) => setVisible(latest === 1));
  }, [isHovered]);

  return (
    <AnimatePresence>
      {visible && <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0, y: 0 }} className="command-dock__label">{children}</motion.div>}
    </AnimatePresence>
  );
}

function DockItem({ item, mouseX, distance, baseItemSize, magnification, spring }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);
  const mouseDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return value - rect.x - baseItemSize / 2;
  });
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleClick = () => {
    if (item.action) item.action();
    if (item.target) window.location.hash = item.target;
  };

  const Icon = item.icon;

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={handleClick}
      className="command-dock__item"
      aria-label={item.label}
    >
      <Icon size={18} strokeWidth={1.8} />
      <DockLabel isHovered={isHovered}>{item.label}</DockLabel>
    </motion.button>
  );
}

export default function CommandDock({
  items = DEFAULT_DOCK_ITEMS,
  brand = 'AGP',
  showTheme = true,
  className = '',
  ariaLabel = 'Navegação rápida',
}) {
  const { isDark, setIsDark } = useTheme();
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const spring = useMemo(() => ({ mass: 0.1, stiffness: 150, damping: 12 }), []);
  const panelHeight = 56;
  const baseItemSize = 42;
  const magnification = 64;
  const distance = 180;
  const maxHeight = Math.max(180, magnification + magnification / 2 + 4);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const themeItem = { label: isDark ? 'Modo claro' : 'Modo escuro', icon: isDark ? Sun : Moon, action: () => setIsDark(!isDark) };

  return (
    <motion.div style={{ height }} className={`command-dock ${className}`}>
      <motion.div
        className="command-dock__panel"
        style={{ height: panelHeight }}
        onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX); }}
        onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity); }}
        role="toolbar"
        aria-label={ariaLabel}
      >
        <div className="command-dock__brand"><Command size={14} /><span>{brand}</span></div>
        {items.map((item) => <DockItem key={item.label} item={item} mouseX={mouseX} distance={distance} baseItemSize={baseItemSize} magnification={magnification} spring={spring} />)}
        {showTheme && <DockItem item={themeItem} mouseX={mouseX} distance={distance} baseItemSize={baseItemSize} magnification={magnification} spring={spring} />}
      </motion.div>
    </motion.div>
  );
}
