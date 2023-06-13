def count_symbols(board):
	cnt = 0
	while board:
		board &= board-1
		cnt += 1
	return cnt


def find_any_available(board, player, allowed):
	for p in allowed:
		if board & 0b11<<2*p == 0:
			return board | player<<2*p


def find_best_move(board, player):
	# find winning move
	# find blocking move

	# handle if less than 4 symbols:
	if count_symbols(board) < 4:
		# if it's player 1's turn and edges are empty, take any corner:
		if player==1 and not board & 0b_00_11_00_11_00_11_00_11_00:
			return find_any_available(board, player, [0, 2, 6, 8])

		# if player 2 has center:
		if board & 0b_00_00_00_00_10_00_00_00_00:
			# take any corner adjacent to a taken edge:
			if board & 0b_00_00_00_00_00_11_00_11_00: return board | player
			if board & 0b_00_11_00_11_00_00_00_00_00: return board | player<<16
			# take any edge:
			return find_any_available(board, player, [1, 3, 5, 7])

		# take the center if available, or take any corner:
		return find_any_available(board, player, [4, 0, 2, 6, 8])

	# find a fork
	# find any attack
	
	# play any move:
	return find_any_available(board, player, [0, 1, 2, 3, 4, 5, 6, 7, 8])









"""
def count_symbols(board):
	cnt = 0
	while board:
		board &= board-1
		cnt += 1
	return cnt


def find_any_available(board, player, allowed):
	for p in allowed:
		if board & 0b11<<2*p == 0:
			return board | player<<2*p


def find_best_move(board, player):
	# find winning move
	# find blocking move

	if count_symbols(board) < 4:
		if player==1 and not board & 0xCCCC:                         # edges empty
			return find_any_available(board, player, [0, 2, 6, 8])
		if board & 0x200:                                            # player 2 has center
			if board & 0x00CC: return board | player
			if board & 0xCC00: return board | player<<16
			return find_any_available(board, player, [1, 3, 5, 7])
		return find_any_available(board, player, [4, 0, 2, 6, 8])

	# find a fork
	# find any attack
	
	return find_any_available(board, player, [0, 1, 2, 3, 4, 5, 6, 7, 8])

"""