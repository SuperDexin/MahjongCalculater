let all_tiles_dic = {
	11: "一万",
	12: "二万",
	13: "三万",
	14: "四万",
	15: "五万",
	16: "六万",
	17: "七万",
	18: "八万",
	19: "九万",
	21: "一筒",
	22: "二筒",
	23: "三筒",
	24: "四筒",
	25: "五筒",
	26: "六筒",
	27: "七筒",
	28: "八筒",
	29: "九筒",
	31: "一条",
	32: "二条",
	33: "三条",
	34: "四条",
	35: "五条",
	36: "六条",
	37: "七条",
	38: "八条",
	39: "九条",
	41: "东风",
	43: "南风",
	45: "西风",
	47: "北风",
	51: "红中",
	53: "发财",
	55: "白板"
};

let all_tiles = [
	11, 12, 13, 14, 15, 16, 17, 18, 19,
	21, 22, 23, 24, 25, 26, 27, 28, 29,
	31, 32, 33, 34, 35, 36, 37, 38, 39,
	41, 43, 45, 47, 51, 53, 55
];

function check_situations(tiles) {
	tiles.sort(function(a,b){return a-b});
	if (tiles.length == 14) return check_hu(tiles);
	else if (tiles.length == 13) return check_ting(tiles);
};

function check_ting(tiles) {
	let tings = [];
	for (let tile of all_tiles) {
		let tiles_copy = tiles.copy();
		tiles_copy.push(tile);
		tiles_copy.sort(function(a,b){return a-b});

		if (!(check_hu(tiles_copy) == "没胡")) tings.push(tile);
	}
	if (tings == undefined || tings.length == 0){
		return "没听";
	}
	else {
		let content = "听：";
		for (let ting of tings){
			content += all_tiles_dic[ting] + " ";
		}
		return content;
	}
};

function check_hu(tiles) {
	if (check_seven_pairs(tiles)) return "七对";
	else if (check_thirteen_yao(tiles)) return "十三幺";
	else if (check_chichen_hu(tiles)) return "和了";
	return "没胡";
};

function check_seven_pairs(tiles) {
	for (let i = 0; i < tiles.length; i += 2)
		if (!(tiles[i] == tiles[i + 1])) return false;
	return true;
};

function check_thirteen_yao(tiles) {
	let tiles_copy = tiles.copy();
	let orphans = [11, 19, 21, 29, 31, 39, 41, 43, 45, 47, 51, 53, 55];
	for (let i = 0; i < tiles_copy.length; i++)
		if (!(tiles_copy[i] == orphans[i]))
			if (i == 0)
				return false;
			else if (!(tiles_copy[i] == tiles_copy[i - 1]))
				return false;
	else if (tiles_copy[i] == tiles_copy[i - 1]) {
		tiles_copy.splice(i, 1);
		break;
	}
	for (let i = 0; i < tiles_copy.length; i++)
		if (!(tiles_copy[i] == orphans[i])) return false;
	return true;
};

