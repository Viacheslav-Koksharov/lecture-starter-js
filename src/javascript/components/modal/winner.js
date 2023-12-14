import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const { source, name } = fighter;
    const bodyElement = createElement({ tagName: 'div', className: 'winner-box' });
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const fighterImage = createElement({
        tagName: 'img',
        className: 'winner-image',
        attributes
    });

    bodyElement.append(fighterImage);

    showModal({
        title: `${name} is the winner!`,
        bodyElement,
        onClose: () => document.location.reload()
    });
}
