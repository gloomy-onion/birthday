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
      <div className={styles.finish}>
        <h1>🎉 Ура! Ты нашла все пасхалки!</h1>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={styles.start}>
        <h1>Найди все пасхалки 🐣</h1>

        <img src={'/assets/images/start.png'} onClick={handleClick} className={styles.image} alt={''} />

        <button onClick={() => setStarted(true)}>Начать</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {level + 1} / {images.length}
      </div>

      <img src={image.src} onClick={handleClick} className={styles.image} alt={''} />

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
  );
};
