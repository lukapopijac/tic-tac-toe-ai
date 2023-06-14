import random

def shuffle(a):
	random.shuffle(a)
	return a


def find_best_move(board, player):
	if b := find_winning_move(board, player): return b

	if b := find_blocking_move(board, player): return b

	if count_symbols(board) < 4:
		if player==1 and not board & 0xCCCC:           # edges empty
			return find_any_available(board, player, shuffle([0, 2, 6, 8]))
		if board & 0x200:                              # player 2 has center
			if board & 0x00CC: return board | player
			if board & 0xCC00: return board | player<<16
			return find_any_available(board, player, shuffle([1, 3, 5, 7]))
		return find_any_available(board, player, [4] + shuffle([0, 2, 6, 8]))

	if b := find_best_attack(board, player): return b
	
	return find_any_available(board, player, shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]))
