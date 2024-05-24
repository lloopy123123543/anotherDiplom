import style from "./Modal.module.scss"
import {Card} from "@material-tailwind/react";
export const Modal = ({children}) => {
  return (
    <div className={style.modal_overlay}>
        <div className={style.modal_content}>
          {children}
        </div>
    </div>
  )
}