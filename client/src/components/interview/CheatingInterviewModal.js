import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const CheatingInterviewModal = ({
  isCheatingModalOpen,
  onCloseCheatingModal,
}) => {
  return (
    <>
      <Modal
        isOpen={isCheatingModalOpen}
        onClose={onCloseCheatingModal}
        size="xl"
        className=""
        hideCloseButton
      >
        <ModalContent>
          <>
            <ModalHeader className="pb-0">
              <p className="text-slate-600">Cheating Detected!</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-md text-slate-500 p-0">
                You have switched tabs multiple times. The interview will now
                close.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                size="sm"
                onClick={onCloseCheatingModal}
                className="text-sm rounded-md font-medium mt-2 bg-blue-600"
              >
                Close Interview
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheatingInterviewModal;
