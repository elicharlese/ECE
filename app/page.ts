import Image from 'next/image';
import styles from './app.module.css';
<<<<<<< HEAD
<<<<<<< HEAD
import { DocsCard, HelloComponentsCard, HelloNearCard } from './frontend/cards';
=======
import { DocsCard, HelloComponentsCard, HelloNearCard } from './components/cards';
>>>>>>> 18e5a849 (Scaffold basic file structure)
=======
import { DocsCard, HelloComponentsCard, HelloNearCard } from './components/cards';
>>>>>>> 9489c415 (Initial Commit)

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}> </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/near.svg"
          alt="Next.js Logo"
          width={110 * 1.5}
          height={28 * 1.5}
          priority
        />
        <h3 className="ms-2 me-3 text-dark"> + </h3>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={300 * .58}
          height={61 * .58}
          priority
        />
      </div>

      <div className={styles.grid}>
        <HelloComponentsCard />
        <HelloNearCard />
        <DocsCard />
      </div>
    </main>
  );
}
