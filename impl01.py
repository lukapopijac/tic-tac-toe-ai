def count_symbols(board):
	cnt = 0
	while board:
		board &= board-1
		cnt += 1
	return cnt


def find_best_move(board, player):
	# find winning move
	# find blocking move
	
	# handle if less than 4 symbols:
	if count_symbols(board) < 4:
		# if it's player 1's turn and edges are empty, take any corner
		# if player 2 has center:
			# take any corner adjacent to a taken edge, or else take any edge
		# take the center if available, or take any corner
		pass

	# find a fork
	# find any attack
	# play any move
