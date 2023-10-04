import React from 'react';
import { useState } from 'react';
import Modal from "./Modal.tsx";
import Button from './Button.tsx';

interface ModalButtonProps{
    children?: any 
    btnTitle: string
    type: string
    message?: string
}



const ModalButton: React.FC<ModalButtonProps> =({ children, btnTitle, type, message }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
    setIsModalOpen(true);
    };
    
    const closeModal = () => {
    setIsModalOpen(false);
    };
    
    return(
        <div>
            <Button onClick={openModal} styleType={"green"}>
                {btnTitle}
            </Button>
            <Modal isOpen={isModalOpen} onClose={closeModal} modalType={type} message={message}>
                {console.log(isModalOpen)}
                {children}
            </Modal>
        </div>
);
};

export default ModalButton;