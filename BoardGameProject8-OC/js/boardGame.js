
(async () =>{
    /*======= Variables initialisations ===================*/
    let tr;
    let td;
    let deployment;
    let warrior1Div;
    let warrior2Div;
    let body;
    let counter = 1;
    let warriorTurn;
    let firstRound;
    let prevPos;
    let newPos;

    /*============ Building up the rows and columns of the board ==============*/

    rowNum = 10;
    columNum = 10;
    cellsNum = rowNum * columNum;
    const stoneNum = (cellsNum * 12) / 100;
    const cellsWidth = window.innerWidth - (window.innerWidth * 10/100);
    const cellsHeight = window.innerHeight - (window.innerHeight * 15/100);
    const stoneControl = [];
    const weaponControl = [];
    let approvedMove = [];

    /*=========== Weapon store and the messages that ask to enter players names ===============*/

    const weaponStore = ['knife', 'star', 'star2', 'tool'];


    const message1 = await swal( {
        title:"Enter the name of the first player",
        content: "input",

    });
    
    const message2 = await swal({
        title:"Enter  the name of the second player",
        content: "input",

    });



    player1 = new Warrior( message1, 'sword', 100, 'infoPlayer1', 0,'warrior1Div','warrior1', false );

    player2 = new Warrior( message2, 'sword', 100, 'infoPlayer2', 0, 'warrior2Div', 'warrior2', false);

    /*=========== body cells ===============*/

    body = document.getElementsByTagName('body');
    body[0].style.width = cellsWidth + 'px';
    body[0].style.height = cellsHeight + 'px';

    /*=========== Set up the board actions to false ===============*/

    for(let i = 1; i <= cellsNum; i++){
        stoneControl[i] = false;
        weaponControl[i] =false;
        approvedMove[i] = false;
    }
    /*=========== building up board Game on html page ===============*/

    for(let i = 0; i < rowNum; i++){
        tr = document.createElement('tr');
        for(let j = 0; j < columNum; j++){
            td = document.createElement('td');
            td.id = counter;
            counter++;
            tr.appendChild(td);
        }
        document.getElementById('boardGame').appendChild(tr);
    }
    /*=========== Building up the inaccessible cells and update the board===============*/

    for(let i = 0; i < stoneNum; i++){
        deployment = Math.floor(Math.random() * cellsNum) + 1;
        if (stoneControl[deployment]) {
            i--;
          

        } else {
            document.getElementById(deployment).className = "inaccessible";
            stoneControl[deployment] = true;// board update.
        }
    }

    /*=========== building up weapon movement and update the board  ===============*/

    for(let i = 0; i < 4; i++){
        deployment = Math.floor(Math.random() * cellsNum) + 1;
        if (!(!stoneControl[deployment] && !weaponControl[deployment])) {
            i--;
        } else {
            document.getElementById(deployment).className = weaponStore[i];
            weaponControl[deployment] = true;
        }
    }

    /*=========== building up the players and their movement by showing the weapon are currying on  ===============*/

    for( let i = 0; i < 2; i++){
        deployment = Math.floor(Math.random() * cellsNum) + 1;
        if (!(!stoneControl[deployment] && !weaponControl[deployment])) {
            i--;

        } else {
            if (!i) {
                document.getElementById(deployment).style.background =`url('img/${player1.img}.png') no-repeat 0 0/100% 100%, url('img/${player1.weapon}.png') no-repeat 0 0/100% 100%`;
                player1.colIdWarrior = deployment;
            } else {
                if ((deployment + 1) !== player1.colIdWarrior && (deployment - 1) !== player1.colIdWarrior && (deployment + 10) !== player1.colIdWarrior && (deployment - 10) !== player1.colIdWarrior) {
                    document.getElementById(deployment).style.background = `url('img/${player2.img}.png') no-repeat 0 0/100% 100%, url('img/${player2.weapon}.png') no-repeat 0 0/100% 100%`;
                    player2.colIdWarrior = deployment;
                } else {
                    i--;
                    continue;
                }
            }
        }
        stoneControl[deployment] = true;
    }

    /*=========== Reference player information  ===============*/

    player1.warriorInfo();
    player2.warriorInfo();

    /*=========== Building up the warrior and his actions and the movements that will be ordered by the keyboard keys, UP, DOWN,LEFT AND RIGHT ===============*/

    function Warrior( name, weapon, life, pText, colIdWarrior, warriorId, img, guard){
        this.name = name;
        this.weapon = weapon;
        this.life = life;
        this.pText = "."+ pText;
        this.colIdWarrior = colIdWarrior;
        this.warriorId = warriorId;
        this.img = img;
        this.guard = guard;

        /*=========== warrior information including name, weapon  name that can be replaceable and the life status  ===============*/

        this.warriorInfo = function(){
            const warriorDetails = [
                document.createTextNode(this.name),
                document.createTextNode(this.weapon.replace(/_/g, " ")),
                document.createTextNode(this.life)
            ];

            const text = document.querySelectorAll(this.pText);
            const size = text.length;
            for(let i = 0; i < size; i++){
                if(text[i].childNodes[1]){ //if nodes are available
                    text[i].replaceChild(warriorDetails[i],
                        text[i].childNodes[1]);
                }//if not available
                text[i].appendChild(warriorDetails[i]);
            }
        };

        /*===========  Warrior movements ===============*/

        this.warriorMove = function(approvedMove, direction){
            if (direction === 'left') {
                prevPos = this.colIdWarrior;
                newPos = prevPos - 1;
                if (approvedMove[newPos]) {
                    warriorUpdate(prevPos, newPos, '100%', '100%', this);
                    this.colIdWarrior--;
                }
            } else if (direction === 'right') {
                prevPos = this.colIdWarrior;
                newPos = prevPos + 1;
                if (approvedMove[newPos]) {
                    warriorUpdate(prevPos, newPos, '100%', '-3%', this);
                    this.colIdWarrior++;
                }
            } else if (direction === 'up') {
                prevPos = this.colIdWarrior;
                newPos = prevPos - columNum;
                if (approvedMove[newPos]) {
                    warriorUpdate(prevPos, newPos, '0', '2%', this);
                    this.colIdWarrior -= 10;
                }
            } else if (direction === 'down') {
                prevPos = this.colIdWarrior;
                newPos = prevPos + columNum;
                if (approvedMove[newPos]) {
                    warriorUpdate(prevPos, newPos, '0', '100%', this);
                    this.colIdWarrior += 10;
                }
            } else {
                console.log('default  warriorMove');
            }
        };
        /*=========== warrior fight ===============*/

        this.warriorAttack = ( warriorAttack, weapon) => {
            if (weapon === 'sword') {
                if (warriorAttack.guard) {
                    warriorAttack.life -= 5;
                } else {
                    warriorAttack.life -= 10;
                }
            } else if (weapon === 'knife') {
                if (warriorAttack.guard) {
                    warriorAttack.life -= 10;
                } else {
                    warriorAttack.life -= 20;
                }
            } else if (weapon === 'star') {
                if (warriorAttack.guard) {
                    warriorAttack.life -= 15;
                } else {
                    warriorAttack.life -= 30;
                }
            } else if (weapon === 'star2') {
                if (warriorAttack.guard) {
                    warriorAttack.life -= 20;
                } else {
                    warriorAttack.life -= 40;
                }
            } else if (weapon === 'tool') {
                if (warriorAttack.guard) {
                    warriorAttack.life -= 25;
                } else {
                    warriorAttack.life -= 50;
                }
            } else {
            }
        }
    }
    /*===========  warrior updates and and it;s movement on the board,
    *** prevPos = previous position ***
    *** newPos = new position ***
    ===============*/

    function warriorUpdate(prevPos, newPos, x, y, warrior){
        document.getElementById(prevPos).style.background = '';// removing the image on the previous position
        document.getElementById(newPos).style.background = `url('img/${warrior.img}.png') no-repeat ${x} ${y}/100% 100%, url('img/${warrior.weapon}.png') no-repeat 0 0/100% 100%`;
        stoneControl[newPos] = true;
        stoneControl[prevPos] = false;
    }
    /*=========== building up the players,inaccessible cells positions and initialise the positions limit
    * then set allowed movement to false online 211 and to true on next line
    * conditions for all 4 positions to check if there is non warrior or stones
    * at minimum of 1 and maximum of 100. which is the size of the board, reference online 16. ===============*/

    function endMove(position){
        const maxLeft = position -3;
        const maxRight = position +3;
        const maxUp = position - 30;
        const maxDown = position + 30;
        approvedMove = [];
        approvedMove[position] = true;
        for(let i = position - 1; i >= maxLeft; i--){
            if(!stoneControl[i] && i > 0 && i <= 100 && !((i % 10) === 0)){
                document.getElementById(i).classList.add('permission');
                approvedMove[i] = true;
            } else {
                break;
            }
        }

        for(let i = position + 1; i <= maxRight; i++){
            if(!stoneControl[i] && i > 0 && i <= 100 && !((i % 10) === 1)){
                document.getElementById(i).classList.add('permission');
                approvedMove[i] = true;
            } else {
                break;
            }
        }
        for(let i = position - 10; i >= maxUp; i -= 10){
            if(!stoneControl[i] && i > 0 && i <= 100){
                document.getElementById(i).classList.add('permission');
                approvedMove[i] = true;
            } else{
                break;
            }
        }
        for(let i = position + 10; i <= maxDown; i += 10){
            if(!stoneControl[i] && i > 0 && i <= 100){
                document.getElementById(i).classList.add('permission');
                approvedMove[i] = true;
            } else {
                break;
            }
        }


    }
    /*================= Update the Board for approved movements and the player and it's weapon on move,
     * on the active cells where the player is located can change the weapon or keep the one he has =================*/

    function updateBoard(player, approvedMove){
        let activeCell;
        for(let i = 1; i <= 100; i++){
            activeCell = document.getElementById(i);
            if(approvedMove[i]){
                activeCell.classList.remove('permission');
            }
            if(i === player.colIdWarrior){
                if (activeCell.className === 'knife') {
                    activeCell.classList.remove('knife');
                    activeCell.classList.add(player.weapon);
                    player.weapon = 'knife';
                } else if (activeCell.className === 'star') {
                    activeCell.classList.remove('star');
                    activeCell.classList.add(player.weapon);
                    player.weapon = 'star';
                } else if (activeCell.className === 'star2') {
                    activeCell.classList.remove('star2');
                    activeCell.classList.add(player.weapon);
                    player.weapon = 'star2';
                } else if (activeCell.className === 'tool') {
                    activeCell.classList.remove('tool');
                    activeCell.classList.add(player.weapon);
                    player.weapon = 'tool';
                } else if (activeCell.className === 'sword') {
                    activeCell.classList.remove('sword');
                    activeCell.classList.add(player.weapon);
                    player.weapon = 'sword';
                } else {
                }

                activeCell.style.backgroundImage = `url('img/${player.img}.png'), url('img/${player.weapon}.png')`;
            }
        }
    }

    /*============== Building up the warrior display so that we will know who is next to play or who is playing in that current time
    * we set up the warrior to zero then give it how to behave by conditions ================*/

    function displayWarriorTurn(warrior){
        warrior1Div.className = '';
        warrior2Div.className = '';
        if(warrior === 'warrior1'){
            warrior1Div.className = 'off';
            warrior2Div.className = 'on';
        } else {
            warrior2Div.className = 'off';
            warrior1Div.className = 'on';
        }
    }
    /*======Building up the display of the player so that we can know whi is playing and who is not.==========*/

    firstRound = Math.floor(Math.random() * 2) + 1;
    if(firstRound === 1){
        $('#warriorDiv2').fadeTo(600, 0.5);
        warriorTurn = false;
        endMove(player1.colIdWarrior);
        warrior2Div = document.getElementById(player2.warriorId);
        warrior2Div.className = 'off';

        warrior1Div = document.getElementById(player1.warriorId);
        warrior1Div.className = 'on';
    } else if(firstRound === 2){
        $('#warriorDiv1').fadeTo(600, 0.5);
        warriorTurn = true;
        endMove(player2.colIdWarrior);
        warrior1Div = document.getElementById(player1.warriorId);
        warrior1Div.className = 'off';
        warrior2Div = document.getElementById(player2.warriorId);
        warrior2Div.className = 'on';
    }
    /*==============Building up keyboard functionality for 4 positions based on
    * key codes left: 37, up: 38, right: 39, down: 40 reference: https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript=========*/

    $(() => {
        $(document).keydown(event =>{
            if (event.which === 37) {
                if (warriorTurn) {
                    player2.warriorMove(approvedMove, 'left');
                } else {
                    player1.warriorMove(approvedMove, 'left');
                }
            } else if (event.which === 39) {
                if (warriorTurn) {
                    player2.warriorMove(approvedMove, 'right');
                } else {
                    player1.warriorMove(approvedMove, 'right');
                }
            } else if (event.which === 38) {
                if (warriorTurn) {
                    player2.warriorMove(approvedMove, 'up');
                } else {
                    player1.warriorMove(approvedMove, 'up');
                }
            } else if (event.which === 40) {
                if (warriorTurn) {
                    player2.warriorMove(approvedMove, 'down');
                } else {
                    player1.warriorMove(approvedMove, 'down');
                }
            } else if (event.which === 13) { // enter key
                if (warriorTurn) { // warrior 2 turn
                    $('#warrior1Div').fadeTo(600);
                    $('#warrior2Div').fadeTo(600);

                    displayWarriorTurn(player2.img);

                    warriorTurn = false;
                    updateBoard(player2, approvedMove);
                    player2.warriorInfo();
                    fightDescription(player1, player2);

                    player1.warriorInfo();
                    endMove(player1.colIdWarrior);
                } else { //warrior 1 turn
                    $('#warriorDiv2').fadeTo(600);
                    $('#warriorDiv1').fadeTo(600);
                    displayWarriorTurn(player1.img);
                    warriorTurn = true;
                    updateBoard(player1, approvedMove);
                    player1.warriorInfo();
                    fightDescription(player2, player1);
                    player2.warriorInfo();
                    endMove(player2.colIdWarrior);
                }
            } else {
            }
        })
    });

    /*=================Building up fighting moment and checking their positions for fighting  ===============*/

    function fightDescription(loser, attacker){
        if (loser.colIdWarrior === attacker.colIdWarrior - 1 && (attacker.colIdWarrior - 1)
            % columNum !== 0 || loser.colIdWarrior === attacker.colIdWarrior + 1 && attacker.colIdWarrior
            % columNum !== 0 || loser.colIdWarrior === attacker.colIdWarrior - columNum ||
            loser.colIdWarrior === attacker.colIdWarrior + columNum && !attacker.guard) {

            swal(`Player ${attacker.name} attack ${loser.name}`);
            attacker.warriorAttack(loser, attacker.weapon);

            loser.guard = swal( {
                title:`Player ${loser.name}`,
                text:` Attack or  Defend your self?`,
                buttons: ["Attack", "Defend"],

            });
            endOfFight(loser);


        }
    }

    /*===== End of fight and back to replay  =========*/

    function endOfFight(player) {
        if (player.life <= 0) {
            player.warriorInfo();
            swal({
                title: "End Of The Game !!",
                text: `${player.name}, You lost the fight`,
                button: {
                    text:`GAME RESTART IN 3 SECS!!`,
                }

            });
            setTimeout(function(){
                location.reload();
            }, 3000)
        }
    }
})();



