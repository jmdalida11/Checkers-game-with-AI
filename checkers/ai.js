var AI = PLAYER.P1;

function aiMove(bf){

    let bb = tempBfClone(bf);

    if(bf.availableMoves.length == 0) return;

    let depth = 10;
    let move = minmax(bb, depth, AI)[0];

    let verdict;
    if(move.capture){
        verdict = movePiece(move.src, move.target.to, bf);
    }else{
        verdict = movePiece(move.src, move.target, bf);
    }

    let mpiece = null;
    let index = null;
    for(let i=0; i<tiles.length; i++){
        if(tiles[i].sqr == move.src){
            mpiece = tiles[i];
        }

        if(move.capture){
            if(tiles[i].sqr == move.target.to) index = i;
        }else{
            if(tiles[i].sqr == move.target) index = i;
        }
    }

    updatePiecesPos(mpiece, verdict, index, bf);

}

function minmax(bf, depth, turn){

    if (depth <= 0) return evaluatePosition(bf, turn);

    if(turn == AI){

        let bestScore = -Infinity;
        let bestMove = null;

        let tempBf = tempBfClone(bf);
        for(let pieceMove of bf.availableMoves){
            let moves;
            let isCapture = false;

            if(pieceMove.moves.length > 0){
                moves = pieceMove.moves;
            }else{
                moves = pieceMove.captures;
                isCapture = true;
            }

            for(let move of moves){

                createNewNode(bf, pieceMove.piece, move, isCapture);
                let value = minmax(bf, --depth, bf.move)[1];

                if (value > bestScore){
                    bestScore = value;
                    bestMove = {src: pieceMove.piece, target: move, capture: isCapture};
                }
                bf = tempBf;
            }
        }

        return [bestMove, bestScore];

    }else{

        let bestScore = Infinity;
        let bestMove = null;

        let tempBf = tempBfClone(bf);

        for(let pieceMove of bf.availableMoves){
            let moves;
            let isCapture = false;

            if(pieceMove.moves.length > 0){
                moves = pieceMove.moves;
            }else{
                moves = pieceMove.captures;
                isCapture = true;
            }

            for(let move of moves){

                createNewNode(bf, pieceMove.piece, move, isCapture);
                let value = minmax(bf, --depth, bf.move)[1];

                if (value < bestScore){
                    bestScore = value;
                    bestMove = {src: pieceMove.piece, target: move, capture: isCapture};
                }

                bf = tempBf;
            }
        }

        return [bestMove, bestScore];

     }
}

function createNewNode(bf, src, target, isCapture){
    if(isCapture){
        movePiece(src, target.to, bf);
    }else{
        movePiece(src, target, bf);
    }
}

function evaluatePosition(bf, turn){

    let rPieceSum = 0;
    let yPieceSum = 0;

    for(let p of bf.rPieces){
        if(bf.board[p] == PIECE_TYPE.SUPER_RED){
            rPieceSum += 3;
        }else if(bf.board[p] == PLAYER.P1){
            rPieceSum++;
        }
    }

    for(let p of bf.yPieces){
        if(bf.board[p] == PIECE_TYPE.SUPER_RED){
            yPieceSum += 3;
        }else if(bf.board[p] == PLAYER.P2){
            yPieceSum++;
        }
    }

    let eval = turn == PLAYER.P1 ? rPieceSum - yPieceSum : yPieceSum - rPieceSum;
    return [null, eval];
}

function tempBfClone(bf){
    let retBoard = {};
    retBoard.board = new Array(BOARD_SIZE);
    retBoard.yPieces = [];
    retBoard.rPieces = [];
    retBoard.availableMoves = [];
    retBoard.move = bf.move;

    for(let i=0; i<BOARD_SIZE; i++){
        retBoard.board[i] = bf.board[i];
    }

    for(let i=0; i<bf.rPieces.length; i++){
        retBoard.rPieces[i] = bf.rPieces[i];
    }

    for(let i=0; i<bf.yPieces.length; i++){
        retBoard.yPieces[i] = bf.yPieces[i];
    }

    for(let i=0; i<bf.availableMoves.length; i++){
        retBoard.availableMoves[i] = bf.availableMoves[i];
    }

    return retBoard;
}