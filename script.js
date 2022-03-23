
window.onload = function(){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 20;
    var ctx;
    var delay = 60;
    var snaky;
    var apply;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;
    var timeOut;

    init();

    function init (){

    var canvas = document.createElement("canvas");
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

    function refreshCanvas(){

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

    function gameOver(){
        ctx.save();
        ctx.font = "bold 45px sans-serif"
        ctx.textAlign = "center"
        ctx.strokeStyle = "white";
        ctx.lineWidth = .75;
        var centreX = canvasWidth / 2;
        ctx.fillText("GAME OVER", centreX, 300);
        ctx.font = "bold 25px sans-serif"
        ctx.fillText("Press 'SPACE' to reset", centreX ,375);
        ctx.restore();
    }

    function restart(){
        snaky = new Snake([[1,14], [1,14], [1,14], [1,14]], "right");
        apply = new Apple([Math.round(Math.random() * (widthInBlocks - 1)), Math.round(Math.random() * (heightInBlocks - 1))]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 25px sans-serif"
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        var centreX = canvasWidth / 2;
        ctx.fillText("SCORE : " + score.toString(), centreX, 60);
        ctx.restore();
    }

    function drawBlock(ctx, position){

        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);

    }

    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#66B60E";
            for(var i = 0; i < this.body.length; i++){
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
            var allowedDirection;
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
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;

        }


        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }
            else{
                return false;
            }
        }


    };

    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#B5171E";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();

        }
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;

            for(var i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }


    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
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



