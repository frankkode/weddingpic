import Link from 'next/link';

import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            <a><img src="https://img.icons8.com/ios/50/FBEDDA/newlyweds.png" /></a>
          </Link>
        </p>
      </Container>
    </header>
  )
}

export default Header;