var DEBUG = false;

const imgs = [null, new Image(), new Image()];
imgs[1].src = 'r.png';
imgs[2].src = 'y.png';

const PLAYER = {P1: 1, P2: 2};

const PIECE_TYPE = {
    NO_PIECE: 0,
    WHITE_PIECE: 1,
    BLACK_PIECE: 2
};

const SQR = {
    A1:7, A2:13, A3:19, A4:25, A5:31, A6:37, A7:43, A8:49,
    B1:8, B2:14, B3:20, B4:26, B5:32, B6:38, B7:44, B8:50,
    C1:9, C2:15, C3:21, C4:27, C5:33, C6:39, C7:45, C8:51,
    D1:10, D2:16, D3:22, D4:28, D5:34, D6:40, D7:46, D8:52,
    NONE: 0
};

const FILE = {
    FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, FILE_NONE: 4
};

const RANK = {
    RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3,
    RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7,
    RANK_NONE: 9
};

const OFF_BOARD = [
    0,1,2,3,4,5,
    6,12,18,24,30,36,42,48,54,
    11,17,23,29,35,41,47,53,59,
    55,56,57,58
];

const EVEN_RANK_SQR = [
    SQR.A2, SQR.B2, SQR.C2, SQR.D2, SQR.A4, SQR.B4, SQR.C4, SQR.D4,
    SQR.A6, SQR.B6, SQR.C6, SQR.D6, SQR.A8, SQR.B8, SQR.C8, SQR.D8
];

const ODD_RANK_SQR = [
    SQR.A1, SQR.B1, SQR.C1, SQR.D1, SQR.A3, SQR.B3, SQR.C3, SQR.D3,
    SQR.A5, SQR.B5, SQR.C5, SQR.D5, SQR.A7, SQR.B7, SQR.C7, SQR.D7
];

const SIDE_SQR = [SQR.A2, SQR.A4, SQR.A6, SQR.A8, SQR.D1, SQR.D3, SQR.D5, SQR.D7];

const BOARD_SIZE = 60;
const BOARD_DEF = {};

const sqr48 = [];

BOARD_DEF.board = new Array(BOARD_SIZE);
BOARD_DEF.move = PLAYER.P2;
BOARD_DEF.pCount = new Array(3);

BOARD_DEF.wPieces = [
    SQR.A1, SQR.B1, SQR.C1, SQR.D1,
    SQR.A2, SQR.B2, SQR.C2, SQR.D2,
    SQR.A3, SQR.B3, SQR.C3, SQR.D3
];

BOARD_DEF.bPieces = [
    SQR.A8, SQR.B8, SQR.C8, SQR.D8,
    SQR.A7, SQR.B7, SQR.C7, SQR.D7,
    SQR.A6, SQR.B6, SQR.C6, SQR.D6
];

const MOVE_TYPE = {
    MOVE_NORMAL : 0,
    MOVE_CAPTURE : 1
};

function frToSqr(f, r){
    return (7 + f) + (r * 6);
}

function initBoard(){
    for(let i=0; i<SQR.D8; i++){
        BOARD_DEF.board[i] = PIECE_TYPE.NO_PIECE;
    }

    for(let r=RANK.RANK_1; r<Object.keys(RANK).length-1; r++){
        for(let f=FILE.FILE_A; f<Object.keys(FILE).length-1; f++){
            sqr48.push(frToSqr(f, r));
        }
    }

    Object.keys(SQR).forEach(function(key) {
        if(hasPieceAt(BOARD_DEF.wPieces, SQR[key])){
            BOARD_DEF.board[SQR[key]] = PIECE_TYPE.WHITE_PIECE;

        }
        if(hasPieceAt(BOARD_DEF.bPieces, SQR[key])){
            BOARD_DEF.board[SQR[key]] = PIECE_TYPE.BLACK_PIECE;
        }
    });
}

function movePiece(src, target, tiles){
    if(BOARD_DEF.board[src] != PIECE_TYPE.NO_PIECE && BOARD_DEF.board[target] == PIECE_TYPE.NO_PIECE){
        for(let m of BOARD_DEF.availableMoves){
            if(m.piece == src && m.moves.includes(target)){
                insertPiece(src, target);
                switchPlayer();
                return [true, MOVE_TYPE.MOVE_NORMAL];
            }else if(m.piece == src && m.captures.length > 0){
                for(let capture of m.captures){
                    if(target == capture.to){
                        removePiece(capture.remove);
                        insertPiece(src, target);
                        switchPlayer();
                        let x;
                        for(let t of tiles){
                            if (t.sqr == capture.remove){
                                x = t;
                            }
                        }
                        return [true, MOVE_TYPE.MOVE_CAPTURE, x];
                    }
                }
            }
        }
    }
    return [false];
}

