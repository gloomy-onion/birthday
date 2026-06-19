import { useEffect, useState } from 'react';
import { images } from '../../shared';
import styles from './styles.module.scss';

const HIT_RADIUS = 4;

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  dx: number;
  dy: number;
}

export const Main = () => {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const image = images[level];
  const { PUBLIC_URL } = process.env;

  useEffect(() => {
    [`${PUBLIC_URL}/assets/images/start.png`, `${PUBLIC_URL}/assets/images/win.png`].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [PUBLIC_URL]);

  useEffect(() => {
    const next = images[level + 1];
    if (next) {
      const img = new Image();
      img.src = next.src;
    }
  }, [level]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setMark({ x, y });

    const hit = Math.abs(x - image.eggX) < HIT_RADIUS && Math.abs(y - image.eggY) < HIT_RADIUS;
    setIsSuccess(hit);

    if (hit) {
      const emojis = ['🌟', '✨', '⭐', '💛'];
      const newParticles: Particle[] = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        dx: (Math.random() - 0.5) * 50,
        dy: -(Math.random() * 60 + 4),
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setMark(null);
        setIsSuccess(null);
        setParticles([]);
        setLevel((prev) => prev + 1);
      }, 900);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  if (level >= images.length) {
    return (
      <div
        className={`${styles.screen} ${styles.finish}`}
        style={
          {
            '--bg-image': `url(${PUBLIC_URL}/assets/images/win.png)`,
          } as React.CSSProperties
        }
      >
        <img src={`${PUBLIC_URL}/assets/images/win.png`} className={styles.image} alt="" />
      </div>
    );
  }

  if (!started) {
    return (
      <div
        className={`${styles.screen} ${styles.start}`}
        style={
          {
            '--bg-image': `url(${PUBLIC_URL}/assets/images/start.png)`,
          } as React.CSSProperties
        }
      >
        <img src={`${PUBLIC_URL}/assets/images/start.png`} className={styles.image} alt="" />

        <button className={styles.button} onClick={() => setStarted(true)}>
          Спасти дядю Айро
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.screen} ${styles.container}`}
      style={{ '--bg-image': `url(${image.src})` } as React.CSSProperties}
    >
      <div className={styles.progress}>
        {level + 1} / {images.length}
      </div>
      <div className={`${styles.imageWrapper} ${shaking ? styles.shake : ''}`}>
        <img src={image.src} onClick={handleClick} className={styles.image} alt="" />
        {mark && (
          <div
            className={`${styles.marker} ${isSuccess ? styles.markerHit : styles.markerMiss}`}
            style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
          />
        )}
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                '--dx': `${p.dx}vw`,
                '--dy': `${p.dy}vh`,
              } as React.CSSProperties
            }
          >
            {p.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};
