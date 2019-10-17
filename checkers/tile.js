class Tile{
    constructor(x, y, size, c, p=null){
        this.x = x;
        this.y = y;
        this.size = size;
        this.piece = p;
        if(c)
            this.color = 'black';
        else
            this.color = 'white';
    }

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    }

    drawPiece(context){
        if(this.piece != null){
            this.piece.draw(context);
        }
    }
}