win_masks = [
	0b_01_01_01_00_00_00_00_00_00,
	0b_00_00_00_01_01_01_00_00_00,
	0b_00_00_00_00_00_00_01_01_01,
	0b_01_00_00_01_00_00_01_00_00,
	0b_00_01_00_00_01_00_00_01_00,
	0b_00_00_01_00_00_01_00_00_01,
	0b_01_00_00_00_01_00_00_00_01,
	0b_00_00_01_00_01_00_01_00_00
]

def is_valid_board(board):
	# check for broken cells (overlapping X and O):
	return not board & board>>1 & 0b_01_01_01_01_01_01_01_01_01

def are_successive_boards(b1, b2):
	b = b1 ^ b2
	return b>0 and not b & b-1   # is not 0 and is power of 2

def find_winning_move(board, player):
	for mask in win_masks:
		mask *= player
		new_board = board | mask
		if is_valid_board(new_board) and are_successive_boards(board, new_board):
			return new_board

def find_blocking_move(board, player):
	b = find_winning_move(board, 3-player)  # find winning move for the opponent
	if b:
		c = board ^ b                       # get only the last symbol on the board
		c = c>>1 if player==1 else c<<1     # swap the symbol
		return board | c                    # put the symbol back

def find_any_attack(board, player):
	for p in range(9):
		if board & 0b11<<2*p: continue  # this cell is taken

		b1 = board | player<<2*p
		if find_winning_move(b1, player):
			return b1
