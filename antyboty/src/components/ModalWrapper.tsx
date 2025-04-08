// src/components/ModalWrapper.tsx
import React from "react";
import "../css/Model.css";

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-wrapper-content">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;

