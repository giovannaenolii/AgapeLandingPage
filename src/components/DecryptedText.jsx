import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

function buildRevealOrder(length, direction) {
  if (direction === 'end') return Array.from({ length }, (_, index) => length - 1 - index);
  if (direction !== 'center') return Array.from({ length }, (_, index) => index);

  const order = [];
  const middle = Math.floor(length / 2);
  for (let offset = 0; order.length < length; offset += 1) {
    const index = offset % 2 === 0
      ? middle + offset / 2
      : middle - Math.ceil(offset / 2);
    if (index >= 0 && index < length) order.push(index);
  }
  return order;
}

export default function DecryptedText({
  text,
  speed = 45,
  maxIterations = 8,
  sequential = false,
  revealDirection = 'start',
  characters = DEFAULT_CHARACTERS,
  animateOn = 'view',
  replayOnView = false,
  className = '',
  parentClassName = '',
  encryptedClassName = '',
}) {
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const scramble = useCallback((revealed) => {
    const availableCharacters = characters.split('');
    return text.split('').map((character, index) => {
      if (character === ' ' || revealed.has(index)) return character;
      return availableCharacters[Math.floor(Math.random() * availableCharacters.length)] || character;
    }).join('');
  }, [characters, text]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
  }, []);

  const triggerAnimation = useCallback(() => {
    if (!text) return;

    stopAnimation();
    const order = buildRevealOrder(text.length, revealDirection);
    let pointer = 0;
    let iteration = 0;
    let revealed = new Set();
    setIsAnimating(true);
    setRevealedIndices(revealed);

    intervalRef.current = setInterval(() => {
      if (sequential) {
        if (pointer < order.length) {
          revealed = new Set(revealed).add(order[pointer]);
          pointer += 1;
          setRevealedIndices(revealed);
          setDisplayText(scramble(revealed));
          return;
        }
      } else {
        iteration += 1;
        setDisplayText(scramble(new Set()));
        if (iteration < maxIterations) return;
      }

      stopAnimation();
      setRevealedIndices(new Set(order));
      setDisplayText(text);
    }, speed);
  }, [maxIterations, revealDirection, scramble, sequential, speed, stopAnimation, text]);

  useEffect(() => {
    hasAnimatedRef.current = false;
    return stopAnimation;
  }, [stopAnimation, text]);

  useEffect(() => {
    if (animateOn !== 'view' || !containerRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        triggerAnimation();
      } else if (!entry.isIntersecting && replayOnView) {
        hasAnimatedRef.current = false;
        stopAnimation();
        setDisplayText(text);
        setRevealedIndices(new Set());
      }
    }, { threshold: 0.2 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOn, replayOnView, stopAnimation, text, triggerAnimation]);

  useEffect(() => {
    if (animateOn !== 'hover') return undefined;
    const element = containerRef.current;
    if (!element) return undefined;

    const handleEnter = () => triggerAnimation();
    const handleLeave = () => {
      stopAnimation();
      setDisplayText(text);
      setRevealedIndices(new Set());
    };

    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mouseleave', handleLeave);
    return () => {
      element.removeEventListener('mouseenter', handleEnter);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }, [animateOn, stopAnimation, text, triggerAnimation]);

  return (
    <span ref={containerRef} className={`decrypted-text ${parentClassName}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((character, index) => {
          const isRevealed = revealedIndices.has(index) || !isAnimating;
          return (
            <span key={`${character}-${index}`} className={isRevealed ? className : encryptedClassName}>
              {character}
            </span>
          );
        })}
      </span>
    </span>
  );
}
