import styles from "./linkButton.module.scss";

interface ILinkButton {
  text: string;
  href: string;
}

export const LinkButton = (props: ILinkButton) => (
  <a className={styles.link} href={props.href} target="_self">
    <div className={styles.content}>
      <div>{props.text}</div>
    </div>
  </a>
);
