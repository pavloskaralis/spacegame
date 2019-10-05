/////Classes/////
class Alien {
    constructor (hp, fp, acc, sh) {
        this.startingHull = hp; 
        this.currentHull = hp; 
        this.firepower = fp;
        this.accuracy = acc/10;
        this.startingShield = sh;
        this.currentShield = sh;
        this.loadinShield = sh; 
        this.index;
        this.alerts = [
            `The alien ship launches a counterattack...`,
            `It manages to dodge your attack and takes no damage.`, 
            (attacker) => `You breach its hull for ${attacker.firepower} damage, leaving ${this.currentHull} health.`,
            `You breach its hull and destroy it!`,
            `A second alien ship joins in on the an attack...`,
        ]
    }
    updateStartingHall () {
        this.startingHull = this.currentHull; 
    }
    attack (target) {
        alert(this.alerts[0]);
    }
    dodgeAttack () {
        alert(this.alerts[1]); 
    }
    takeDamage (attacker) {
        alert(this.alerts[2](attacker)); 
        this.updateStartingHall();
    }
    destroyed () {
        alert(this.alerts[3]); 
    }
}

class Boss extends Alien {
    constructor (hp, fp, acc, sh) {
        super(hp, fp, acc, sh);
        this.alerts = [
            `The alien mothership launches a counterattack...`,
            `It manages to dodge your attack and takes no damage.`, 
            (attacker) => `You breach its hull for ${attacker.firepower} damage, leaving ${this.currentHull} health.`,
            `You breach its hull and destroy it!`,
            (attacker) => `You erode its shield for ${attacker.firepower} damage, leaving ${this.currentShield} shield health.`,
            `You damage its shield down to 0 health!`     
        ] 
    }
    updateStartingShield () {
        this.startingShield = this.currentShield; 
    }
    takeShieldDamage (attacker) {
        alert(this.alerts[4](attacker)); 
        this.updateStartingShield();
    }
    shieldDestroyed () {
        alert(this.alerts[5]); 
        this.updateStartingShield();
        this.currentShield = 0; 
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
            `Your hull has been repaired for 1 health.`,
            `You take aim at the alien mothership...`
        ]
    }
    attack (target) {
        target.loadinShield > 0 ? alert(this.alerts[5]) : alert(this.alerts[0]);
    }
    destroyed () {
        alert(this.alerts[3]); 
    }
    retreat () {
        game.userChoice(3,"yes","no",4,5);
    }
}

