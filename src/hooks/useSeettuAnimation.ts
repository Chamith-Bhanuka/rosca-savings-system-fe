import { useEffect, useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';

interface AnimationRefs {
  bowlRef: RefObject<HTMLDivElement>;
  visualRef: RefObject<HTMLElement>;
  handRef: RefObject<HTMLDivElement>;
  chitRefs: MutableRefObject<(HTMLDivElement | null)[]>;
}

export function useSeettuAnimation(participants: string[]): AnimationRefs {
  const bowlRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLElement>(null);
  const handRef = useRef<HTMLDivElement>(null);

  const chitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationLock = useRef<boolean>(false);

  const wait = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const showHand = (x: number, y: number): void => {
    if (handRef.current) {
      handRef.current.style.left = `${x}px`;
      handRef.current.style.top = `${y}px`;
      handRef.current.classList.add('visible');
    }
  };

  const hideHand = (): void => {
    if (handRef.current) handRef.current.classList.remove('visible');
  };

  const dropChitsFromAir = async (): Promise<void> => {
    const chits = chitRefs.current;
    if (!bowlRef.current) return;

    chits.forEach((chit) => {
      if (!chit) return;
      chit.style.transition = 'none';
      chit.style.opacity = '0';

      const randomX = (Math.random() - 0.5) * 150;
      chit.style.transform = `translate(${randomX}px, -600px) translateZ(200px) rotateX(${Math.random() * 360}deg)`;

      chit.classList.remove('revealing');
      const unfolded = chit.querySelector('.chit-unfolded');
      if (unfolded) {
        unfolded.classList.remove('visible', 'unfolding');
      }
    });

    void bowlRef.current.offsetWidth;
    await wait(100);

    const dropPromises = chits.map((chit, i) => {
      return new Promise<void>((resolve) => {
        if (!chit) {
          resolve();
          return;
        }
        setTimeout(() => {
          chit.style.opacity = '1';
          chit.style.transition =
            'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s';

          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 80;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const rot = Math.random() * 360;
          const tilt = -10 + Math.random() * 20;

          chit.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) rotateX(${tilt}deg) translateZ(${Math.random() * 5}px)`;

          setTimeout(resolve, 900);
        }, i * 150);
      });
    });

    await Promise.all(dropPromises);
    await wait(500);
  };

  const stirChits = (): Promise<void> => {
    return new Promise((resolve) => {
      let count: number = 0;
      const interval = setInterval(() => {
        chitRefs.current.forEach((chit) => {
          if (!chit || chit.classList.contains('revealing')) return;

          const angle = Math.random() * Math.PI * 2;
          const radius = 50 + Math.random() * 90;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const rot = Math.random() * 360;

          chit.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          chit.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) translateZ(${Math.random() * 8}px)`;
        });

        count++;
        if (count >= 5) {
          clearInterval(interval);
          resolve();
        }
      }, 350);
    });
  };

  const scatterChits = (): void => {
    chitRefs.current.forEach((chit, i) => {
      if (!chit || chit.classList.contains('revealing')) return;
      const angle =
        (Math.PI * 2 * i) / chitRefs.current.length + Math.random() * 0.5;
      const radius = 60 + Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const rot = Math.random() * 360;
      const tilt = -10 + Math.random() * 20;

      chit.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) rotateX(${tilt}deg) translateZ(${Math.random() * 5}px)`;
    });
  };

  const startSequance = async (): Promise<void> => {
    if (animationLock.current) return;
    animationLock.current = true;

    await dropChitsFromAir();
    await stirChits();
    await wait(500);

    const validChits = chitRefs.current.filter(
      (c): c is HTMLDivElement => c !== null
    );
    if (validChits.length === 0) {
      animationLock.current = false;
      return;
    }

    const winner = validChits[Math.floor(Math.random() * validChits.length)];

    if (!visualRef.current) return;

    const visualRect = visualRef.current.getBoundingClientRect();
    const winnerRect = winner.getBoundingClientRect();
    const targetX =
      winnerRect.left - visualRect.left + winnerRect.width / 2 - 30;
    const targetY =
      winnerRect.top - visualRect.top + winnerRect.height / 2 - 30;

    showHand(targetX, targetY - 40);
    await wait(800);

    showHand(targetX, targetY);
    await wait(400);

    winner.style.transition = 'all 1.2s cubic-bezier(0.34, 1.5, 0.64, 1)';
    winner.style.transform =
      'translate(0, -200px) scale(1.3) rotate(0deg) rotateX(0deg)';
    winner.style.zIndex = '150';
    hideHand();
    await wait(1200);

    winner.classList.add('revealing');
    const unfolded = winner.querySelector('.chit-unfolded');
    if (unfolded) {
      unfolded.classList.add('visible');
      await wait(100);
      unfolded.classList.add('unfolding');
    }

    await wait(3500);

    if (unfolded) unfolded.classList.remove('unfolding');
    await wait(600);
    if (unfolded) unfolded.classList.remove('visible');

    winner.classList.remove('revealing');
    winner.style.transition = 'all 0.8s ease';
    winner.style.transform = '';
    winner.style.zIndex = '';

    scatterChits();
    await wait(1000);

    chitRefs.current.forEach((c) => {
      if (c) {
        c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        c.style.opacity = '0';
        c.style.transform += ' translateZ(50px)';
      }
    });
    await wait(600);

    animationLock.current = false;
    startSequance();
  };

  useEffect(() => {
    chitRefs.current = chitRefs.current.slice(0, participants.length);
    startSequance();

    return () => {
      animationLock.current = true;
    };
  }, [participants]);

  // @ts-ignore
  return { bowlRef, visualRef, handRef, chitRefs };
}
