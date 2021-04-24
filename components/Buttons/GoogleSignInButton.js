import Image from 'next/image';

import styles from '../../styles/GoogleSignInButton.module.css';

const GoogleSignInButton = () => (
  <div className={styles.block} role="button">
    <a
      className={styles['hidden-link']}
      href="http://localhost:3001/login/google"
      aria-hidden
      tabIndex={-1}
    >
      &nbsp;
    </a>
    <Image src="/btn_google_light_normal.svg" width={46} height={46} />
    <span className={styles.text}>Sign in with Google</span>
  </div>
);

export default GoogleSignInButton;
