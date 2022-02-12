import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      &copy;&nbsp;<a href="">My Wedding</a>- {new Date().getFullYear()}
    </footer>
  )
}

export default Footer;