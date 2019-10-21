const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;
canvas.style.border = '1px solid black';

document.body.append(canvas);

const tilesize = canvas.width / 8;

const tiles = [];

let moving = false;
let mousepos = 0;
let piecemoving = null;

function init(){

    let colorblack = false;
    let indexOfSqr = 0;
    for(let r=0; r<8; r++){
        for(let c=0; c<8; c++){
            let p = null;
            if(colorblack){
                if(BOARD_DEF.board[sqr48[indexOfSqr]] != PIECE_TYPE.NO_PIECE)
                {
                    p = new Piece(c*tilesize, r*tilesize, tilesize, BOARD_DEF.board[sqr48[indexOfSqr]]);
                }
                tiles.push(new Tile(c*tilesize, r*tilesize, tilesize, colorblack, sqr48[indexOfSqr], p));
                indexOfSqr++;
            }else{
                tiles.push(new Tile(c*tilesize, r*tilesize, tilesize, colorblack, SQR.NONE, p));
            }
            colorblack = !colorblack;
        }
        colorblack = !colorblack;
    }

}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(let i=0; i<tiles.length; i++){
        tiles[i].draw(context);
    }

    for(let i=0; i<tiles.length; i++){
        tiles[i].drawPiece(context);
    }

}

function collide( source, target ) {
    return !(
        ( ( source.y + source.h ) < ( target.y ) ) ||
        ( source.y > ( target.y + target.h ) ) ||
        ( ( source.x + source.w ) < target.x ) ||
        ( source.x > ( target.x + target.w ) )
    );
}

canvas.onmouseup = function(e){
    moving = false;
    let mp = getPos(canvas, e);

    for(let i=0; i<tiles.length; i++){
        let t = {x: tiles[i].x, y: tiles[i].y, w: tiles[i].size, h: tiles[i].size};
        if(collide(mp, t) && piecemoving != null && tiles[i] != piecemoving && tiles[i].sqr != SQR.NONE){
            if(!piecemoving.piece.move(piecemoving.sqr, tiles[i].sqr)) break;
            tiles[i].piece = piecemoving.piece;
            tiles[i].piece.x = tiles[i].x;
            tiles[i].piece.y = tiles[i].y;
            tiles[i].piece.size = tiles[i].size;
            piecemoving.piece = null;
            piecemoving = null;
            return;
        }
    }

    if(piecemoving != null){
        piecemoving.piece.x = piecemoving.x;
        piecemoving.piece.y = piecemoving.y;
        piecemoving.piece.size = piecemoving.size;
        piecemoving = null;
    }

}

canvas.onmousedown =  function(e){
    let mp = getPos(canvas, e);

    for(let i=0; i<tiles.length; i++){
        let t = {x: tiles[i].x, y: tiles[i].y, w: tiles[i].size, h: tiles[i].size};
        if(collide(mp, t) && tiles[i].piece != null && tiles[i].sqr != SQR.NONE && BOARD_DEF.move == tiles[i].piece.pieceType){

            for(let moves of BOARD_DEF.availableMoves){
                if(tiles[i].sqr == moves.piece){
                    piecemoving = tiles[i];
                    mp.size = tilesize;
                    piecemoving.piece.mouseMove(mp);
                    moving = true;
                    break;
                }
            }
            break;
        }
    }
}

canvas.onmousemove = function(e){
    if(moving && piecemoving != null){
        let pos = getPos(canvas, e);
        pos.size = tilesize;
        piecemoving.piece.mouseMove(pos);
    }
}

function getPos(c, e){
    var rect = c.getBoundingClientRect();
    return {x:e.clientX - rect.left, y: e.clientY - rect.top, h: 1, w:1};
}

initBoard();
init();
BOARD_DEF.availableMoves = generateMove(BOARD_DEF.move);

if(DEBUG){
    var zz = document.createElement('div');
    document.body.append(zz);
}

setInterval(function(){
    if(DEBUG){
        zz.innerHTML = "";
        zz.innerHTML = printBoard();
    }

    draw();
}, 1000/60);
