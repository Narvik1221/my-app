import React from "react";
import "./modal.css";
import close from "../assets/close.svg";

const Modal = ({ active, setActive, children, classes, zIndex,modalSearchWidth="460px" }) => {
  return (
    <div
    style={{ zIndex: zIndex }}
      className={active ? "modal active " : "modal"}
    >
      <div
      
       style={{ zIndex: zIndex,maxWidth:modalSearchWidth }}
        className={
          active
            ? classes
              ? "modal__content active " + classes
              : "modal__content active"
            : "modal__content"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div  style={{ zIndex: zIndex }} className="modal__inner">
          {children}
          <img
            onClick={() => setActive(false)}
            src={close}
            className="modal__close"
          ></img>
        </div>
      </div>
    </div>
  );
};
export default Modal;
