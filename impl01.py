def count_symbols(board):
	cnt = 0
	while board:
		board &= board-1
		cnt += 1
	return cnt


def find_best_move(board, player):
	# find winning move

	# find blocking move (winning move for the opponent)
	
	# handle if less than 4 symbols
	cnt = count_symbols(board)
	if cnt<4:
		# if opponent has center, take any corner
		# if cnt is even and edges are empty, take any corner
		# if center is empty, take it
		# if edges are empty, take any edge
		# take any corner adjacent to a taken edge
		pass

	# find a fork

	# find any attack

	# play any move
