create table Users (
	id int(10) unsigned AUTO_INCREMENT,
	username varchar(25),
	password_hash varchar(40),
	primary key (id)
);

create table Difficulty (
	id int(10) unsigned AUTO_INCREMENT,
	level tinyint,
	primary key (id)
);

create table Games (
	id int(10) unsigned AUTO_INCREMENT,
	difficulty_id int(10) unsigned,
	primary key (id),
	foreign key (difficulty_id) references Difficulty(id)
);

create table GamePlayed(
	id int(10) unsigned AUTO_INCREMENT,
	completion_time time,
	user_id int(10) unsigned,
	game_id int(10) unsigned,
	primary key (id),
	foreign key (user_id) references Users(id),
	foreign key (game_id) references Games(id)
);
