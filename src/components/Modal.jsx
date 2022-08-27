import styled from 'styled-components';
import PropTypes from 'prop-types';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1200;
`;

const ModalWindow = styled.div`
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 24px);
`;

const Modal = ({ item, closeModal }) => {
  return (
    <Overlay onClick={closeModal}>
      <ModalWindow>
        <img src={item} alt="" />
      </ModalWindow>
    </Overlay>
  );
};

Modal.propTypes = {
  item: PropTypes.string,
  closeModal: PropTypes.func,
};

export default Modal;
