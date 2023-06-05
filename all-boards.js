import fs from 'fs';

function main() {
	let boards = new Set([0]);
	generateBoards(boards, 0, 1, 0);
	
	// get boards with filtered out symmetries
	let boards2 = filterSymmetries(boards);
	let bs2 = [...boards2].sort((a,b)=>a-b);
	fs.writeFileSync('out2.txt', boards2string(bs2));

	// get boards that are not won

	let bs3 = [];
	for(let board of bs2) {
		if(!(whoWon(board))) bs3.push(board);
	}
	fs.writeFileSync('out3.txt', boards2string(bs3));

	getHashes(bs3);

	// print sizes
	console.log(boards.size);
	console.log(bs2.length);
	console.log(bs3.length);

}

main();


// c = 0.014301941434275989  size = 627   m = 7000
// c = 0.5404006775241361    size = 627   m = 7000
// c = 0.4101994030472713    size = 627   m = 7000

// c = 0.3767134723156125    size = 627   m = 6500
// c = 0.11515309035644505    size = 627   m = 6000

// c = 0.43096829353541266    size = 627   m = 5500


function getHashes(boards) {
	// let m = 2**12;
	let m = 5000;
	for(let i=0; i<100000000; i++) {
		if(i%500000 == 0) console.log('===', i*1e-6);
		let hashes = new Set();
		let c = Math.random();
		for(let k of boards) {
			let r = k*c;
			let h = m * (r - (r|0)) | 0;
			if(hashes.has(h)) break;
			hashes.add(h);
		}
		if(hashes.size>600)
			console.log('c =', c, '   size =', hashes.size, '  m =', m);
		if(hashes.size==627) break;
	}
	// return hashes;
}


function filterSymmetries(boards) {
	let ret = new Set();
	for(let board of boards) {
		let symms = generateSymmetries(board);
		symms.sort((a,b)=>a-b);
		ret.add(symms[0]);
	}
	return ret;
}

function generateBoards(boards, board, player, depth) {
	boards.add(board);
	if(depth==8) return;
	for(let i=0; i<9; i++)
		if(!(board & 0b11<<i<<i))
			generateBoards(boards, board | player<<i<<i, 3-player, depth+1);
}


// 012
// 783
// 654
//
// 012345678

function generateSymmetries(board) {
	let boards = [board];
	let center = board & 0b11;
	let b = board>>2;
	
	for(let i=0; i<3; i++) {
		let last2 = b & 0b1111;
		b = last2<<12 | b>>4;
		boards.push( b<<2 | center );
	}

	// reverse
	let x7 = (b & 0b000_00_00_00_00_00_00_00_11) << 12;
	let x6 = (b & 0b000_00_00_00_00_00_00_11_00) << 8;
	let x5 = (b & 0b000_00_00_00_00_00_11_00_00) << 4;
	let x3 = (b & 0b000_00_00_00_11_00_00_00_00) >> 4;
	let x2 = (b & 0b000_00_00_11_00_00_00_00_00) >> 8;
	let x1 = (b & 0b000_00_11_00_00_00_00_00_00) >> 12;
	b     &=      0b000_11_00_00_00_11_00_00_00;
	b |= x1|x2|x3|x5|x6|x7;
	
	boards.push(b<<2 | center);
	for(let i=0; i<3; i++) {
		let last2 = b & 0b1111;
		b = last2<<12 | b>>4;
		boards.push( b<<2 | center );
	}

	return boards;
}

function board2string(board) {
	let s = [];
	for(let i of [4, 3, 6, 7, 8, 5, 2, 1, 0]) {
		let c = board & 0b11;
		s[i] = c==1 ? 'X' : c==2 ? 'O' : '.';
		board >>= 2;
	}
	return s[0]+s[1]+s[2] + '\n' + s[3]+s[4]+s[5] + '\n' + s[6]+s[7]+s[8];
}

function boards2string(boards) {
	let s = '';
	for(let board of boards) {
		s += board2string(board);
		s += '\n\n';
	}
	return s;
}




// 012
// 783
// 654
//
// 012345678


function whoWon(board) {
	// masks for player 1
	let winMasks = [
		0b000_01_01_01_00_00_00_00_00_00,
		0b000_00_00_00_01_00_00_00_01_01,
		0b000_00_00_00_00_01_01_01_00_00,
		0b000_01_00_00_00_00_00_01_01_00,
		0b000_00_01_00_00_00_01_00_00_01,
		0b000_00_00_01_01_01_00_00_00_00,
		0b000_01_00_00_00_01_00_00_00_01,
		0b000_00_00_01_00_00_00_01_00_01
	];
	for(let mask of winMasks) {
		// console.log(board.toString(2))
		// console.log(mask.toString(2))
		// console.log((board&mask).toString(2))
		if((board&mask) == mask) return 1;
		mask <<= 1;
		if((board&mask) == mask) return 2;
	}
}
