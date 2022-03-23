
window.onload = function(){

    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 20;
    const ctx;
    const delay = 60;
    let snaky;
    const apply;
    let widthInBlocks = canvasWidth / blockSize;
    let heightInBlocks = canvasHeight / blockSize;
    let score;
    let timeOut;

    init();

    const init = () => {

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "10px solid #A47040";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#DAC9AC";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snaky = new Snake([[1,14], [1,14], [1,14], [1,14]], "right");
    apply = new Apple([Math.round(Math.random() * (widthInBlocks - 1)), Math.round(Math.random() * (heightInBlocks - 1))]);
    score = 0;
    refreshCanvas();
    }

    const refreshCanvas = () => {

        snaky.advance();
        if(snaky.checkCollision()){
            gameOver();
        }
        else{
            if(snaky.isEatingApple(apply)){
                score++;
                snaky.ateApple = true;
                do{
                    apply.setNewPosition();
                }
                while(apply.isOnSnake(snaky))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snaky.draw();
            apply.draw();
            timeOut = setTimeout(refreshCanvas, delay);
        }
    }

    const gameOver = () => {
        ctx.save();
        ctx.font = "bold 45px sans-serif"
        ctx.textAlign = "center"
        ctx.strokeStyle = "white";
        ctx.lineWidth = .75;
        let centreX = canvasWidth / 2;
        ctx.fillText("GAME OVER", centreX, 300);
        ctx.font = "bold 25px sans-serif"
        ctx.fillText("Press 'SPACE' to reset", centreX ,375);
        ctx.restore();
    }

    const restart = () => {
        snaky = new Snake([[1,14], [1,14], [1,14], [1,14]], "right");
        apply = new Apple([Math.round(Math.random() * (widthInBlocks - 1)), Math.round(Math.random() * (heightInBlocks - 1))]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    const  drawScore = () => {
        ctx.save();
        ctx.font = "bold 25px sans-serif"
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        let centreX = canvasWidth / 2;
        ctx.fillText("SCORE : " + score.toString(), centreX, 60);
        ctx.restore();
    }

    const drawBlock = (ctx, position) => {

        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);

    }

    const Snake = (body, direction) => {

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#66B60E";
            for(let i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }

            ctx.restore();

        };
        this.advance = function(){

            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();
            }
            else{
                this.ateApple = false
            }

        }

        this.setDirection = function(newDirection){
            let allowedDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            };
        };


        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }

            for(let i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;

        }


        this.isEatingApple = function(appleToEat){
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }
            else{
                return false;
            }
        }


    };

    const Apple = (position) => {
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#B5171E";
            ctx.beginPath();
            let radius = blockSize / 2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();

        }
        this.setNewPosition = function(){
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;

            for(let i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }


    document.onkeydown = function handleKeyDown(e){
        let key = e.keyCode;
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left"
                break;
            case 38:
                newDirection = "up"
                break;
            case 39:
                newDirection = "right"
                break;
            case 40:
                newDirection = "down"
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snaky.setDirection(newDirection);
    }

};



