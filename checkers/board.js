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

const SQR = {
    A1:7, A2:13, A3:19, A4:25, A5:31, A6:37, A7:43, A8:49,
    B1:8, B2:14, B3:20, B4:26, B5:32, B6:38, B7:44, B8:50,
    C1:9, C2:15, C3:21, C4:27, C5:33, C6:39, C7:45, C8:51,
    D1:10, D2:16, D3:22, D4:28, D5:34, D6:40, D7:46, D8:52
};

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

function hasPieceAt(pos, index){
    return pos.includes(index);
}

function printBoard(){
    document.write("<center>");
    let x = 0;
    let y = true;
   for(let i=0; i<sqr48.length*2; i++){
        if(i % 8 == 0)
        {
            document.write("<br>");
            y = !y;
        }
        if(i % 2 == 0){
            if(y) document.write("--");
            document.write(BOARD_DEF.board[sqr48[x]]);
            if(!y) document.write("--");
            x++;
        }
    }
   document.write("</center>");
}

