/*
run like this:
deno run --allow-write svg.js ox--XoO-x
or:
deno run --allow-write svg.js ox- -Xo O-x
*/


let a = Deno.args.join('').replaceAll(' ', '');
let svgBoard = [];
if(a.length == 9) {
	for(let i=0; i<9; i++) {
		let s = a[i];
		if(s=='x' || s=='o' || s=='X' || s=='O') {
			svgBoard.push(`<use href="#${s}" x="${4*(-1+i%3)}" y="${4*(-1+(i/3|0))}"/>`);
		}
	}
}


let out = `<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 14 14"
	preserveAspectRatio="xMidYMid"
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
		<use id="X" href="#x" stroke="orange"/>
		<use id="O" href="#o" stroke="orange"/>
	</defs>

	<g transform="translate(7,7)">
		<use href="#grid"/>
		${svgBoard.join('\n\t\t')}
	</g>
</svg>
`;

try {
	await Deno.mkdir('svg');
} catch {}
let r = new Date().getTime()/1000 |0;
Deno.writeTextFile(`svg/${a}___${r}.svg`, out);
