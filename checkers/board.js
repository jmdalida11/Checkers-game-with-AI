const PLAYER = {P1: 1, P2: 2};

const PIECE_TYPE = {
    NO_PIECE: 0,
    WHITE_PIECE: 1,
    BLACK_PIECE: 2
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

const SQR = {
    A1:7, A2:13, A3:19, A4:25, A5:31, A6:37, A7:43, A8:49,
    B1:8, B2:14, B3:20, B4:26, B5:32, B6:38, B7:44, B8:50,
    C1:9, C2:15, C3:21, C4:27, C5:33, C6:39, C7:45, C8:51,
    D1:10, D2:16, D3:22, D4:28, D5:34, D6:40, D7:46, D8:52,
    NONE: 0
};

const imgs = [null, new Image(), new Image()];
imgs[1].src = 'r.png';
imgs[2].src = 'y.png';

const SIDE_SQR = [SQR.A1, SQR.D2, SQR.A3, SQR.D4, SQR.A5, SQR.D6, SQR.A7, SQR.D8];

const BOARD_SIZE = 60;
const BOARD_DEF = {};

const sqr48 = [];

BOARD_DEF.board = new Array(BOARD_SIZE);
BOARD_DEF.move = 0;
BOARD_DEF.pCount = new Array(3);

BOARD_DEF.wPos = [
    SQR.A1, SQR.B1, SQR.C1, SQR.D1,
    SQR.A2, SQR.B2, SQR.C2, SQR.D2,
    SQR.A3, SQR.B3, SQR.C3, SQR.D3
];

BOARD_DEF.bPos = [
    SQR.A8, SQR.B8, SQR.C8, SQR.D8,
    SQR.A7, SQR.B7, SQR.C7, SQR.D7,
    SQR.A6, SQR.B6, SQR.C6, SQR.D6
];

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
        if(hasPieceAt(BOARD_DEF.wPos, SQR[key])){
            BOARD_DEF.board[SQR[key]] = PIECE_TYPE.WHITE_PIECE;

        }
        if(hasPieceAt(BOARD_DEF.bPos, SQR[key])){
            BOARD_DEF.board[SQR[key]] = PIECE_TYPE.BLACK_PIECE;
        }
    });
}

function movePiece(src, target){
    if(BOARD_DEF.board[src] != PIECE_TYPE.NO_PIECE && BOARD_DEF.board[target] == PIECE_TYPE.NO_PIECE){
        BOARD_DEF.board[target] = BOARD_DEF.board[src];
        BOARD_DEF.board[src] = PIECE_TYPE.NO_PIECE;

        if(PIECE_TYPE.WHITE_PIECE == BOARD_DEF.board[target]){
            BOARD_DEF.wPos[BOARD_DEF.wPos.indexOf(src)] = target;
        }else if(PIECE_TYPE.BLACK_PIECE == BOARD_DEF.board[target]){
            BOARD_DEF.bPos[BOARD_DEF.bPos.indexOf(src)] = target;
        }

        return true;
    }
    return false;
}

function generateMove(player){

    let possibleMoves = [];

    if(player == PLAYER.P1){
        for(let i=0; BOARD_DEF.wPos.length; i++){

        }
    }

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

