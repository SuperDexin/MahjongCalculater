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
	tiles.sort_tiles();

	for (let i = 0; i < out_group_num; i ++)
		if (out_tiles_now_num[i][0] != 3)
			return "";

	if (now_tiles_num == 14) return check_hu(tiles);

	if (now_tiles_num == 13) return check_ting(tiles);

	return "有问题，看见了请联系作者";
};

function check_ting(tiles) {
	for(let i = 0; i < out_group_num; i ++)
		if (((out_tiles)[i][0] != (out_tiles)[i][1] || (out_tiles)[i][0] != (out_tiles)[i][2])
				&& ((out_tiles)[i][0]+1 != (out_tiles)[i][1] || (out_tiles)[i][0]+2 != (out_tiles)[i][2]))
			return "没听";

	if (now_tiles_num == 13 && tiles.length % 3 != 1)
		return "没听";

	if (tiles.length == 1)
		return "听：" + all_tiles_dic[tiles[0]] + " ";

	let tings = [];
	for (let tile of all_tiles) {
		let tiles_copy = tiles.copy();
		tiles_copy.push(tile);
		tiles_copy.sort_tiles();

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
	for(let i = 0; i < out_group_num; i ++)
		if (((out_tiles)[i][0] != (out_tiles)[i][1] || (out_tiles)[i][0] != (out_tiles)[i][2])
				&& ((out_tiles)[i][0]+1 != (out_tiles)[i][1] || (out_tiles)[i][0]+2 != (out_tiles)[i][2]))
			return "没胡";

	tiles = tiles.concat(hu);
	tiles.sort_tiles();
	if (check_seven_pairs(tiles)) return "七对";
	else if (check_thirteen_yao(tiles)) return "十三幺";
	else if (check_chichen_hu(tiles)) return "和了";
	return "没胡";
};

function check_seven_pairs(tiles) {
	if (out_group_num != 0)
		return false;

	for (let i = 0; i < tiles.length; i += 2)
		if (!(tiles[i] == tiles[i + 1])) return false;
	return true;
};

function check_thirteen_yao(tiles) {
	if (out_group_num != 0)
		return false;

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

	if (tiles.length == 2)
		if (tiles[0] == tiles[1])
			return "胡了";
		else
			return "没胡";

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





let now_tiles_num = 0;
let out_group_num = 0;

let tile_region = 0; // 0 手牌，5 和牌，1234 副

let hand_tiles = [];
let hidden_tiles_num = [0];

let hu = [];
let hu_num = [0];

let out_tiles = [[],[],[],[]];
let out_tiles_now_num = [[0], [0], [0], [0]];

let out_type_array = [0, 0, 0, 0]; // 0无 1顺 2刻 3明杠 4暗杠


function choose_tile(id){
	id = parseInt(id);
	let tiles;
	let max;
	let now;
	let region;
	//let out_type_region;

	switch(tile_region){
		case (0): {
			tiles = hand_tiles;
			max = 13 - out_group_num * 3;
			now = hidden_tiles_num;
			region = document.getElementById("hands");
			break;
		}
		case (5): {
			tiles = hu;
			max = 1;
			now = hu_num;
			region = document.getElementById("winner");
			break;
		}
		default: {
			tiles = out_tiles[tile_region - 1];
			max = 3;
			now = out_tiles_now_num[tile_region - 1];
			region = document.getElementById(`out_tiles${tile_region}`);
			//out_type_region = document.getElementById(`out_type${tile_region}`)
		}
	}

	if (now[0] >= 0 && now[0] < max){

		let same_tiles_num = 0;
		let all = hand_tiles.concat(hu);
		for(let i = 0; i < out_group_num; i++){
			all = all.concat(out_tiles[i]);	
			if(out_type_array[i] == 3 || out_type_array[i] == 4)
				all.push(out_tiles[i][0]);
		}
		all.sort_tiles();
		for(tile of all)
			if (tile == id) same_tiles_num++;
		if (same_tiles_num >= 4) return;

		now_tiles_num ++;
		now[0]++;
		tiles.push(id);
		tiles.sort_tiles();

		let content = "";
		for(let i = 0; i < now[0]; i++){
			content += `<button id="hand${i}" onclick="delete_tile(${i}, ${tile_region})">${all_tiles_dic[tiles[i]]}</button>`;
		}

		region.innerHTML = content;

		check_out_type_region();
	}

	if ((now_tiles_num == 13 && hu_num[0] == 0) || now_tiles_num == 14 )
		print(check_situations(hand_tiles.copy()));
}

function delete_tile(index, now_region){
	index = parseInt(index);
	tile_region = parseInt(now_region);
	document.getElementById(`tile${tile_region}`).checked = true;
	let tiles;
	let max;
	let now;
	let region;

	switch(tile_region){
		case (0): {
			tiles = hand_tiles;
			max = 13 - out_group_num * 3;
			now = hidden_tiles_num;
			region = document.getElementById("hands");
			break;
		}
		case (5): {
			tiles = hu;
			max = 1;
			now = hu_num;
			region = document.getElementById("winner");
			break;
		}
		default: {
			tiles = out_tiles[tile_region - 1];
			max = 3;
			now = out_tiles_now_num[tile_region - 1];
			region = document.getElementById(`out_tiles${tile_region}`);
		}
	}
	print(tiles);
	
	now_tiles_num --;
	now[0] --;
	tiles.splice(index, 1);
	
	let content = "";
	for(let i = 0; i < now[0]; i++){
		content += `<button id="hand${i}" onclick="delete_tile(${i}, ${tile_region})">${all_tiles_dic[tiles[i]]}</button>`;
	}

	region.innerHTML = content;
	check_out_type_region();

	if ((now_tiles_num == 13 && hu_num[0] == 0) || now_tiles_num == 14 )
		print(check_situations(hand_tiles.copy()));
	else
		print("");
}

function set_out_group_num(value){
	value = parseInt(value);

	if (value < out_group_num){
		document.getElementById(`tile${value}`).checked = true;
	}

	out_group_num = value;
	if (13 - out_group_num * 3 < hidden_tiles_num[0]){
		hand_tiles.splice(13 - out_group_num * 3);
		hidden_tiles_num[0] = 13 - out_group_num * 3;
		let content = "";
		for(let i = 0; i < hidden_tiles_num[0]; i++)
			content += `<button id="hand${i}" onclick="delete_tile(${i}, 0)">${all_tiles_dic[hand_tiles[i]]}</button>`;
		document.getElementById("hands").innerHTML = content;
	}


	let region = document.getElementById("out_tiles");
	let content = "";
	for (let i = 1; i <= out_group_num; i++){
		content += "<div>";
		content += `<label for="tile${i}">副露${i}</label><br>`;
		content += `<label for="tile${i}"><div id="out_tiles${i}" class="out_tiles"></div></label>`;
		content += `<input type="radio" name="hand_tiles" value=${i} onchange="change_region(this.value)" id="tile${i}" style="margin: 0;">`;
		content += `<div id="out_type${i}"></div>`
		content += "</div>";
	}
	region.innerHTML = content;

	document.getElementById("hands").style.width = `calc(1.2rem * ${13 - out_group_num * 3} + ${2 * (13 - out_group_num * 3)}px)`;
	region.style.width = `calc(${out_group_num} * (1.2rem * 3 + 6px)) + ${out_group_num} * 2px`;
	
	out_tiles = [[],[],[],[]];
	out_tiles_now_num = [[0], [0], [0], [0]];
	now_tiles_num = hidden_tiles_num[0];
	out_type_array = [0, 0, 0, 0];
}

function change_region(value){
	tile_region = parseInt(value);
}

function check_out_type_region(){
	let temp = 0; // 0无 1顺 2只能明刻 3可以杠

	for (let i = 0; i < out_group_num; i++){

		if (out_tiles_now_num[i][0] != 3){
			temp = 0;
			out_type_array[i] = 0;
		}
		else if (out_tiles[i][0]+1 == out_tiles[i][1] && out_tiles[i][1]+1 == out_tiles[i][2])
			temp = 1;
		else if (out_tiles[i][0] == out_tiles[i][1] && out_tiles[i][1] == out_tiles[i][2]){

			let same_tiles_num = 0;
			let all = hand_tiles.concat(hu);
			for(let tile of out_tiles)
				all = all.concat(tile);
			all.sort_tiles();
			for(tile of all)
				if (tile == out_tiles[i][0]) same_tiles_num++;
			if (same_tiles_num >= 4){
				temp = 2; //只能明刻
			}
			else temp = 3; //可以杠
		}
		else temp = 0;

		let out_type_region;
		out_type_region = document.getElementById(`out_type${i+1}`);

		switch (temp){
			case 0:{
				out_type_region.innerHTML = "";
				out_type_array[i] = 0;
				break;
			}
			case 1:{
				out_type_region.innerHTML = "<input type='radio' checked='true'>明顺";
				out_type_array[i] = 1;
				break;
			}
			case 2:{
				out_type_region.innerHTML = "<input type='radio' checked='true'>明刻";
				out_type_array[i] = 2;
				break;
			}
			case 3:{
				switch (out_type_array[i]){
					case 0:
					case 1:
					case 2:{
						let content = "";
						content += `<input type='radio' id="out_type${i+1}0" name="out_type${i+1}"`;
						content += `value=2 checked='true' onchange="change_out_type(this.value, ${i})">`;
						content += `<label for="out_type${i+1}0">明刻</label><br>`;
						content += `<input type='radio' id="out_type${i+1}1" name="out_type${i+1}"`;
						content += `value=3 onchange="change_out_type(this.value, ${i})">`;
						content += `<label for="out_type${i+1}1">明杠</label><br>`;
						content += `<input type='radio' id="out_type${i+1}2" name="out_type${i+1}"`;
						content += `value=4 onchange="change_out_type(this.value, ${i})">`;
						content += `<label for="out_type${i+1}2">暗杠</label>`;
						out_type_region.innerHTML = content;
						out_type_array[i] = 2;
						break;
					}
				}
			}
		}
	}

}

function change_out_type(value, index){
	value = parseInt(value);
	index = parseInt(index);
	out_type_array[index] = value;
}



//-------------//

function print(str){
	document.getElementById("answer").innerHTML = str;
}

Array.prototype.copy = function(){
	let a=[];
	for (let i = 0; i < this.length; i++)
		a.push(this[i]);
	return a;
}

Array.prototype.sort_tiles = function(){
	this.sort(function(a,b){return a-b});
}

//-------------//


let richi_state = 0;
let circle_wind = 41;
let self_wind = 41;
let extra_states = [false, false, false, false, false, false] // false 无 true 有/ [0]自摸 [1]一发 [2]杠开 [3]抢杠 [4]海底/河底 [5]天/地和

function set_richi(value){
	value = parseInt(value);
	richi_state = value;
}

function set_circle_wind(value){
	value = parseInt(value);
	circle_wind = value;
}
function set_self_wind(value){
	value = parseInt(value);
	self_wind = value;
}

function set_extra_states(value){
	value = parseInt(value);
	extra_states[value] = !extra_states[value];
	if (!extra_states[value] && value == 0 && extra_states[2]) //杠开被选中的时候不能取消自摸
		extra_states[0] = true;

	if (extra_states[value]){
		switch (value){
			case 0: extra_states[3] = false; break; // 自摸必不抢杠
			case 1: extra_states[2] = false; break; // 一发必不岭上
			case 2: {
				extra_states[0] = true;  // 岭上必定自摸
				extra_states[1] = false; // 岭上必不一发
				extra_states[3] = false; // 岭上必不抢杠
				extra_states[4] = false; // 岭上必不海底
				break; 
			}
			case 3: {
				extra_states[0] = false; // 枪杠必不自摸
				extra_states[2] = false; // 枪杠必不杠开
				extra_states[4] = false; // 枪杠必不海底
				break; 
			}
			case 4: {
				extra_states[2] = false; // 海底必不杠开
				extra_states[3] = false; // 海底必不抢杠
				break;
			}
			case 5: {
				for(let i=0; i<5; i++){
					extra_states[i] = false;
				}
				break;
			}
		}
	}
	if (value != 5) extra_states[5] = false;

	for (let i=0; i<6; i++) document.getElementById(`fortune${i+1}`).checked = extra_states[i];
}


//----------//


function clear_tiles(){
	document.getElementById("hands").innerHTML = "";
	document.getElementById("winner").innerHTML = "";
	set_out_group_num(out_group_num);
	now_tiles_num = 0;
	hand_tiles = [];
	hidden_tiles_num = [0];
	hu = [];
	hu_num = [0];
	out_tiles = [[],[],[],[]];
	out_tiles_now_num = [[0], [0], [0], [0]];
	out_type_array = [0, 0, 0, 0];
	print("");
	document.getElementById(`tile${tile_region}`).checked = true;
}