class GameLogic  {
    constructor() {
        this.ussSchwarzenegger = new Uss (20, 5, 7.5);
        this.alienBoss = new Boss (6,4,8,6); 
        this.alienFleet = []; 
        this.userDifficulty;
        this.startingFleetSize; 
        this.target; 
        this.attacker;  
        this.messages = [
            () => `Please select a difficulty level.`, //0
            () => `[Current Health: ${this.ussSchwarzenegger.currentHull}] [Target's Health: ${this.alienFleet[0].currentHull}] [Enemies Remaining: ${this.alienFleet.length}],
                \nDo you want to attack the ${this.changeMessages1()} alien ship?`, //1
            () => `[Current Health: ${this.ussSchwarzenegger.currentHull}] [Target's Shield: ${this.alienFleet[0].currentShield}] [Target's Health: ${this.alienFleet[0].currentHull}] 
                \nDo you want to attack the alien mothership?`, //2
            () => `Are you sure you want to retreat? Doing so will end the game...`, //3
            () => `You've destroyed the entire enemy fleet and emerge victorious!`, //4
            () => `The enemy fleet manages to fend off your attack...for now.`, //5
            () => `The enemy fleet emerges victorious...a valient defeat.`, //6
            () => `Thank you for playing!`,  //7
            () => `Do you want to play again?`, //8
            () => `The alien mothership emerges...` //9
        ];   
        this.outcomes = [
        //difficulty?
            () => this.userDifficulty = 6,  //0
            () => this.userDifficulty = 12, //1
        //attack or retreat?
            () => {this.hitOrMiss(this.alienFleet[0],this.ussSchwarzenegger);this.ussSchwarzenegger.attack(this.alienFleet[0]); this.ussAttackResult()},   //2
            () => this.ussSchwarzenegger.retreat(),   //3
        //are you sure you want to retreat?
            () => this.endGame(),    //4
            () => this.alienFleet[0].loadinShield > 0 ? this.userChoice(2,"attack","retreat",2,3) : this.userChoice(1,"attack","retreat",2,3),  //5
        //play again?
            () => {this.alienFleet.shift(); window.location.reload(true)}, //6
            () => {this.alienFleet.shift();this.returnAlert(this.messages[7]())}, //7
        //alien moves
            () => {this.alienFleet[0].dodgeAttack(); this.enemyCounterAttack()}, //8
            () => {this.alienFleet[0].takeDamage(this.ussSchwarzenegger); this.enemyCounterAttack()}, //9
            () => {this.alienFleet[0].destroyed(); this.randomHealthBonus(); this.checkIfBossDefeated()}, //10
        //uss moves
            () => {this.ussSchwarzenegger.dodgeAttack();this.randomEnemySneakAttack(); this.ussCounterAttack()},//11
            () => {this.ussSchwarzenegger.takeDamage(this.alienFleet[0]);this.randomEnemySneakAttack(); this.ussCounterAttack()}, //12
            () => {this.ussSchwarzenegger.destroyed(); this.endGame()}, //13
        /////sneak attacks
            () => alert(this.ussSchwarzenegger.alerts[1]), //14
            () => {alert(this.ussSchwarzenegger.alerts[2](this.alienFleet[1])); this.ussSchwarzenegger.updateStartingHall()}, //15
        /////end game /////
            () => this.returnAlert(this.messages[4]()), //16
            () => this.returnAlert(this.messages[5]()), //17
            () => this.returnAlert(this.messages[6]()), //18
        /////attack boss moves///// 
            () => {this.alienFleet[0].takeShieldDamage(this.ussSchwarzenegger); this.enemyCounterAttack()}, //19
            () => {this.alienFleet[0].shieldDestroyed(this.ussSchwarzenegger); this.userChoice(2,"attack","retreat",2,3);}, //20
        ]
    }
///// Class Interactions /////
    alienAttackResult () {
        this.ussSchwarzenegger.currentHull === this.ussSchwarzenegger.startingHull ? 
            this.outcomes[11]() : 
            (this.ussSchwarzenegger.currentHull > 0 ? this.outcomes[12]() : this.outcomes[13]());
    }
    ussAttackResult () {
        this.alienFleet[0].startingShield > 0 ?
            this.ussAttackResultShield() : 
        this.alienFleet[0].currentHull === this.alienFleet[0].startingHull ? 
            this.outcomes[8]() : 
            (this.alienFleet[0].currentHull > 0 ? this.outcomes[9]() : this.outcomes[10]());
    }
    ussAttackResultShield () {
        this.alienBoss.currentShield === this.alienBoss.startingShield ? 
            this.outcomes[8]() : 
            ((this.alienBoss.currentShield > 0) ? this.outcomes[19]() : this.outcomes[20]());
    }
    enemyCounterAttack () {
        this.hitOrMiss(this.ussSchwarzenegger,this.alienFleet[0]);
        this.alienFleet[0].attack(this.ussSchwarzenegger);
        this.alienAttackResult();  
    }
    ussCounterAttack () {
        this.hitOrMiss(this.alienFleet[0],this.ussSchwarzenegger);
        this.ussSchwarzenegger.attack(this.alienFleet[0]);
        this.ussAttackResult();
    }
    enemySneakAttack () {
        alert(this.alienFleet[1].alerts[4]);
        this.hitOrMiss(this.ussSchwarzenegger,this.alienFleet[1]);
        this.ussSchwarzenegger.currentHull === this.ussSchwarzenegger.startingHull ? 
           this.outcomes[14]() : 
           (this.ussSchwarzenegger.currentHull > 0 ? this.outcomes[15]() : this.outcomes[13]());
    } 
////Class Creation/Removal Methods/////
    spawnAliens () {
        for (let i = 0; i < this.userDifficulty; i ++) { 
            let alienShip = new Alien (this.randomAlienProps(3,6), this.randomAlienProps(2,4), this.randomAlienProps(6,8), 0);
            this.alienFleet.push(alienShip);
        } 
        this.startingFleetSize = this.alienFleet.length;
    }
    spawnBoss () {
        this.alienFleet.push(this.alienBoss);
        this.returnAlert(this.messages[9]());
        this.userChoice(2,"attack","retreat",2,3);
    }
    removeEnemy () {
        this.alienFleet.shift(); 
        this.checkIfAliensDefeated();
        this.userChoice(1,"attack","retreat",2,3);
    } 
/////Randomizer Methods/////
    hitOrMiss (target,attacker) {
        target.startingShield > 0 ? 
            (Math.random() <= attacker.accuracy ? target.currentShield -= attacker.firepower : target.currentShield -= 0) :
            (Math.random() <= attacker.accuracy ? target.currentHull -= attacker.firepower : target.currentHull -= 0);
    }
    randomAlienProps (min, max) {
        return Math.round(Math.random() * (max - min) + min); 
    }   
    randomEnemySneakAttack () {
        (Math.random() <= .4) && (this.alienFleet.length > 1) ?  this.enemySneakAttack() : false; 
     }
    randomHealthBonus () {
        this.alienFleet.length !== this.startingFleetSize ? (Math.random() <= .7 ? 
            (this.ussSchwarzenegger.currentHull += 1) && alert(this.ussSchwarzenegger.alerts[4]) : 
            this.ussSchwarzenegger.currentHull += 0) : false;  
    }
/////Messaging Methods////
    userChoice (messagesIndex,choice1,choice2,outcomeIndex1,outcomeIndex2) {
        let userChoice = this.returnPrompt(this.messages[messagesIndex](),choice1,choice2);
        while ((userChoice !== choice1) && (userChoice !== choice2)) {
            userChoice = prompt(`Please type either ${choice1} or ${choice2}.`,`${choice1}/${choice2}`);
        }
        return userChoice === choice1 ? this.outcomes[outcomeIndex1]() : this.outcomes[outcomeIndex2](); 
    }
    returnPrompt (messagesProperty,choice1,choice2) {
        return prompt(messagesProperty,`${choice1}/${choice2}`);
    }  
    returnAlert (messagesProperty) {
        return alert(messagesProperty);
    } 
    changeMessages1 () {
        return this.alienFleet.length === this.startingFleetSize ? `first` : (this.alienFleet.length > 1 ? `next` : `last`); 
    }
/////Game Progression Methods/////
    startGame () {
        this.userChoice(0,"novice","expert",0,1);
        this.spawnAliens();
        alert(`Now entering interstellar space...`);
        alert(`Enemy ships approaching!`)
        this.userChoice(1,"attack","retreat",2,3);
    }
    checkIfBossDefeated () {
        this.alienBoss.currentHull <= 0 ? this.endGame() : this.removeEnemy();
    }
    checkIfAliensDefeated () {
        this.alienFleet.length === 0 ? this.spawnBoss() : false;    
    }
    endGame () {
        this.alienBoss.currentHull <= 0 ? 
            this.outcomes[16]() : 
            (this.ussSchwarzenegger.currentHull > 0 ? this.outcomes[17]() : this.outcomes[18]());
        this.userChoice(8,"yes","no",6,7);
    }   
}

//////Start Game/////
const game = new GameLogic; 
setTimeout(()=>game.startGame(), 3000);
