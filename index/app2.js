/////Classes/////
class Alien {
    constructor (hp, fp, acc, sh) {
        this.startingHull = hp; 
        this.currentHull = hp; 
        this.firepower = fp;
        this.accuracy = acc/10;
        this.startingShield = sh;
        this.currentShield = sh;
        this.index;
        this.alerts = [
            `The alien ship launches a counterattack...`,
            `It manages to dodge your attack and takes no damage.`, 
            (attacker) => `You breach its hull for ${attacker.firepower} damage, leaving ${this.currentHull} health.`,
            `You breach its hull and destroy it!`,
            `A second alien ship sneaks in an attack...`
        ]
    }
    hitOrMiss (target) {
            (Math.random() <= this.accuracy ? target.currentHull -= this.firepower : target.currentHull -= 0);
    }
    updateStartingHall () {
        this.startingHull = this.currentHull; 
    }
    attack (arr, target) {
        this.hitOrMiss(target);
        alert(this.alerts[0]);
        target.currentHull === target.startingHull ? target.dodgeAttack(arr, this) : (target.currentHull > 0 ? target.takeDamage(arr, this) : target.destroyed(arr, this));
    }
    dodgeAttack (arr, attacker) {
        alert(this.alerts[1]); 
        this.attack(arr, attacker);
    }
    takeDamage (arr, attacker) {
        alert(this.alerts[2](attacker)); 
        this.updateStartingHall();
        this.attack(arr, attacker);
    }
    destroyed (arr, target) {
        alert(this.alerts[3]); 
        this.singleOrMulti(arr, target);
        target.healthBonus(arr);  
        arr.shift(); 
        checkForBoss();
        attackOrRetreat(alienShipPrompt);
    }
    singleOrMulti (arr,target) {
       (Math.random() <= .25) && (arr.length > 1) ?  this.multiAttack(arr,target) : false; 
    }
    multiAttack (arr,target) {
        alert(arr[1].alerts[4]);
        arr[1].hitOrMiss(target);
        target.currentHull === target.startingHull ? alert(target.alerts[1]) : (target.currentHull > 0 ? alert(target.alerts[2](arr[1])) && (target.updateStartingHall()) : target.destroyed());
    } 
}

class Boss extends Alien {
    constructor (hp, fp, acc, sh) {
        super(hp, fp, acc, sh);
        this.loadinShield = sh;
        this.alerts = [
            `The alien mothership launches a counterattack...`,
            `It manages to dodge your attack and takes no damage.`, 
            (attacker) => `You breach its hull for ${attacker.firepower} damage, leaving ${this.currentHull} health.`,
            `You breach its hull and destroy it!`,
            (attacker) => `You erode its shield for ${attacker.firepower} damage, leaving ${this.currentShield} shield health.`,
            `You damage its shield and destroy it!`     
        ] 
    }
    updateStartingShield () {
        this.startingShield = this.currentShield; 
    }
    takeShieldDamage (arr, attacker) {
        alert(this.alerts[4](attacker)); 
        this.updateStartingShield();
        this.attack(arr, attacker);
    }
    shieldDestroyed () {
        alert(this.alerts[5]); 
        this.updateStartingShield();
        this.currentShield = 0; 
        attackOrRetreat(alienBossPrompt);
    }
    destroyed (arr) {
        alert(this.alerts[3]); 
        arr.shift(); 
        endGame();
    }
}

class Uss extends Alien {
    constructor (hp, fp, acc) {
        super(hp, fp, acc);
        this.alerts = [
            `You take aim at the alien ship...`,
            `You successfully dodge the attack and take no damage!`, 
            (attacker) => `Your hull is breached for ${attacker.firepower} damage, leaving ${this.currentHull} health.`,
            `Your hull is breached, destroying your ship.`,
            `Your hull has been repaired for 1 health.`
        ]
    }
    attack (arr, target) {
        this.hitOrMiss(target);
        alert(this.alerts[0]);
        target.startingShield > 0 ?
            (target.currentShield === target.startingShield ? target.dodgeAttack(arr,this) : (target.currentShield > 0 ? target.takeShieldDamage(arr,this) : target.shieldDestroyed(arr,this))) :
            (target.currentHull === target.startingHull ? target.dodgeAttack(arr,this) : (target.currentHull > 0 ? target.takeDamage(arr,this) : target.destroyed(arr,this)));
    }
    hitOrMiss (target) {
        target.startingShield > 0 ? 
            (Math.random() <= this.accuracy ? target.currentShield -= this.firepower : target.currentShield -= 0) :
            (Math.random() <= this.accuracy ? target.currentHull -= this.firepower : target.currentHull -= 0);
    }
    destroyed () {
        alert(this.alerts[3]); 
        endGame();
    }
    retreat (target) {
        let userChoice = prompt(`Are you sure you want to retreat? Doing so will end the game...`,`yes/no`);
        while ((userChoice !== 'yes') && (userChoice !== 'no')) {
            userChoice = prompt(`Please type either "yes" or "no".`,`yes/no`);
         }
        userChoice === `yes` ? endGame() : (target.loadinShield > 0 ? attackOrRetreat(alienBossPrompt) : attackOrRetreat(alienShipPrompt));  
    }
    healthBonus (arr) {
        arr.length !== startingFleetSize ? (Math.random() <= .5 ? (this.currentHull += 1) && alert(this.alerts[4]) : this.currentHull += 0) : false;  
    }
}

