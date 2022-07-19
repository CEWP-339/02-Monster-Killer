const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = ATTACK_VALUE * 2;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_VALUE = 20;
const ATTACK_MODE = 'ATTACK';
const STRONG_ATTACK_MODE = 'STRONG_ATTACK';

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let enteredNumber = prompt('Enter the maximum life for you and the monster!', '100');
let chosenMaxLife = parseInt(enteredNumber);

let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeLog(ev, value, monsterHealth, playerHealth) {
    let logEntry = {
        ev, //translated as ev: ev
        value, //translated as value: value
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    }

    // if (ev === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry.target = "MONSTER";
    // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry.target = "MONSTER";
    // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry.target = "PLAYER";
    // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry.target = "PLAYER";
    // } // else if (ev === LOG_EVENT_GAME_OVER) {
    // // }

    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK: 
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = "PLAYER";
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "PLAYER";
            break;
        case LOG_EVENT_GAME_OVER:
            break;   
        default: logEntry = {};
    }


    battleLog.push(logEntry);
}

function reset () {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound () {
    let initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if (hasBonusLife && currentPlayerHealth <= 0) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would have lost but the bonus life saved you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeLog(LOG_EVENT_GAME_OVER, 'YOU WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeLog(LOG_EVENT_GAME_OVER, 'YOU LOST', currentMonsterHealth, currentPlayerHealth);
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw!");
        writeLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }

}

function attackMonster (mode) {
    let maxDamage;
    let logEvent;
    if (mode === 'ATTACK') {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === 'STRONG_ATTACK') {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    writeLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

    endRound();
}


function attackHandler () {
    attackMonster(ATTACK_MODE);
}

function strongAttackHandler () {
    attackMonster(STRONG_ATTACK_MODE);
}

function healHandler () {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than your max initial health!");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }

    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;

    writeLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);

    endRound();
}

function printLogHandler() {

    // for (let i = 0; i < 3; i++) {
    //     console.log(i);
    //     console.log('----------------------');
    // }

    let j = 0;
    while (j < 3) {
        console.log(j); //0
        console.log('----------------------');
        j++;
    }

    let k = 3;
    outerWhile: do {
        console.log('Outer While ', k);
        innerFor: for (let i = 0; i < 5; i++) {
            if (i === 3) {
                break outerWhile;
            }
            console.log('Inner For ', i);
        }
        k--;
    } while(k > 0);

    // for (let i = 10; i > 0;) {
    //     i--;
    //     console.log(i);
    // }

    // let i = 0;
    // for (const logEntry of battleLog) {
    //     console.log(`#${i} =>`);
    //     console.log(logEntry);
    //     i++;
    // }

    let i = 0;
    for (const logEntry of battleLog) {
        console.log(`#${i}`);
        for (const key in logEntry) {
            console.log(`${key} => ${logEntry[key]}`); //example: logEntry['ev']
        }
        i++;
    }

}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', printLogHandler);

