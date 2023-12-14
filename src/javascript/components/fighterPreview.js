import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const { source, _id, ...skills } = fighter;
        const attributes = { src: source };
        const fighterImage = createElement({
            tagName: 'img',
            className: `fighter-preview___root ${positionClassName}`,
            attributes
        });
        if (position === 'right') {
            fighterImage.style.transform = 'scale(-1, 1)';
        }

        const fighterSkills = Object.keys(skills).map(key => {
            const fighterSkillsList = document.createElement('div');
            fighterSkillsList.append(key, skills[`${key}`]);
            return fighterSkillsList;
        });

        fighterElement.append(...fighterSkills, fighterImage);
    }
    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
