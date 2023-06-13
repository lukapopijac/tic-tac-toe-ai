import random
import re


def board_to_string(board):
	s = format(board, '018b')
	s = re.sub('..', lambda m: {'00': '. ', '01': 'X ', '10': 'O '}[m[0]], s)
	s = re.findall('......', s)
	return '\n'.join(s)


def boards_to_string(boards):
	rows = ['', '', '']
	for board in boards:
		s = format(board, '018b')
		s = re.sub('..', lambda m: {'00': '. ', '01': 'X ', '10': 'O '}[m[0]], s)
		s = re.findall('......', s)
		for i in range(0, 3): rows[i] += s[i] + ' '
	return '\n'.join(rows)


# print(boards_to_string([0b_01_10_00_00_10_00_01_01_10, 0b_00_10_10_00_00_01_01_10_00]))



def shuffle(a):
	random.shuffle(a)
	return a

# masks for player 1
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

def find_best_move(board, player):
	# find winning move:
	if b := find_winning_move(board, player): return b

	# find blocking move:
	if b := find_blocking_move(board, player): return b
	
	# handle if less than 4 symbols:
	if count_symbols(board) < 4:
		# if it's player 1's turn and edges are empty, take any corner:
		if player==1 and not board&0b_00_11_00_11_00_11_00_11_00:
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


def count_symbols(board):
	cnt = 0
	while board:
		board &= board-1
		cnt += 1
	return cnt

def is_valid_board(board):
	# check for broken cells (overlapping X and O):
	return not board & board>>1 & 0b_01_01_01_01_01_01_01_01_01

def are_successive_boards(b1, b2):
	b = b1 ^ b2
	return b>0 and not b & b-1   # is not 0 && is power of 2

def find_any_available(board, player, allowed):
	# random.shuffle(allowed)
	for p in allowed:
		if board & 0b11<<2*p == 0:
			return board | player<<2*p


def find_best_attack(board, player):   # find a fork if exists, else find any attack
	best_new_board = None

	for p in range(9):
		if board & 0b11<<2*p: continue  # this cell is taken
		b1 = board | player<<2*p

		for mask in win_masks:
			mask *= player
			b2 = b1 | mask
			if is_valid_board(b2) and are_successive_boards(b1, b2):
				# if already found another attack with b1, then this is a fork, return immediatelly:
				if best_new_board == b1: return b1
				best_new_board = b1

	return best_new_board



# board = 0b000_10_01_00_00_10_00_00_00_01
# print(board_to_string(board))
# print()
# newBoard = find_best_attack(board, 2)
# print(board_to_string(newBoard))




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



# b = 0b_10_01_10_10_01_10_01_00_01
# print(board_to_string(b))
# c = find_winning_move(b, 0)
# print(c)

def get_winner(board):
	for mask in win_masks:
		if board&mask == mask: return 1
		mask <<= 1
		if board&mask == mask: return 2
	
	# check if any cell is empty
	if is_valid_board(~board): return 0



# function test() {
# 	let board, newBoard;
	
# 	// board = 0b000_10_01_00_10_10_00_00_00_01
# 	// print(board);
# 	// newBoard = findWinMove(board, 2);
# 	// print(newBoard);
	
# 	// console.log('--------------');

# 	// board = 0b000_10_01_00_00_10_00_00_00_01
# 	// print(board);
# 	// newBoard = findBestAttack(board, 1);
# 	// print(newBoard);
	
# 	// board = 0
# 	// let player = 1;
# 	// do {
# 	// 	board = findBestMove(board, player);
# 	// 	player = 3 - player;
# 	// 	print(board);
# 	// } while(board);

# 	console.log(
# 		boards2string([0b000_10_01_00_00_10_00_00_00_01, 0b000_10_01_00_10_10_00_00_00_01, 0b000_10_01_00_00_10_00_00_00_01])
# 	)

# 	// console.log(board2string(0b000_10_01_00_00_10_00_00_00_01))
# 	// console.log(board2string(0b000_10_01_00_10_10_00_00_00_01))

# }

# // test();

def play():
	ai_player = 2
	boards = []
	board = 0

	player = 1
	while True:
		if player == ai_player: board = find_best_move(board, player)
		elif random.random()>.2: board = find_best_move(board, player)
		else: board = find_any_available(board, player, shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]))

		boards.append(board)
		winner = get_winner(board)
		if winner is not None: break
		player = 3 - player

	print(boards_to_string(boards))

play()


# print(
# 	board_to_string(
# 		find_best_move(0b_00_00_00_00_00_00_00_00_01, 2)
# 	)
# )
