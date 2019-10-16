const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;
canvas.style.border = '1px solid black';

document.body.append(canvas);

const tilesize = canvas.width / 8;

const imgs = [null, new Image(), new Image()];
imgs[1].src = 'r.png';
imgs[2].src = 'y.png';

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    let colorblack = false;
    let i = 0;

    for(let r=0; r<8; r++){
        for(let c=0; c<8; c++){

            if(colorblack){
                context.fillStyle = 'black';
            }else{
                context.fillStyle = 'white';
            }
            context.fillRect(c*tilesize, r*tilesize, tilesize, tilesize);
            if(BOARD_DEF.board[sqr48[i]] == PIECE_TYPE.WHITE_PIECE && colorblack){
                context.drawImage(imgs[1], c*tilesize, r*tilesize, tilesize, tilesize);
            }else if(BOARD_DEF.board[sqr48[i]] == PIECE_TYPE.BLACK_PIECE && colorblack){
                context.drawImage(imgs[PIECE_TYPE.BLACK_PIECE], c*tilesize, r*tilesize, tilesize, tilesize);
            }
            if (colorblack) i++;
            colorblack = !colorblack;
        }
        colorblack = !colorblack;
    }

}

initBoard();

setInterval(function(){
    draw();
}, 1000)
