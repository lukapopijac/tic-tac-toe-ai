let s = `
<svg 
	viewBox="0 0 14 14"
	preserveAspectRatio="xMidYMid"
	role="img"
	style="border: 4px solid grey"
	width="300"
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
		<use xlink:href="#x" x="-4" y="-4"/>
		<use xlink:href="#x" x="0"   y="-4"/>
		<use xlink:href="#x" x="4"  y="0"/>
		<use xlink:href="#o" x="-4" y="0"/>
		<use xlink:href="#o" x="0"   y="0"/>
		<use xlink:href="#x" style="x:0; y:4;"/>
	</g>
</svg>
`;

document.body.innerHTML = s;
