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


const winMasks = [
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

	if(b = findWinningMove(board, player)) return b;

	if(b = findBlockingMove(board, player)) return b;

	if(countSymbols(board) < 4) {
		if(player==1 && !(board & 0xCCCC)) {         // edges empty
			return findAvailable(board, player, shuffle([0, 2, 6, 8]))
		}
		if(board & 0x200) {                          // player 2 has center
			if(board & 0x00CC) return board | player;
			if(board & 0xCC00) return board | player<<16;
			return findAvailable(board, player, shuffle([1, 3, 5, 7]));
		}
		return findAvailable(board, player, [4].concat(shuffle([0, 2, 6, 8])));
	}
	
	if(b = findBestAttack(board, player)) return b;
	
	return findAvailable(board, player, shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]));
}


function countSymbols(board) {
	let count;
	for(count=0; board; count++) board &= board-1;
	return count;
}


function isValidBoard(board) {
	// check for broken cells (overlapping X and O):
	return !(board & board>>1 & 0b000_01_01_01_01_01_01_01_01_01);
}


function areSuccessiveBoards(b1, b2) {
	let b = b1 ^ b2;
	return b>0 && !(b & b-1)   // is not 0 && is power of 2
}


function findAvailable(board, player, allowed) {
	for(let p of allowed)
		if((board & 0b11<<2*p) == 0)
			return board | player<<2*p;
}


function findBestAttack(board, player) {  // find a fork if exists, else find any attack
	let bestNewBoard;

	for(let p=0; p<9; p++) {
		if(board & 0b11<<2*p) continue;  // this cell is taken
		let b1 = board | player<<2*p;

		for(let mask of winMasks) {
			mask *= player;
			let b2 = b1 | mask;	
			if(isValidBoard(b2) && areSuccessiveBoards(b1, b2)) {
				// if already found another attack with b1, then this is a fork:
				if(bestNewBoard == b1) return b1;
				bestNewBoard = b1;
			}
		}
	}
	return bestNewBoard;
}


function findWinningMove(board, player) {  // player = 1 or 2
	for(let mask of winMasks) {
		mask *= player;
		let newBoard = board | mask;
		if(isValidBoard(newBoard) && areSuccessiveBoards(board, newBoard)) {
			return newBoard;
		}
	}
}


function findBlockingMove(board, player) {
	let b = findWinningMove(board, 3-player);  // find winning move for the opponent
	if(b) {
		let c = board ^ b;                     // get only the last symbol on the board
		c = player==1 ? c>>1 : c<<1;           // swap the symbol
		return board | c;                      // put the symbol back
	}
}


function getWinner(board) {
	for(let mask of winMasks) {
		if((board&mask) == mask) return 1;
		mask <<= 1;
		if((board&mask) == mask) return 2;
	}

	// check if any cell is empty
	if(isValidBoard(~board)) return 0;
}



/**********  testing  **********/

function board2string(board) {
	if(board==null) return '---';
	let s = ('000000000000000000' + board.toString(2)).slice(-18);
	return s
		.match(/../g)
		.map(m => ({'00': '. ', '01': 'X ', '10': 'O '}[m]))
		.join('')
		.match(/....../g)
		.join('\n')
	;
}


function boards2string(boards) {
	let rows = ['', '', ''];
	for(let board of boards) {
		let s = ('000000000000000000' + board.toString(2)).slice(-18)
			.match(/../g)
			.map(m => ({'00': '. ', '01': 'X ', '10': 'O '}[m]))
			.join('')
			.match(/....../g)
		;
		for(let i=0; i<3; i++) rows[i] += s[i] + ' ';
	}
	return rows.join('\n');
}


function play() {
	let aiPlayer = 1;
	let boards = [];
	let board = 0;

	let player = 1;
	while(true) {
		if(player == aiPlayer) board = findBestMove(board, player);
		else if(Math.random()>.2) board = findBestMove(board, player);
		else board = findAvailable(board, player, shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]));

		boards.push(board);
		let winner = getWinner(board);
		if(winner >= 0) break;
		player = 3 - player;
	}
	console.log(boards2string(boards))
}

play();
