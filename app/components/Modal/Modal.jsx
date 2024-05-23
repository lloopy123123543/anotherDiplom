import style from "./Modal.module.scss"
import {Card} from "@material-tailwind/react";
export const Modal = ({children}) => {
  return (
    <div className={style.modal_overlay}>
        <div className={style.modal_content}>
          <button className={style.close_button}>Close</button>
          {children}
        </div>
    </div>
  )
}