select *
from Games
	join Difficulty
		on Games.difficulty_id = Difficulty.id;