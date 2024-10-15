import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/SignInPage.module.scss'

const SignInPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRoleSignIn = async (role: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      username: role,
      password: '123',  // Default password
    });

    if (result?.error) {
      setError('Sign in failed');
    } else {
      if (role === 'analyst') {
        router.push('/analyst');
      } else if (role === 'moderator') {
        router.push('/moderator');
      } else if (role === 'admin') {
        router.push('/admin');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign In</h1>
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.buttonContainer}>
        <button className={styles.roleButton} onClick={() => handleRoleSignIn('moderator')}>
          Sign in as Moderator
        </button>
        <button className={styles.roleButton} onClick={() => handleRoleSignIn('analyst')}>
          Sign in as Analyst
        </button>
        <button className={styles.roleButton} onClick={() => handleRoleSignIn('admin')}>
          Sign in as Administrator
        </button>
      </div>
    </div>
  );
};

export default SignInPage;