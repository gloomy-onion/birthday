import { useState } from 'react';
import { images } from '../../shared';
import styles from './styles.module.scss';

const HIT_RADIUS = 10;

export const Main = () => {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);

  const image = images[level];
  const { PUBLIC_URL } = process.env;

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setMark({ x, y });

    const hit = Math.abs(x - image.eggX) < HIT_RADIUS && Math.abs(y - image.eggY) < HIT_RADIUS;

    setIsSuccess(hit);

    if (hit) {
      setTimeout(() => {
        setMark(null);
        setIsSuccess(null);
        setLevel((prev) => prev + 1);
      }, 600);
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
      style={
        {
          '--bg-image': `url(${image.src})`,
        } as React.CSSProperties
      }
    >
      <div className={styles.progress}>
        {level + 1} / {images.length}
      </div>
      <div className={styles.imageWrapper}>
        <img src={image.src} onClick={handleClick} className={styles.image} alt="" />
        {mark && (
          <div
            className={styles.marker}
            style={{
              left: `${mark.x}%`,
              top: `${mark.y}%`,
              border: `4px solid ${isSuccess ? 'green' : 'red'}`,
            }}
          />
        )}
      </div>
    </div>
  );
};
