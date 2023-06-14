def find_best_move(board, player):
	# find winning move:
	if b := find_winning_move(board, player): return b

	# find blocking move:
	if b := find_blocking_move(board, player): return b
	
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

		# take the center if available, or take a corner:
		return find_any_available(board, player, [4, 0, 2, 6, 8])

	# find a fork, or else any attack:
	if b := find_best_attack(board, player): return b

	# play any move:
	return find_any_available(board, player, [0, 1, 2, 3, 4, 5, 6, 7, 8])
