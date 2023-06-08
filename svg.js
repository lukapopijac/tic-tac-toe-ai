/*
run like this:
deno run --allow-write svg.js ox--XoO-x
or:
deno run --allow-all svg.js ox- -Xo O-x

*/

let a = Deno.args.join('').replaceAll(' ', '');
let svgBoard = '';
if(a.length == 9) {
	for(let i=0; i<9; i++) {
		let s = a[i];
		if(s=='x' || s=='o' || s=='X' || s=='O') {
			svgBoard += `<use xlink:href="#${s}" x="${4*(-1+i%3)}" y="${4*(-1+(i/3|0))}"/>\n\t\t`;
		}
	}		
}

// let board = Number(a.replaceAll('_', ''));
// if(isNaN(board)) {
// 	let symbols = a.toLowerCase().split('').map(s => s=='x'?1:s=='o'?2:0);
// 	board = 0;
// 	for(let symbol of symbols) board = board<<2 | symbol;
// }



// for(let i=0; i<9; i++) {
// 	let s = board & 0b11;
// 	if(s) {
// 		svgBoard += `
// 			<use xlink:href="#${s==1?'x':'o'}"
// 				x="${4*(1-i%3)}"
// 				y="${4*(1-(i/3|0))}"
// 				stroke="black"/>
// 		`;
// 	}
// 	board >>= 2;
// }



let out = `
<svg 
	viewBox="0 0 14 14"
	preserveAspectRatio="xMidYMid"
	role="img"
	width="100"
	height="100"
	stroke="black"
	stroke-width=".2"
	stroke-linecap="round"
>
	<defs>
		<path id="grid" d="M-2,-6 V6 M2,-6 V6 M-6,-2 H6 M-6,2 H6"/>
		<path id="x" d="M-1,-1 L1,1 M1,-1 L-1,1"/>
		<circle id="o" cx="0" cy="0" r="1" fill="none"/>
		<use id="X" xlink:href="#x" stroke="red"/>
		<use id="O" xlink:href="#o" stroke="red"/>
	</defs>

	<g transform="translate(7,7)">
		<use xlink:href="#grid"/>
		${svgBoard}
	</g>
</svg>
`;

try {
	await Deno.mkdir('svg');
} catch {}
let r = new Date().getTime()/1000 |0;
Deno.writeTextFile(`svg/${a}___${r}.svg`, out);
