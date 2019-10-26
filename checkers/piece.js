class Piece{

    constructor(x, y, size, pType){
        this.x = x;
        this.y = y;
        this.size = size;
        this.pieceType = pType;
    }

    draw(context){
        context.drawImage(imgs[this.pieceType], this.x, this.y, this.size, this.size);
    }

    mouseMove(mp){
        this.size = mp.size * 1.5;
        this.x = mp.x - this.size /2;
        this.y = mp.y - this.size /2;
    }

    move(src, target, tiles){
        return movePiece(src, target, BOARD_DEF);
    }
}