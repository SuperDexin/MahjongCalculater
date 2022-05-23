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


//-------------//

function print(str){
	document.getElementById("answer").innerHTML = str;
}

Array.prototype.copy = function(){
	let a = this.concat();
	return a;
}

Array.prototype.sort_tiles = function(){
	this.sort(function(a,b){return a-b});
}



//---------------------------------------//

function check_ting(tiles) {
	let tings = [];
	for (let tile of all_tiles) {
		let tiles_copy = tiles.copy();
		tiles_copy.push(tile);
		tiles_copy.sort_tiles();

		if (!(check_hu(tiles_copy) == 0)) tings.push(tile);
	}
	if (tings == undefined || tings.length == 0){
		return 0;
	}
	else return tings;
};

function check_hu(tiles) {

	tiles.sort_tiles();
	if (check_seven_pairs(tiles)) return 1;
	else if (check_chichen_hu(tiles)) return 1;
	return 0;
};

function check_seven_pairs(tiles) {
	for (let i = 0; i < tiles.length; i += 2){
		if (!(tiles[i] == tiles[i + 1])) return false;
		if (i < tiles.length-2 && (tiles[i] == tiles[i + 2]))
			return false;
	}
	return true;
};


function check_chichen_hu(tiles) {
	let pairs_index = [];

	if (tiles.length == 2){
		if (tiles[0] == tiles[1])
			return true;
		else
			return false;
	}

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
		
		if (triplets_num == (tiles.length - 2) / 3) return true;
		
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
				tiles_copy2.splice(triplets_index_copy[1], 3);
				tiles_copy2.splice(triplets_index_copy[0], 3);
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



//______________________________________//
//______________________________________//
let global_question_array;
let best_one;
let answer_content;

function refresh(){
	global_question_array = creat_question();
	let content = "";
	for (let i = 0; i < 14; i ++){
		content += `<button id="${global_question_array[i]}" onclick="show_answer(this.id)">${all_tiles_dic[global_question_array[i]]}</button>`;
	}
	document.getElementById("hands").innerHTML = content;
	document.getElementById("answer").innerHTML = "";
	answer_content = cal_answer(global_question_array);
}

function show_answer(id){
	id = parseInt(id);
	let content = "";
	let correct = false;
	for (let i = 0; i < best_one.length; i++){
		if (id == best_one[i]){
			correct = true;
			break;
		}
	}
	if (correct){
		content = "<span style='color: green; font-size: 1.5rem'>回答正确！</span><br>";
	} else {
		content = "<span style='color: red; font-size: 1.5rem'>回答错误！</span><br>";
	}
	content += `您的回答：${all_tiles_dic[id]}  正确答案：`;
	for (let i = 0; i < best_one.length; i++){
		content += `${all_tiles_dic[best_one[i]]} `;
	}

	content += "<br><br>" + answer_content;

	document.getElementById("answer").innerHTML = content;
}

function creat_question(){
	let temp_array;
	let question_array_copy;
	let question_array;

	do{
		temp_array = [	11, 11, 11, 11,
							12, 12, 12, 12,
							13, 13, 13, 13,
							14, 14, 14, 14,
							15, 15, 15, 15,
							16, 16, 16, 16,
							17, 17, 17, 17,
							18, 18, 18, 18,
							19, 19, 19, 19
							];
		question_array = [];

		for (let i = 0; i < 14; i++){
			let index;
			do {index = Math.floor(Math.random() * temp_array.length)} while (temp_array[index] == 0)
			question_array.push(temp_array[index]);
			temp_array[index] = 0;	
		}

		question_array_copy = question_array.copy();
		question_array_copy.sort_tiles();
	} while (!check_hu(question_array_copy))

	question_array_copy = question_array.copy();
	let temp_array_copy = temp_array.copy();
	let a = 0;
	let b = 0;
	let question_array_copy2

	do{
		if (a >= 16){
			temp_array_copy = temp_array.copy();
			question_array_copy = question_array.copy();
			b++;
			if (b >= 14) return creat_question();
		}
		let index;
		do {index = Math.floor(Math.random() * temp_array_copy.length)} while (temp_array_copy[index] == 0)
		question_array_copy[b] = temp_array_copy[index];
		temp_array_copy[index] = 0;	
		a++;
		question_array_copy2 = question_array_copy.copy();
		question_array_copy2.sort_tiles();		
	} while (check_hu(question_array_copy2))

	question_array_copy.sort_tiles();

	if (cal_can_be_played(question_array_copy) < 2)
		return creat_question();

	return question_array_copy;
}

function cal_answer(tiles){
	let can_be_played = [];
	let tings = [];
	let choices = 0;
	let tings_tiles_num = [];
	for (let i = 0; i < 14; i++){
		if (!(i > 0 && tiles[i] == tiles[i-1])){
			let tiles_copy = tiles.copy();
			tiles_copy.splice(i, 1);
			let temp = check_ting(tiles_copy);;
			if (temp != 0){
				tings.push(temp);
				can_be_played.push(tiles[i]);
				choices++;
				let num = 0;
				for(let j = 0; j < temp.length; j++){
					let temp_num = 0;
					for (let k = 0; k < 14; k ++){
						if(tiles[k] == temp[j])
							temp_num ++;
					}
					num += 4 - temp_num;
				}
				tings_tiles_num.push(num);
			}
		}
	}
	let content = "";
	for (let i = 0; i < choices; i++){
		content += `打${all_tiles_dic[can_be_played[i]]} 听${tings_tiles_num[i]}张 听`;
		for(let j = 0; j < tings[i].length; j++){
			content += ` ${all_tiles_dic[tings[i][j]]}`;
		}
		content += `<br>`;
	}

	get_max(tings_tiles_num, can_be_played)
	return content;
}

function cal_can_be_played(tiles){
	let choices = 0;
	for (let i = 0; i < 14; i ++){
		if (!(i > 0 && tiles[i] == tiles[i-1])){
			let tiles_copy = tiles.copy();
			tiles_copy.splice(i, 1);
			let temp = check_ting(tiles_copy);
			if (temp != 0){
				choices++;
			}	
		}	
	}
	return choices;
}

function get_max(num, tiles){
	let max = 0;
	best_one = [];
	for (let i = 0; i < num.length; i++){
		if (num[i] > max){
			max = num[i];
			best_one = [];
			best_one.push(tiles[i]);
		}
		else if (num[i] == max){
			best_one.push(tiles[i]);
		}
	}
}


