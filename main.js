function print(board) {
	if(!board) {
		console.log(0)
		return
	}
	let s = ('000000000000000000' + board.toString(2)).slice(-18);
	console.log(
		s
			.match(/.{1,2}/g)
			.join(' ')
			.replaceAll('01', 'X')
			.replaceAll('10', 'O')
			.replaceAll('00', '.')
			.match(/.{1,6}/g)
			.join('\n')
		+ '\n'
	);
	// console.log(
	// 	s
	// 		.match(/.{1,2}/g)
	// 		.join(' ')
	// 		.match(/.{1,9}/g)
	// 		.join('\n')
	// 	+ '\n'
	// );
}

function board2string(board) {
	let s = ('000000000000000000' + board.toString(2)).slice(-18);
	return s
		.match(/.{1,2}/g)
		.join(' ')
		.replaceAll('01', 'X')
		.replaceAll('10', 'O')
		.replaceAll('00', '.')
		.match(/.{1,6}/g)
		.join('\n')
		+ '\n'
	;
}


function boards2string(boards) {
	let rows = ['', '', ''];
	for(let board of boards) {
		let s = ('000000000000000000' + board.toString(2)).slice(-18)
			.match(/.{1,2}/g)
			.join(' ')
			.replaceAll('01', 'X')
			.replaceAll('10', 'O')
			.replaceAll('00', '.')
			.match(/.{1,6}/g)
		;
		for(let i=0; i<3; i++) rows[i] += s[i] + ' ';
		rows[2] += ' ';
	}
	return rows.join('\n');
}


// masks for player 1
let winMasks = [
	0b000_01_01_01_00_00_00_00_00_00,
	0b000_00_00_00_01_01_01_00_00_00,
	0b000_00_00_00_00_00_00_01_01_01,
	0b000_01_00_00_01_00_00_01_00_00,
	0b000_00_01_00_00_01_00_00_01_00,
	0b000_00_00_01_00_00_01_00_00_01,
	0b000_01_00_00_00_01_00_00_00_01,
	0b000_00_00_01_00_01_00_01_00_00
];

function findBestMove(board, player) {
	let b;

	// find winning move:
	if(b = findWinMove(board, player)) return b;

	// find blocking move (winning move for the opponent):
	if(b = findWinMove(board, 3-player)) {
		// get the board with only last symbol:
		let c = board^b;
		// swap the symbol:
		if(player==1) c >>= 1; else c <<= 1;
		// put the symbol on the board:
		return board|c;
	}

	let cnt = countSymbols(board);
	if(cnt<4) {
		// if opponent has center, take any corner:
		if(board & (3-player)<<8) b = findAnyAvailable(board, player, [0, 2, 6, 8]);
		// if cnt is even and edges are empty:
		else if(!(cnt&1) && !(board & 0xCCCC)) b = findAnyAvailable(board, player, [0, 2, 6, 8]);
		// if center is empty, take it:
		else if(!(board & 0x300)) b = board | player<<8;
		// if edges are empty, take any edge:
		else if(!(board & 0xCCCC)) b = findAnyAvailable(board, player, [1, 3, 5, 7]);
		// take any corner adjacent to a taken edge:
		else if(board & 0x00CC) b = board | player;
		else if(board & 0xCC00) b = board | player<<16;
		
		if(b) return b;
	}
	
	// find double-attack, or else any attack:
	if(b = findBestAttack(board, player)) return b;
	
	// play any move:
	if(b = findAnyAvailable(board, player, [0, 1, 2, 3, 4, 5, 6, 7, 8])) return b;

	return 0;
}

function countSymbols(board) {
	let cnt;
	for(cnt=0; board; cnt++) board &= board-1;
	return cnt;
}

function shuffle(a) {
	let arr = a.slice();
	for(let i=0; i<arr.length-1; i++) {
		let j = i + Math.floor(Math.random() * (arr.length - i));
		if(j!=i) {
			let t = arr[i];
			arr[i] = arr[j];
			arr[j] = t;
		}
	}
	return arr;
}

function findAnyAvailable(board, player, allowed) {
	allowed = shuffle(allowed);
	for(let i of allowed) {
		if(!(board & 0b11<<i<<i)) return board | player<<i<<i;
	}
	return 0;
}

function findBestAttack(board, player) {
	// find double-attack if exists. else find any attack. else return 0

	let bestNewBoard = 0;
	for(let i=0; i<18; i+=2) {
		if(0b11<<i & board) continue;  // this cell is taken
		let b1 = board | player<<i;

		for(let mask of winMasks) {
			mask *= player;
			let b2 = b1 | mask;	
			if(checkSuccessiveBoards(b1, b2)) {
				// if already found another attack with b1, then this is double-attack, return immediatelly:
				if(bestNewBoard == b1) return b1;
				bestNewBoard = b1;
			}
		}
	}
	return bestNewBoard;
}

function checkSuccessiveBoards(b1, b2) {
	// check for broken cells (overlapping X and O):
	if(b2 & b2>>1 & 0b000_01_01_01_01_01_01_01_01_01) return false;
	// check if differ in exactly one move:
	let b = b1^b2;
	return b && !(b & b-1); // is not 0 && is power of 2
}

function findWinMove(board, player) {  // player = 1 or 2
	for(let mask of winMasks) {
		mask *= player;
		let newBoard = board|mask;
		if(checkSuccessiveBoards(board, newBoard)) return newBoard;
	}
	return 0;
}

function whoWon(board) {
	for(let mask of winMasks) {
		// console.log(board.toString(2))
		// console.log(mask.toString(2))
		// console.log((board&mask).toString(2))
		if((board&mask) == mask) return 1;
		mask <<= 1;
		if((board&mask) == mask) return 2;
	}
	// check if any cell is empty:
	let b = ~board;
	if(!(b & b>>1 & 0b000_01_01_01_01_01_01_01_01_01)) return 0;   // draw
}

function test() {
	let board, newBoard;
	
	// board = 0b000_10_01_00_10_10_00_00_00_01
	// print(board);
	// newBoard = findWinMove(board, 2);
	// print(newBoard);
	
	// console.log('--------------');

	// board = 0b000_10_01_00_00_10_00_00_00_01
	// print(board);
	// newBoard = findBestAttack(board, 1);
	// print(newBoard);
	
	// board = 0
	// let player = 1;
	// do {
	// 	board = findBestMove(board, player);
	// 	player = 3 - player;
	// 	print(board);
	// } while(board);

	console.log(
		boards2string([0b000_10_01_00_00_10_00_00_00_01, 0b000_10_01_00_10_10_00_00_00_01, 0b000_10_01_00_00_10_00_00_00_01])
	)

	// console.log(board2string(0b000_10_01_00_00_10_00_00_00_01))
	// console.log(board2string(0b000_10_01_00_10_10_00_00_00_01))

}

// test();

function play() {
	let player = 1;
	let aiPlayer = 2;
	let boards = [];
	let board = 0;
	while(true) {
		if(player == aiPlayer) board = findBestMove(board, player);
		else if(Math.random()>.2) board = findBestMove(board, player);
		else board = findAnyAvailable(board, player, [0, 1, 2, 3, 4, 5, 6, 7, 8]);

		boards.push(board);
		let winner = whoWon(board);
		if(winner >= 0) break;
		player = 3 - player;
	}
	console.log(
		boards2string(boards)
	)
}

play();

