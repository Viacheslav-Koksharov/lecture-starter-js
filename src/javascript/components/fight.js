import controls from '../../constants/controls';

const {
    PlayerOneAttack,
    PlayerOneBlock,
    PlayerTwoAttack,
    PlayerTwoBlock,
    PlayerOneCriticalHitCombination,
    PlayerTwoCriticalHitCombination
} = controls;

export function getHitPower(fighter) {
    const { attack } = fighter;
    const criticalHitChance = Math.random() * (2 - 1) + 1;
    return attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = Math.random() * (2 - 1) + 1;
    return defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return Math.max(0, damage);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const playerOne = {
            block: false,
            health: firstFighter.health,
            healthBar: document.querySelector('#left-fighter-indicator')
        };
        const playerTwo = {
            block: false,
            health: secondFighter.health,
            healthBar: document.querySelector('#right-fighter-indicator')
        };
        const criticalHitPressed = new Set();
        const CRITICAL_HIT_COOLDOWN = 10000;
        let playerOneLastCriticalHitTime = 0;
        let playerTwoLastCriticalHitTime = 0;

        function getHealthBarWidth(currentHealth, initialHealth) {
            const currentBlockWidth = (currentHealth / initialHealth) * 100;
            return currentBlockWidth > 0 ? currentBlockWidth : 0;
        }

        function winner() {
            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                resolve(playerOne.health > playerTwo.health ? firstFighter : secondFighter);
            }
        }

        function criticalHit(e) {
            if (
                PlayerOneCriticalHitCombination.includes(e.code) &&
                Date.now() - playerOneLastCriticalHitTime > CRITICAL_HIT_COOLDOWN
            ) {
                criticalHitPressed.add(e.code);
                if (criticalHitPressed.size === 3) {
                    const damage = 2 * firstFighter.attack;
                    playerTwo.health -= damage;
                    playerTwo.healthBar.style.width = `${getHealthBarWidth(playerTwo.health, secondFighter.health)}%`;
                    playerOneLastCriticalHitTime = Date.now();
                    winner();
                }
            }
            if (
                PlayerTwoCriticalHitCombination.includes(e.code) &&
                Date.now() - playerTwoLastCriticalHitTime > CRITICAL_HIT_COOLDOWN
            ) {
                criticalHitPressed.add(e.code);
                if (criticalHitPressed.size === 3) {
                    const damage = 2 * secondFighter.attack;
                    playerOne.health -= damage;
                    playerOne.healthBar.style.width = `${getHealthBarWidth(playerOne.health, firstFighter.health)}%`;
                    playerTwoLastCriticalHitTime = Date.now();
                    winner();
                }
            }
        }

        function keyDown(e) {
            if (e.code === PlayerOneAttack && !playerOne.block && !playerTwo.block) {
                playerTwo.health -= getDamage(firstFighter, secondFighter);
                playerTwo.healthBar.style.width = `${getHealthBarWidth(playerTwo.health, secondFighter.health)}%`;
                winner();
            } else if (e.code === PlayerOneBlock) {
                playerOne.block = true;
            } else if (e.code === PlayerTwoAttack && !playerTwo.block && !playerOne.block) {
                playerOne.health -= getDamage(secondFighter, firstFighter);
                playerOne.healthBar.style.width = `${getHealthBarWidth(playerOne.health, firstFighter.health)}%`;
                winner();
            } else if (e.code === PlayerTwoBlock) {
                playerTwo.block = true;
            }
            criticalHit(e);
        }

        function keyUp(e) {
            criticalHitPressed.delete(e.code);
            if (e.code === PlayerOneBlock) {
                playerOne.block = false;
            }
            if (e.code === PlayerTwoBlock) {
                playerTwo.block = false;
            }
        }

        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
    });
}