function removePiece(sqr){
    if(BOARD_DEF.board[sqr] == PLAYER.P1){
        BOARD_DEF.wPieces.splice(BOARD_DEF.wPieces.indexOf(sqr), 1);
    }else if(BOARD_DEF.board[sqr] == PLAYER.P2){
        BOARD_DEF.bPieces.splice(BOARD_DEF.bPieces.indexOf(sqr),1);
    }
    BOARD_DEF.board[sqr] = PIECE_TYPE.NO_PIECE;
}

function insertPiece(src, target){
    BOARD_DEF.board[target] = BOARD_DEF.board[src];
    BOARD_DEF.board[src] = PIECE_TYPE.NO_PIECE;
    if(PIECE_TYPE.WHITE_PIECE == BOARD_DEF.board[target]){
        BOARD_DEF.wPieces[BOARD_DEF.wPieces.indexOf(src)] = target;
    }else if(PIECE_TYPE.BLACK_PIECE == BOARD_DEF.board[target]){
        BOARD_DEF.bPieces[BOARD_DEF.bPieces.indexOf(src)] = target;
    }
}

function switchPlayer(){
    BOARD_DEF.move = BOARD_DEF.move == PLAYER.P1 ? PLAYER.P2 : PLAYER.P1;
    BOARD_DEF.availableMoves = generateMove(BOARD_DEF.move);
}

function generateMove(player){
    let possibleMoves = [];
    let pieceCount = 0;
    let pieces = [];

    if(player == PLAYER.P1){
        pieceCount = BOARD_DEF.wPieces.length;
        pieces = BOARD_DEF.wPieces;
    }else if(player == PLAYER.P2){
        pieceCount = BOARD_DEF.bPieces.length;
        pieces = BOARD_DEF.bPieces;
    }

    for(let i=0; i<pieceCount; i++){
        let moves = moveCount(player, pieces[i]);
        let m = {piece: pieces[i], moves: [], captures: []};

        let move1 = pieces[i] + moves[0];
        let move2 = pieces[i] + moves[1];

        if(BOARD_DEF.board[move1] == PIECE_TYPE.NO_PIECE && !inOffset(move1)){
            m.moves.push(pieces[i] + moves[0]);
        }
        if(BOARD_DEF.board[move2] == PIECE_TYPE.NO_PIECE && !inOffset(move2)){
            m.moves.push(pieces[i] + moves[1]);
        }
        if(BOARD_DEF.board[move1] != PIECE_TYPE.NO_PIECE && player != BOARD_DEF.board[move1] && !inOffset(move1)){
            let moveTemp = moveCount(player, move1);

            if(BOARD_DEF.board[move1 + moveTemp[0]] == PIECE_TYPE.NO_PIECE  && !inOffset(move1 + moveTemp[0])){
                m.captures.push({to: move1 + moveTemp[0], remove: move1});
            }
        }
        if(BOARD_DEF.board[move2] != PIECE_TYPE.NO_PIECE && player != BOARD_DEF.board[move2] && !inOffset(move2)){
            let moveTemp = moveCount(player, move2);

            if(BOARD_DEF.board[move2 + moveTemp[1]] == PIECE_TYPE.NO_PIECE  && !inOffset(move2 + moveTemp[1])){
                m.captures.push({to: move2 + moveTemp[1], remove: move2});
            }
        }

        if(m.moves.length > 0 || m.captures.length > 0)
            possibleMoves.push(m)
    }
    return possibleMoves;
}

function moveCount(player, sqr){
    if(player == PLAYER.P1){
        if(EVEN_RANK_SQR.includes(sqr)){
            return [5, 6];
        }else if(ODD_RANK_SQR.includes(sqr)){
            return [6, 7];
        }
    }
    else if(player == PLAYER.P2)
    {
        if(EVEN_RANK_SQR.includes(sqr)){
            return [-6, -7];
        }else if(ODD_RANK_SQR.includes(sqr)){
            return [-5, -6];
        }
    }
    return [0,0];
}

function inOffset(pos){
    return OFF_BOARD.includes(pos);
}

function hasPieceAt(pos, index){
    return pos.includes(index);
}

function printBoard(){
    let s = "";
    s += "<center>";
    let x = 0;
    let y = false;
   for(let i=0; i<sqr48.length*2; i++){
        if(i % 8 == 0)
        {
            s += "<br>";
            y = !y;
        }
        if(i % 2 == 0){
            if(y) s += "--";
            s += ""+BOARD_DEF.board[sqr48[x]];
            if(!y) s += "--";
            x++;
        }
    }
   s += "</center>";
   return s;
}

