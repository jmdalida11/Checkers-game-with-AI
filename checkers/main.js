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

    if(BOARD_DEF.move == AI && withAI){
        return;
    }

    for(let i=0; i<tiles.length; i++){
        let t = {x: tiles[i].x, y: tiles[i].y, w: tiles[i].size, h: tiles[i].size};
        if(collide(mp, t) && piecemoving != null && tiles[i] != piecemoving && tiles[i].sqr != SQR.NONE){
            let move = piecemoving.piece.move(piecemoving.sqr, tiles[i].sqr);

            if(!updatePiecesPos(piecemoving, move, i, BOARD_DEF)) break;

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

function updatePiecesPos(piecemoving, move, i, bf){
    if(!move[0]) return false;

    switch(move[1])
    {
        case MOVE_TYPE.MOVE_NORMAL:
        {
            tiles[i].piece = piecemoving.piece;
            tiles[i].piece.x = tiles[i].x;
            tiles[i].piece.y = tiles[i].y;
            tiles[i].piece.size = tiles[i].size;
            piecemoving.piece = null;
            piecemoving = null;

            updateSuperPiece(bf.rPieces, PIECE_TYPE.SUPER_RED);
            updateSuperPiece(bf.yPieces, PIECE_TYPE.SUPER_YELLOW);

            break;
        }
        case MOVE_TYPE.MOVE_CAPTURE:
        {
            tiles[i].piece = piecemoving.piece;
            tiles[i].piece.x = tiles[i].x;
            tiles[i].piece.y = tiles[i].y;
            tiles[i].piece.size = tiles[i].size;

            for(let toRemove of tiles){
                if (toRemove.sqr == move[2]){
                    toRemove.piece = null;
                    break;
                }
            }

            piecemoving.piece = null;
            piecemoving = null;

            updateSuperPiece(bf.rPieces, PIECE_TYPE.SUPER_RED);
            updateSuperPiece(bf.yPieces, PIECE_TYPE.SUPER_YELLOW);
        }
    }

    return true;
}

function updateSuperPiece(piecePos, pieceType){
    for(let tile of tiles){
        for(let rP of piecePos){
            if(BOARD_DEF.board[rP] == pieceType && tile.sqr == rP){
                tile.piece.pieceType = pieceType;
                break;
            }
        }
    }
}

canvas.onmousedown =  function(e){

    if(BOARD_DEF.move == AI && withAI){
        return;
    }

    let mp = getPos(canvas, e);

    for(let i=0; i<tiles.length; i++){
        let t = {x: tiles[i].x, y: tiles[i].y, w: tiles[i].size, h: tiles[i].size};
        if(collide(mp, t) && tiles[i].piece != null && tiles[i].sqr != SQR.NONE){

            let pTypeSuper = tiles[i].piece.pieceType == PIECE_TYPE.SUPER_RED ? PLAYER.P1 : PLAYER.P2;

            if(BOARD_DEF.move != tiles[i].piece.pieceType){
                if(pTypeSuper != BOARD_DEF.move)
                    break;
            }

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

initBoard(BOARD_DEF);
init();

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
