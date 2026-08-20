import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

function distanceBetween(x, y, x2, y2) {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}

function findClosestEdge(mouseX, mouseY, width, height) {
  const topEdgeDist = distanceBetween(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distanceBetween(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
}

function FlowingMenuItem({ item, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const calculateRepetitions = () => {
      const content = marqueeInnerRef.current?.querySelector('.flowing-menu__part');
      if (!content) return;
      setRepetitions(Math.max(4, Math.ceil(window.innerWidth / content.offsetWidth) + 2));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [item.text]);

  useEffect(() => {
    const content = marqueeInnerRef.current?.querySelector('.flowing-menu__part');
    if (!content || content.offsetWidth === 0) return undefined;

    animationRef.current?.kill();
    animationRef.current = gsap.to(marqueeInnerRef.current, {
      x: -content.offsetWidth,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });

    return () => animationRef.current?.kill();
  }, [item.text, repetitions, speed]);

  const handleEnter = (event) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: { duration: 0.65, ease: 'expo.out' } })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleLeave = (event) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: { duration: 0.65, ease: 'expo.out' } })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div className="flowing-menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="flowing-menu__link"
        href={item.link}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ color: textColor }}
      >
        <span className="flowing-menu__index">{item.index}</span>
        <span>{item.text}</span>
        <span className="flowing-menu__tag">{item.tag}</span>
      </a>
      <div className="flowing-menu__marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="flowing-menu__inner-wrap">
          <div className="flowing-menu__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, index) => (
              <div className="flowing-menu__part" key={index} style={{ color: marqueeTextColor }}>
                <span>{item.text}</span>
                <div className="flowing-menu__image" style={{ backgroundImage: `url(${item.image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlowingMenu({ items = [], speed = 16 }) {
  return (
    <div className="flowing-menu">
      {items.map((item) => (
        <FlowingMenuItem key={item.text} item={item} speed={speed} textColor="var(--text-color)" marqueeBgColor="var(--primary)" marqueeTextColor="#e9f7ff" borderColor="var(--border-color)" />
      ))}
    </div>
  );
}
