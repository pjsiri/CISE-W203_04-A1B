import styles from '../styles/Home.module.scss';
import { signIn } from 'next-auth/react'; // Import the sign-in function

export default function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Software Practice Empirical Evidence Database (SPEED)</h1>
            <a href="">
                <img
                    src="https://cdn3.emoji.gg/emojis/28649-pepecry2.png"
                    width="64px"
                    height="64px"
                    alt="PepeCry2"
                />
            </a>
            <p className={styles.description}>
                Welcome to SPEED, a searchable database of empirical evidence about software engineering practices and claims.
                Our goal is to help practitioners make informed decisions based on robust data and insights.
            </p>
            <div className={styles.ctaContainer}>
                <h2 className={styles.ctaTitle}>Get Started</h2>
                <p>
                    Explore our collection of articles, submit your own research, or engage with our community of software 
                    engineering professionals.
                </p>
                <button className={styles.ctaButton} onClick={() => signIn()}>
                    Sign In
                </button>
                
            </div>
        </div>
    );
}