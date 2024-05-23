import ReactDOM from "react-dom";
import { images } from "../../constants";
import styles from "./Loader.module.scss";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <h4 className={styles.wait}>Please wait...</h4>
      <div className={styles.loader}>
        <img src={images.animated_loading} alt="Loading, please wait" />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export default Loader;
