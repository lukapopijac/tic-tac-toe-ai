console.log(Deno.args);

let a = Deno.args[0] ?? 'xo.oox.x.';

let board = Number(a.replaceAll('_', ''));
if(isNaN(board)) {
	let symbols = a.toLowerCase().split('').map(s => s=='x'?1:s=='o'?2:0);
	board = 0;
	for(let symbol of symbols) board = board<<2 | symbol;
}

let svgBoard = '';

for(let i=0; i<9; i++) {
	let s = board & 0b11;
	if(s) {
		svgBoard += `<use xlink:href="#${s==1?'x':'o'}" x="${4*(1-i%3)}" y="${4*(1-(i/3|0))}"/>\n`
	}
	board >>= 2;
}

// let x = 4*(1-p%3);
// let y = 4*(1-(p/3|0));


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
		<path id="x" d="M-1,-1 L1,1 M1,-1 L-1,1"/>
		<circle id="o" cx="0" cy="0" r="1" fill="none"/>
	</defs>

	<g transform="translate(7,7)">
		<path d="M-2,-6 V6 M2,-6 V6 M-6,-2 H6 M-6,2 H6"/>
		${svgBoard}
	</g>
</svg>
`;

Deno.writeTextFile('ttt.svg', out);
