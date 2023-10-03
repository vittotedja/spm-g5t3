import React from 'react';
import close from '../assets/close.png';
import Button from './Button';


interface ModalProps{
    children?: any 
    isOpen: boolean
    onClose: () => void
    modalType: string
    message?: string
}

const Modal: React.FC<ModalProps> = ({  children, isOpen, onClose, modalType, message }) => {
  
  return (
    <>
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
      <div className="relative bg-white rounded-lg shadow-lg">
        <div className="p-5">
            <div className='text-right p-2'>
                <button onClick={onClose}><img src={close} width={13}/></button>
            </div>
          <div className="w-96 pb-3">
          {modalType === 'reason' ? (
                <div>
                    <p className=" text-2xl font-extrabold mb-4 text-left">Reason for applying</p>
                    <textarea className="w-full h-24 border border-emerald-900/50 p-2 mb-4 rounded" placeholder="I want to apply for the role because..."></textarea>
                    <div className='flex items-end justify-end'>
                      <Button styleType={"green"}>Submit</Button>
                    </div>
                </div>
            ) : modalType === 'success' ? (
                <div>
                    <div className="flex items-center justify-center">
                      <img src="https://wbsagjngbxrrzfktkvtt.supabase.co/storage/v1/object/public/assets/success.png?t=2023-09-30T09%3A20%3A08.550Z" width={150}/>
                    </div>
                    <p className="text-green text-4xl font-extrabold mb-4">Successful</p>
                    <div className="text-xl font-bold pl-4 pr-4">{message}</div>
                </div>
            ) : modalType === 'fail' ? (
                <div className="text-center">
                    <div className="flex items-center justify-center mb-8 mt-6">
                      <img src="https://wbsagjngbxrrzfktkvtt.supabase.co/storage/v1/object/public/assets/fail.png?t=2023-09-30T09%3A39%3A44.126Z" width={100}/>
                    </div>
                    <p className="text-red text-4xl font-extrabold mb-4">Failed</p>
                    <div className="text-xl font-bold pl-4 pr-4">{message}</div>
                </div>
            ) : modalType === 'confirmation' ? (
                <div>
                    <div className="flex items-center justify-center mb-8">
                      <img src="https://wbsagjngbxrrzfktkvtt.supabase.co/storage/v1/object/public/assets/warning.png?t=2023-09-30T09%3A39%3A59.701Z" width={120}/>
                    </div>
                    <div className="text-xl font-bold pl-4 pr-4">{message}</div>
                    <div className="flex justify-center items-center mt-6">
                      <Button className="mr-6" styleType={"red"}>No</Button>
                      <Button styleType={"green"}>Yes</Button>
                    </div>
                </div>
            ) : (
            <div className='mt-6 pl-4 pr-4'>
                {children}
            </div>
                )}
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
};
export default Modal;