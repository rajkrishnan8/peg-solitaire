class Board:
	def __init__(self, dim, cutout_dim):
		self.board = Board.board(dim, cutout_dim)

	def board(dim, cutout_dim):
		b = []
		for j in range(1, dim+1):
			row = []
			for i in range(1, dim+1):
				if j <= cutout_dim or j > (dim - cutout_dim):
					if i <= cutout_dim or i > (dim - cutout_dim):
						row.append(0)
					else:
						row.append(1)
				else:
					if i == ((dim + 1) / 2) and j == ((dim + 1) / 2):
						row.append(2)
					else:
						row.append(1)
			b.append(row)
		return b

	def print(self):
		for row in self.board:
			for cell in row:
				if cell == 0:
					print("  ", end="")
				elif cell == 1: 
					print("x ", end="")
				else:
					print("o ", end="")
			print("\n")

board = Board(7, 2)
board.print()