/////Prompt Functions/////
const alienShipPrompt = () => prompt(`[Current Health: ${ussSchwarzenegger.currentHull}] [Target's Health: ${alienFleet[0].currentHull}] [Enemies Remaining: ${alienFleet.length}]
    \nDo you want to attack the ${firstNextLast()} alien ship?`,`attack/retreat`);
const alienBossPrompt = () => prompt(`[Current Health: ${ussSchwarzenegger.currentHull}] [Target's Shield: ${alienFleet[0].currentShield}] [Target's Health: ${alienFleet[0].currentHull}]
    \nDo you want to attack the alien mothership?`,`attack/retreat`);
const firstNextLast = () => {
    return alienFleet.length === startingFleetSize ? `first` : (alienFleet.length > 1 ? `next` : `last`); 
}
const attackOrRetreat = (prompt) => {
    let userChoice = prompt();
    while ((userChoice !== `attack`) && (userChoice !== `retreat`)) {
        userChoice = prompt(`Please type either "attack" or "retreat".`,`attack/retreat`);
    }
    userChoice === `attack` ? ussSchwarzenegger.attack(alienFleet, alienFleet[0]) : ussSchwarzenegger.retreat(alienFleet[0]);  
}
const win = () => alert(`You've destroyed the entire enemy fleet and emerge victorious!`);
const draw = () => alert(`The enemy fleet manages to fend off your attack...for now.`);
const lose = () => alert(`The enemy fleet emerges victorious...a valient defeat.`)

/////Initialization Functions/////
const startGame = () => {
    setDifficulty();
    alert(`Now entering interstellar space...`);
    alert(`Enemy ships approaching!`)
    attackOrRetreat(alienShipPrompt);
}
const checkForBoss = () => {
    alienFleet.length === 0 ? spawnBoss() : false;    
}
const endGame = () => {
    alienFleet.length === 0 ? win() : (ussSchwarzenegger.currentHull > 0 ? draw() : lose());
    let userChoice = prompt(`Do you want to play again?`,`yes/no`);
    while ((userChoice !== 'yes') && (userChoice !== 'no')) {
        userChoice = prompt(`Please type either "yes" or "no".`,`yes/no`);
     }
    alienFleet.shift();
    userChoice === `yes` ? window.location.reload(true) : alert(`Thank you for playing!`);  
}
const random = (min, max) => {
    return Math.round(Math.random() * (max - min) + min); 
 }   

/////Class Instances/////
let ussSchwarzenegger = new Uss (20, 5, 7.5);
let alienBoss = new Boss (6,4,8,6);
let alienFleet = [];
let userDifficulty;
let startingFleetSize;
const setDifficulty = () => {
    let userChoice = prompt(`Please select a difficulty level`,`novice/expert`);
    while ((userChoice !== `novice`) && (userChoice !== `expert`)) {
        userChoice = prompt(`Please type either "novice" or "expert".`,`novice/difficult`);
     }
    userChoice === `novice` ? userDifficulty = 6 : userDifficulty = 12;  
    for (let i = 0; i < userDifficulty; i ++) { 
        let alienShip = new Alien (random(3,6), random(2,4), random(6,8), 0);
        alienFleet.push(alienShip);
    } 
    startingFleetSize = alienFleet.length;
}

const spawnBoss = () => {
    alienFleet.push(alienBoss);
    alert(`The alien mothership emerges...`); 
    attackOrRetreat(alienBossPrompt);  
}

/////Initialize/////
setTimeout(startGame, 3000);