function check_chichen_hu(tiles) {
	let pairs_index = [];
	for (let i = 0; i < tiles.length; i++)
		if (i < tiles.length - 1 && tiles[i] == tiles[i + 1] && (i == 0 || !(tiles[i] == tiles[i - 1]))) pairs_index.push(i);

	for (let pair_num = 0; pair_num < pairs_index.length; pair_num++) {
		let triplets_index = [];
		let tiles_copy = tiles.copy();
		tiles_copy.splice(pairs_index[pair_num], 2);

		for (let i = 0; i < tiles_copy.length; i++)
			if (i < tiles_copy.length - 2 && tiles_copy[i] == tiles_copy[i + 1] && tiles_copy[i] == tiles_copy[i + 2] && (i == 0 || !(tiles_copy[i] == tiles_copy[i - 1])))
				triplets_index.push(i);

		let triplets_num = triplets_index.length;
		
		if (triplets_num == 4) return true;
		
		if (check_sequences(tiles_copy)) return true;
		
		if (triplets_num == 1) {
			tiles_copy.splice(triplets_index[0], 3);
			if (check_sequences(tiles_copy)) return true;
		}

		if (triplets_num == 2) {
			for (let j = 0; j < 2; j++) {
				let tiles_copy2 = tiles_copy.copy();
				tiles_copy2.splice(triplets_index[j], 3);
				if (check_sequences(tiles_copy2)) return true;
			}
			tiles_copy.splice(triplets_index[1], 3);
			tiles_copy.splice(triplets_index[0], 3);
			if (check_sequences(tiles_copy)) return true;
		}

		if (triplets_num == 3) {
			for (let j = 0; j < 3; j++) {
				let tiles_copy2 = tiles_copy.copy();
				tiles_copy2.splice(triplets_index[j], 3);
				if (check_sequences(tiles_copy2)) return true;
			}
			for (let j = 0; j < 3; j++) {
				let tiles_copy2 = tiles_copy.copy();
				let triplets_index_copy = triplets_index.copy();
				triplets_index_copy.splice(j, 1);
				tiles_copy2.splice(triplets_index[1], 3);
				tiles_copy2.splice(triplets_index[0], 3);
				if (check_sequences(tiles_copy2)) return true;
			}
			tiles_copy.splice(triplets_index[2], 3);
			tiles_copy.splice(triplets_index[1], 3);
			tiles_copy.splice(triplets_index[0], 3);
			if (check_sequences(tiles_copy)) return true;
		}
	}
	return false;
};

function check_sequences(tiles) {
	let tiles_copy = tiles.copy();
	for (let seq_num = 0; seq_num < parseInt(tiles.length / 3); seq_num++) {
		let find = 1;
		let seq = [tiles_copy[0]];
		let seq_index = [0];

		for (let i = 1; i < tiles_copy.length; i++) {
			if (tiles_copy[i] == tiles_copy[0] + find) {
				seq_index.push(i);
				find++;
			}
			if (find >= 3) break;
		}
		if (seq_index.length == 3) {
			tiles_copy.splice(seq_index[2], 1);
			tiles_copy.splice(seq_index[1], 1);
			tiles_copy.splice(0, 1)
		} else return false;
	}
	return true;
};



let hand_tiles = [];
let now_tiles_num = 0;

function choose_tile(id){
	id = parseInt(id);
	if (now_tiles_num >= 0 && now_tiles_num < 14){

		let same_tiles_num = 0;
		for(let tile of hand_tiles)
			if (tile == id) same_tiles_num++;
		if (same_tiles_num >= 4) return;

		now_tiles_num ++;
		hand_tiles.push(id);
		hand_tiles.sort(function(a,b){return a-b});
		let content = "";
		for(let i = 0; i < now_tiles_num; i++){
			content += `<button onclick="delete_tile(${i})">${all_tiles_dic[hand_tiles[i]]}</button>`;
		}
		document.getElementById("hands").innerHTML = content;
	}
	if (now_tiles_num == 13 || now_tiles_num == 14)
		print(check_situations(hand_tiles.copy()));
}

function delete_tile(index){
	index=parseInt(index);
	hand_tiles.splice(index, 1);
	now_tiles_num--;
	hand_tiles.sort(function(a,b){return a-b});
	let content = "";
	for(let i = 0; i < now_tiles_num; i++){
		content += `<button onclick="delete_tile(${i})">${all_tiles_dic[hand_tiles[i]]}</button>`;
	}
	document.getElementById("hands").innerHTML = content;
	if (now_tiles_num == 13 || now_tiles_num == 14)
		print(check_situations(hand_tiles.copy()));
}

function clear_tiles(){
	document.getElementById("hands").innerHTML = "";
	hand_tiles = [];
	now_tiles_num = 0;
	print("");
}



function print(str){
	document.getElementById("answer").innerHTML = str;
}

Array.prototype.copy = function(){
	let a=[];
	for (let i = 0; i < this.length; i++)
		a.push(this[i]);
	return a;
}