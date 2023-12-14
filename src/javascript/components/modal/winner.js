import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const { name, source: src } = fighter;
    const title = `${name} is a winner! Congrats!`;
    const bodyElement = createElement({
        tagName: 'img',
        className: 'modal-body',
        attributes: { src }
    });

    showModal({ title, bodyElement, onClose: () => document.location.reload() });
}
