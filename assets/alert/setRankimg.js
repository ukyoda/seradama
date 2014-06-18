GameAlert.fn.setRankimg = function(rank) {
	if(rank == 1) {
		return 'gold';
	} else if (rank == 2) {
		return 'silver';
	} else if (rank == 3) {
		return 'blonze';
	} else {
		return '';
	}
};