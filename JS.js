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


let now_tiles_num = 0; //总牌数 不计杠
let out_group_num = 0; //副露数

let tile_region = 0; //输入区域 0 手牌，5 和牌，1234 副

let hand_tiles = []; //暗牌序列
let hidden_tiles_num = [0]; //hidden_tiles_num[0] 暗牌数

let hu = []; //和张
let hu_num = [0]; //hu_num[0] 和张数

let out_tiles = [[],[],[],[]]; //四个副露序列
let out_tiles_now_num = [[0], [0], [0], [0]]; //out_tiles_now_num[i][0] 副露数列中的牌数

let out_type_array = [0, 0, 0, 0]; //副露类型 0无 1顺 2刻 3明杠 4暗杠


function choose_tile(id){
	id = parseInt(id);
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

	tiles_in_13_or_14();
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

	document.getElementById("richi1").disabled = false;
	document.getElementById("richi2").disabled = false;
	document.getElementById("richi1_label").style.color = "black";
	document.getElementById("richi2_label").style.color = "black";
	document.getElementById("gangkai").style.color = "black";
	document.getElementById("fortune3").disabled = false;

	if ((now_tiles_num == 13 && hu_num[0] == 0) || now_tiles_num == 14 )
		print(check_situations(hand_tiles.copy()));
	else
		print("");
}

function set_out_group_num(value){
	value = parseInt(value);

	if (value < out_group_num)
		document.getElementById(`tile${value}`).checked = true;

	if (value != 0){
		document.getElementById("fortune6").checked = false;
		extra_states[5] = false;
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
	now_tiles_num = hidden_tiles_num[0] + hu_num[0];
	out_type_array = [0, 0, 0, 0];
	print("");
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
	tiles_in_13_or_14();
}

function tiles_in_13_or_14(){
	document.getElementById("richi1").disabled = false;
	document.getElementById("richi2").disabled = false;
	document.getElementById("richi1_label").style.color = "black";
	document.getElementById("richi2_label").style.color = "black";

	let gang = false;

	if ((now_tiles_num == 13 && hu_num[0] == 0) || now_tiles_num == 14){
		for (state of out_type_array){
			if (state != 0 && state != 4){
				richi_state = 0;
				document.getElementById("richi0").checked = true;
				document.getElementById("richi1").disabled = true;
				document.getElementById("richi2").disabled = true;
				document.getElementById("richi1_label").style.color = "gray";
				document.getElementById("richi2_label").style.color = "gray";

				let yifa = document.getElementById("fortune2");
				let yifa_label = document.getElementById("yifa");
				yifa.checked = false;
				yifa.disabled = true;
				yifa_label.style.color = "gray";
				extra_states[1] = false;
			}
			if (state == 3 || state == 4) gang = true;
		}
			

		if (!gang) {
			document.getElementById("fortune3").checked = false;
			document.getElementById("gangkai").style.color = "gray";
			document.getElementById("fortune3").disabled = true;
			extra_states[2] = false;
		}
		print(check_situations(hand_tiles.copy()));
	}
}



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

//-------------//


let richi_state = 0; // 0无 1立 2两立
let circle_wind = 41; // 41东 43南 45西 47北
let self_wind = 41; // 41东 43南 45西 47北
let extra_states = [false, false, false, false, false, false] // false 无 true 有/ [0]自摸 [1]一发 [2]杠开 [3]抢杠 [4]海底/河底 [5]天/地和
let chang_num = 0; // 本场数
let dora_num = 0; // 宝牌数


function set_richi(value){
	value = parseInt(value);
	richi_state = value;
	let yifa = document.getElementById("fortune2");
	let yifa_label = document.getElementById("yifa");
	if (richi_state != 0){
		yifa.disabled = false;
		yifa_label.style.color = "black";
	}
	else {
		yifa.checked = false;
		yifa.disabled = true;
		yifa_label.style.color = "gray";
		extra_states[1] = false;
	}
	tiles_in_13_or_14();
}

function set_circle_wind(value){
	value = parseInt(value);
	circle_wind = value;
	show_user_state();
}
function set_self_wind(value){
	value = parseInt(value);
	self_wind = value;
	show_user_state();
}

function set_extra_states(value){
	value = parseInt(value);
	extra_states[value] = !extra_states[value]; //[0]自摸 [1]一发 [2]杠开 [3]抢杠 [4]海底/河底 [5]天/地和
	if (!extra_states[value])
		if (value == 0){
			extra_states[2] = false;
			extra_states[5] = false;
		}

	if (extra_states[value]){ 
		switch (value){
			case 0: extra_states[3] = false; break; // 自摸必不抢杠
			case 1: {
				extra_states[2] = false; // 一发必不岭上
				if (richi_state == 2){
					extra_states[4] = false; //两立直一发必不海底
				}
				break;
			}
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
				if (richi_state == 2){
					extra_states[1] = false; //两立直海底必不一发
				}
				break;
			}
			case 5: {
				extra_states[0] = true; //天地胡必是自摸
				for(let i=1; i<5; i++){
					extra_states[i] = false;
				}
				set_out_group_num(0);
				document.getElementById('out_group0').selected = true;
				break;
			}
		}
	}
	if (value != 5) extra_states[5] = false;

	for (let i=0; i<6; i++) document.getElementById(`fortune${i+1}`).checked = extra_states[i];

	tiles_in_13_or_14();
}

function change_chang(value){
	value = value.replace(/[^0-9]/g, "");
	let element = document.getElementById("state1");
	if (!value)
		element.value = chang_num;
	else {
		element.value = value;
		chang_num = parseInt(value);
	}
	show_user_state();
}


function change_dora(value){
	value = value.replace(/[^0-9]/, "");
	let element = document.getElementById("state1");
	if (value == "" || value == null || value == undefined)
		element.value = dora_num;
	else {
		element.value = value;
		dora_num = parseInt(value);
	}

	show_user_state();
}


function show_user_state(){
	let region = document.getElementById("user_state");
	let content = "";
	content += all_tiles_dic[circle_wind] + "圈 ";
	content += chang_num + "本场 ";
	content += all_tiles_dic[self_wind] + "位";
	if (self_wind == 41)
		content += " 庄家";
	else
		content += " 闲家";
	region.innerHTML = content;
	tiles_in_13_or_14();
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
	show_user_state();
}

// let now_tiles_num = 0; //总牌数 不计杠
// let out_group_num = 0; //副露数

// let tile_region = 0; //输入区域 0 手牌，5 和牌，1234 副

// let hand_tiles = []; //暗牌序列
// let hidden_tiles_num = [0]; //hidden_tiles_num[0] 暗牌数

// let hu = []; //和张
// let hu_num = [0]; //hu_num[0] 和张数

// let out_tiles = [[],[],[],[]]; //四个副露序列
// let out_tiles_now_num = [[0], [0], [0], [0]]; //out_tiles_now_num[i][0] 副露数列中的牌数

// let out_type_array = [0, 0, 0, 0]; //副露类型 0无 1顺 2刻 3明杠 4暗杠




//------------------//


// let richi_state = 0; // 0无 1立 2两立
// let circle_wind = 41; // 41东 43南 45西 47北
// let self_wind = 41; // 41东 43南 45西 47北
// let extra_states = [false, false, false, false, false, false] // false 无 true 有/ [0]自摸 [1]一发 [2]杠开 [3]抢杠 [4]海底/河底 [5]天/地和
// let chang_num = 0; // 本场数
// let dora_num = 0; // 宝牌数


let yiman_num = 0;
let fan = 0;
let menqing = true;

function calculate_fan(tiles, last_tile){
	if (now_tiles_num != 14)
		return;

	menqing = true;
	for (let i = 0; i < out_group_num; i++)
		if (out_type_array[i] != 4 && out_type_array[i] != 0)
			menqing = false;

	let content = "";

	yiman_num = 0;
	content += calculate_yiman(tiles, last_tile);
	content += "<br>";

	if (yiman_num != 0)
		return content += calculate_yiman_point();
	else
		return content += calculate_not_yiman(tiles, last_tile);
}

function calculate_yiman(tiles, last_tile){
	let content = "";
	let temp;
	let tianhu = 0; //0无 1天

	// 天地和
	if (extra_states[5]){
		yiman_num ++;
		if (self_wind == 41){ //庄
			tianhu = 1;
			content += "天和 1倍役满<br>";
		}
		else content += "地和 1倍役满<br>";
	}

	// 国士
	temp = yiman_guoshi(tiles, last_tile);

	if(temp != 0){
		if (temp == 2 || tianhu == 1){ //十三面或天胡
			content += "国士无双十三面 2倍役满<br>";
			yiman_num += 2;
		}else{
			content += "国士无双 1倍役满<br>";
			yiman_num += 1;
		}
		return content;
	}

	//九莲
	temp = yiman_jiulian(tiles, last_tile);
	if(temp != 0){
		if (temp == 2 || tianhu == 1){ //十三面或天胡
			content += "纯正九莲宝灯 2倍役满<br>";
			yiman_num += 2;
		}else{
			content += "九莲宝灯 1倍役满<br>";
			yiman_num += 1;
		}
		return content;
	}

	//四杠
	temp = yiman_sigang();
	if(temp != 0){
		content += "四杠子 1倍役满<br>";
		yiman_num += 1;
	}

	//四暗刻
	temp = yiman_4anke(last_tile);
	if(temp != 0){
		if (temp == 2 || tianhu == 1){ //十三面或天胡
			content += "四暗刻单骑 2倍役满<br>";
			yiman_num += 2;
		}else{
			content += "四暗刻 1倍役满<br>";
			yiman_num += 1;
		}
	}

	//绿一色
	temp = yiman_green(tiles, last_tile);
	if(temp != 0){
		content += "绿一色 1倍役满<br>";
		yiman_num += 1;
		return content;
	}

	//清老头
	temp = yiman_laotou(tiles, last_tile);
	if(temp != 0){
		content += "清幺九 1倍役满<br>";
		yiman_num += 1;
		return content;
	}

	//字一色
	temp = yiman_zi(tiles, last_tile);
	if(temp != 0){
		content += "字一色 1倍役满<br>";
		yiman_num += 1;
	}

	//大三元
	temp = yiman_3yuan(tiles, last_tile);
	if(temp != 0){
		content += "大三元 1倍役满<br>";
		yiman_num += 1;
		return content;
	}

	//四喜胡
	temp = yiman_4xi(tiles, last_tile);
	if(temp != 0){
		if (temp == 2 || tianhu == 1){ //十三面或天胡
			content += "大四喜 2倍役满<br>";
			yiman_num += 2;
		}else{
			content += "小四喜 1倍役满<br>";
			yiman_num += 1;
		}
		return content;
	}

	return content;
}

function yiman_guoshi(tiles, last_tile) {
	if (out_group_num != 0)
		return 0;

	let all = tiles.copy();
	all.push(last_tile);
	all.sort_tiles();

	let orphans = [11, 19, 21, 29, 31, 39, 41, 43, 45, 47, 51, 53, 55, 0];
	for (let i = 0; i < 14; i++)
		if (!(all[i] == orphans[i])){
			if (i == 0)
				return 0;
			else if (!(all[i] == all[i - 1]))
				return 0;
			else{
				all.splice(i, 1);
				break;
			}
		}
			
	for (let i = 0; i < 13; i++)
		if (!(all[i] == orphans[i])) return 0;

	for (let i = 0; i < 13; i++)
		if (!(tiles[i] == orphans[i])) return 1;

	return 2;
}

function yiman_jiulian(tiles, last_tile){
	if (out_group_num != 0)
		return 0;

	let all = tiles.copy();
	all.push(last_tile);
	all.sort_tiles();

	let kind = Math.floor(all[13] / 10);

	if (kind != 1 && kind != 2 && kind != 3)
		return 0;

	let seq = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9];
	for (let i = 0; i < 14; i++){
		if (Math.floor(all[i] / 10) != kind)
			return 0;
		if (!(all[i] == (kind * 10 + seq[i]))){
			if (i == 0 || i == 1 || i == 2 || i == 13 || i == 12 || i == 11)
				return 0;
			else if (!(all[i] == all[i - 1]))
				return 0;
			else{
				all.splice(i, 1);
				break;
			}
		}
	}

	for (let i = 0; i < 13; i++)
		if (!(all[i] == (kind * 10 + seq[i]))) return 0;

	for (let i = 0; i < 13; i++)
		if (!(tiles[i] == (kind * 10 + seq[i]))) return 1;
	return 2;
}

function yiman_sigang(){
	if (out_group_num != 4)
		return 0;

	for (let result of out_type_array)
		if (result != 3 && result != 4)
			return 0;
	return 1;
}

function yiman_4anke(last_tile){
	if (!menqing) return 0;

	let hand_tiles_copy = hand_tiles.copy();

	let triplets_index = [];
	let triplets_num = out_group_num;
	for (let i = 0; i < hand_tiles_copy.length - 2; i++)
		if (hand_tiles_copy[i] == hand_tiles_copy[i + 1]
			&& hand_tiles_copy[i] == hand_tiles_copy[i + 2]
			&& (i == 0 || !(hand_tiles_copy[i] == hand_tiles_copy[i - 1])))
			triplets_index.push(i);

	triplets_num += triplets_index.length;

	for(i = triplets_index.length - 1; i>=0; i--)
		hand_tiles_copy.splice(triplets_index[i], 3);

	if (hand_tiles_copy.length == 1 && hand_tiles_copy[0] == last_tile)
		return 2;
	if (hand_tiles_copy.length == 4 
		&& triplets_num == 3 
		&& hand_tiles_copy[0] == hand_tiles_copy[1]
		&& hand_tiles_copy[2] == hand_tiles_copy[3]
		&& (last_tile == hand_tiles_copy[0] || last_tile == hand_tiles_copy[2])
		&& extra_states[0]) //自摸
		return 1;

	return 0;
}

function yiman_green(tiles, last_tile){
	let all = tiles.copy();
	all.push(last_tile);
	for (let tile of all)
		if (tile != 32
			&& tile != 33
			&& tile != 34
			&& tile != 36
			&& tile != 38
			&& tile != 53)
			return 0;
	return 1;
}

function yiman_laotou(tiles, last_tile){
	let all = tiles.copy();
	all.push(last_tile);
	for (let tile of all)
		if (tile != 11
			&& tile != 21
			&& tile != 31
			&& tile != 19
			&& tile != 29
			&& tile != 39)
			return 0;
	return 1;
}

function yiman_zi(tiles, last_tile){
	let all = tiles.copy();
	all.push(last_tile);
	for (let tile of all)
		if (Math.floor(tile/10) != 4 && Math.floor(tile/10) != 5)
			return 0;
	return 1;
}

function yiman_3yuan(tiles, last_tile){
	let all = tiles.copy();
	all.push(last_tile);
	all.sort_tiles();
	if (all[13] == 55 && all[12] == 55 && all[11] == 55
		&& all[10] == 53 && all[9] == 53 && all[8] == 53
		&& all[7] == 51 && all[6] == 51 && all[5] == 51)
		return 1;
	return 0;
}

function yiman_4xi(tiles, last_tile){
	let all = tiles.copy();
	all.push(last_tile);
	let seq = [];
	let four_xi = [41, 41, 41, 43, 43, 43, 45, 45, 45, 47, 47, 47];

	for (let tile of all){
		if (tile == 41
			|| tile == 43
			|| tile == 45
			|| tile == 47)
			seq.push(tile);
	}

	if (seq.length == 12){
		for (let i = 0; i < 12; i++)
			if (seq[i] != four_xi[i])
				return 0;
		return 2;
	}
	if (seq.length == 11) return 1;
	else return 0;

}


function calculate_yiman_point(){
	if (yiman_num == 0)
		return;
	let content = `共计 ${yiman_num}倍役满<br><br>`;
	let a = 8000;
	a = yiman_num * a;
	let total;
	let xian_point;
	let zhuang_point;

	if (self_wind == 41){
		total = 6 * a + 300 * chang_num;
		if(extra_states[0]){
			xian_point = 2 * a + 100 * chang_num;
			content += `庄家 自摸 获 ${total} 点<br>每家付 ${xian_point} 点<br>`;
		}
		else{
			xian_point = 6 * a + 300 * chang_num;
			content += `庄家 荣胡 获 ${total} 点<br>`;
		}
	}
	else {
		total = 4 * a + 300 * chang_num;
		if(extra_states[0]){
			xian_point = 1 * a + 100 * chang_num;
			zhuang_point = 2 * a + 100 * chang_num;
			content += `闲家 自摸 获 ${total} 点<br>庄家付 ${zhuang_point} 点<br>闲家付 ${xian_point} 点<br>`;
		}
		else{
			xian_point = 4 * a + 300 * chang_num;
			content += `闲家 荣胡 获 ${total} 点<br>`;
		}
	}
	return content;
}

//---------------------------------------//


let fan_name_dic = {
	0	:	"七对",
	1	:	"二杯口",
	2	:	"清一色",
	3	:	"混一色",
	4	:	"断幺",
	5	:	"对对和",
	6	:	"三杠",
	7	:	"三暗刻",
	8	:	"三同刻",
	9	:	"小三元",
	10	:	"混幺",
	11	:	"平和",
	12	:	"一气通贯",
	13	:	"一杯口",
	14	:	"三色同顺",
	15	:	"纯全带幺",
	16	:	"混全带幺",
	17	:	"役牌"
}

let fan_dic = {};
fan_dic[0] = function fan_qidui (obj){
	if (!menqing) return false;
	let index = 0;
	let score = 2;

	let all = obj.all.copy();

	if (check_seven_pairs(all))
		return obj.add_fan(index, score);

	return false;
};

fan_dic[1] = function fan_erbei (obj){
	if (!menqing) return false;
	let index = 1;
	let score = 3;

	let all = obj.all.copy();

	for (let i = 0; i < 4; i++){
		if (obj.mianzi_type[i] != 0) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			return false;
	}

	for (let i = 0; i < 14; i += 2)
		if (!(all[i] == all[i + 1])) return false;

	return obj.add_fan(index, score);
};

fan_dic[2] = function fan_qing1se (obj){
	let index = 2;
	let score = menqing ? 6 : 5;

	let all = obj.all.copy();

	let kind = Math.floor(all[13] / 10);

	if (kind != 1 && kind != 2 && kind != 3)
		return false;

	for (tile of all)
		if (Math.floor(tile / 10) != kind)	
			return false;
		 
	return obj.add_fan(index, score);
};

fan_dic[3] = function fan_hun1se (obj){
	let index = 3;
	let score = menqing ? 3 : 2;

	let all = obj.all.copy();
	if (all[13] < 40) return false;
	if (all[0] > 40) return false;

	let kind = Math.floor(all[0] / 10);

	for (tile of all){
		let a = Math.floor(tile / 10);
		if (a != kind
			&& a != 4
			&& a != 5) return false;
	}

	return obj.add_fan(index, score);
};

fan_dic[4] = function fan_duanyao (obj){
	let index = 4;
	let score = 1;

	let all = obj.all.copy();

	for (tile of all){
		let a = (tile % 10);
		if ((a == 1 || a == 9) || tile > 40)
			return false;
	}

	return obj.add_fan(index, score);
};

fan_dic[5] = function fan_duiduihu (obj){
	if (obj.qidui) return false;
	let index = 5;
	let score = 2;

	for (let i = 0; i < 4; i++){
		if (obj.mianzi_type[i] != 1
		&& obj.mianzi_type[i] != 3
		&& obj.mianzi_type[i] != 4) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
		return false;
	}

	return obj.add_fan(index, score);
};


fan_dic[6] = function fan_3gang (obj){
	if (obj.qidui) return false;
	let index = 6;
	let score = 2;
	let gang = 0;

	for (let i = 0; i < out_group_num; i++)
		if (out_type_array[i] == 3 || out_type_array[i] == 4)
			gang ++;

	if (gang != 3) return false;
	return obj.add_fan(index, score);
};

fan_dic[7] = function fan_3anke (obj){
	if (obj.qidui) return false;
	let index = 7;
	let score = 2;
	let anke = 0;
	let anke_array = [];

	for (let i = 0; i < 4; i++){
		if (obj.mianzi_type[i] == 1
		|| obj.mianzi_type[i] == 4){ // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			anke_array.push(i);
			anke ++;
		}
	}
	if (anke < 3) return false; //小于三刻

	if (extra_states[0]) return obj.add_fan(index, score); //大于等于三刻且自摸

	if (anke == 3 && anke_array.indexOf(obj.hu_pos[0]) != -1) // 有一个刻荣和成刻，说明只有两个暗刻
		return false; 

	return obj.add_fan(index, score); // 四刻荣和
};

fan_dic[8] = function fan_3tongke (obj){
	if (obj.qidui) return false;
	let index = 8;
	let score = 2;
	let ke_array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	for (let i = 0; i < 4; i++){
		if ((obj.mianzi_type[i] == 1
		|| obj.mianzi_type[i] == 3
		|| obj.mianzi_type[i] == 4) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
		&& obj.mianzi_array[i][0] < 40){
			ke_array[obj.mianzi_array[i][0] % 10] ++;
		}
	}
	
	return (ke_array.indexOf(3) != -1) ? obj.add_fan(index, score) : false;
};

fan_dic[9] = function fan_xiao3yuan (obj){
	if (obj.qidui) return false;
	let index = 9;
	let score = 2;

	let all = obj.all.copy();

	if (all[13] == 55
		&& all[12] == 55
		&& all[10] == 53
		&& all[9] == 53
		&& all[7] == 51
		&& all[6] == 51
		&& all[5] != 51)
		return obj.add_fan(index, score);
	return false;
};

fan_dic[10] = function fan_hunlaotou (obj){
	let index = 10;
	let score = 2;

	let all = obj.all.copy();

	for (tile of all)
		if (tile < 40 && (tile % 10 != 1 && tile % 10 != 9))
			return false;
	
	return obj.add_fan(index, score);
};

fan_dic[11] = function fan_pinghu (obj){
	if (obj.qidui) return false;

	if (out_group_num != 0)
		return false;

	if (obj.last_tile > 40)
		return false;
	
	let index = 11;
	let score = 1;

	for (let i = 0; i < 4; i++){
		if (obj.mianzi_type[i] != 0) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			return false;
	}

	if (obj.hu_pos[0] == 5) return false;
	if (obj.hu_pos[1] == 1) return false; // 坎张
	if ((obj.last_tile % 10 == 3 && obj.hu_pos[1] == 2) || (obj.last_tile % 10 == 7 && obj.hu_pos[1] == 0)) //边张
		return false

	return obj.add_fan(index, score);
};

fan_dic[12] = function fan_1qi (obj){
	if (obj.qidui) return false;

	let index = 12;
	let score = menqing ? 2 : 1;
	let all = obj.all.copy();
	let shun = 0;
	let temp = 0;
	let temp_dic = {
		11: 11,
		14: 22,
		17: 33,
		21: 5,
		24: 10,
		27: 15,
		31: 7,
		34: 14,
		37: 21
	};

	for (let i = 0; i < 4; i++){
		if ((obj.mianzi_type[i] == 0
		|| obj.mianzi_type[i] == 2) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
		&& (obj.mianzi_array[i][0] % 10 == 1 
			|| obj.mianzi_array[i][0] % 10 == 4
			|| obj.mianzi_array[i][0] % 10 == 7)){
			shun ++;
			temp += temp_dic[obj.mianzi_array[i][0]];
		}
	}

	if (shun == 3)
		return (temp % 6 == 0) ? add_fan(index, score) : false;

	if (shun == 4)
		for (let i of obj.mianzi_array)
			if ((temp - temp_dic[i[0]]) % 6 == 0) return obj.add_fan(index, score);

	return false;
};

fan_dic[13] = function fan_1bei (obj){
	if (obj.qidui) return false;
	if (!menqing) return false;
	if (obj.fan_score_array[1] != 0) return false;
	let index = 13;
	let score = 1;
	let all = obj.all.copy();
	let shun_array = [];

	for (let i = 0; i < 4; i++){
		if (obj.mianzi_type[i] == 0
		|| obj.mianzi_type[i] == 2){ // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			if (shun_array.indexOf(obj.mianzi_array[i][0]) != -1){
				return obj.add_fan(index, score);
			}
			shun_array.push(obj.mianzi_array[i][0]);
		}
	}

	return false;
};


fan_dic[14] = function fan_3tongshun (obj){
	if (obj.qidui) return false;
	let index = 14;
	let score = menqing ? 2 : 1;
	let shun_array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let temp_array = [];

	for (let i = 0; i < 4; i++){
		if ((obj.mianzi_type[i] == 0
		|| obj.mianzi_type[i] == 2) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
		&& obj.mianzi_array[i][0] < 40){
			if (temp_array.indexOf(obj.mianzi_array[i][0]) == -1){
				temp_array.push(obj.mianzi_array[i][0]);
				shun_array[obj.mianzi_array[i][0] % 10] ++;
			}
		}
	}
	
	return (shun_array.indexOf(3) != -1) ? obj.add_fan(index, score) : false;

};


fan_dic[15] = function fan_chunquan (obj){
	if (obj.qidui) return false;
	let index = 15;
	let score = menqing ? 3 : 2;
	let shun_array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let temp_array = [];

	for (let i = 0; i < 4; i++){
		if (!(obj.mianzi_array[i][0] < 40
			&& (obj.mianzi_array[i][0] % 10 == 1 || obj.mianzi_array[i][2] % 10 == 9)))
			return false;
	}

	console.log(obj.jiang);
	
	return (obj.jiang < 40 && (obj.jiang % 10 == 1 || obj.jiang % 10 == 9)) ? obj.add_fan(index, score) : false;
};


fan_dic[16] = function fan_hunquan (obj){
	if (obj.qidui) return false;
	let all = obj.all.copy();
	if (all[13] < 40) return false;

	let index = 16;
	let score = menqing ? 2 : 1;
	let shun_array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let temp_array = [];

	for (let i = 0; i < 4; i++){
		if (!(obj.mianzi_array[i][0] > 40
			|| obj.mianzi_array[i][0] % 10 == 1
			|| obj.mianzi_array[i][2] % 10 == 9))
			return false;
	}
	
	return (obj.jiang > 40 || obj.jiang % 10 == 1 || obj.jiang % 10 == 9) ? obj.add_fan(index, score) : false;
};


fan_dic[17] = function fan_yi (obj){
	if (obj.qidui) return false;
	let index = 17;
	let score = 0;
	for (let i = 0; i < 4; i++){
		if ((obj.mianzi_type[i] == 1
		|| obj.mianzi_type[i] == 3
		|| obj.mianzi_type[i] == 4)){ // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			if (obj.mianzi_array[i][0] > 40){
				switch (obj.mianzi_array[i][0]){ // this.yi = [0, 0, 0, 0, 0]; //0中 1发 2白 3门风 4圈风
					case 51: obj.yi[0]++; score++; break;
					case 53: obj.yi[1]++; score++; break;
					case 55: obj.yi[2]++; score++; break;
				}
				if(obj.mianzi_array[i][0] == self_wind){
					obj.yi[3]++;
					score++;
				}
				if(obj.mianzi_array[i][0] == circle_wind){
					obj.yi[4]++;
					score++;
				}
			}
		}
	}

	return obj.add_fan(index, score);
};


//---------------------------------------//

class mianzi {
	constructor(tiles, last_tile) {
		this.tiles = [];
		this.tiles = this.tiles.copy();
		this.last_tile = last_tile;
		this.mianzi_array = [[]];
		this.mianzi_type = [[]];
		this.jiang = [];
		this.possible_mianzi = 0;
		this.hand_tiles = hand_tiles.copy();
	}

	check_seq (tiles){
		let tiles_copy = tiles.copy();
		let seq = [];

		for (let seq_num = 0; seq_num < parseInt(tiles.length / 3); seq_num++) {
			let find = 1;
			let seq_index = [0];

			for (let i = 1; i < tiles_copy.length; i++) {
				if (tiles_copy[i] == tiles_copy[0] + find) {
					seq_index.push(i);
					find++;
				}
				if (find >= 3) break;
			}
			if (seq_index.length == 3) {
				seq.push(tiles_copy[seq_index[2]]);
				seq.push(tiles_copy[seq_index[1]]);
				seq.push(tiles_copy[0]);
				tiles_copy.splice(seq_index[2], 1);
				tiles_copy.splice(seq_index[1], 1);
				tiles_copy.splice(0, 1); 
			} else return false;
		}
		return seq.reverse();
	}


	split_mianzi(){
		let out_tiles_temp = [];
		let out_type_temp = [];
		for (let i = 0; i < out_group_num; i++){
			out_tiles_temp.push(out_tiles[i]);
			if (out_type_array[i] == 1)
				out_type_temp.push(2); // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			else if (out_type_array[i] == 2 || out_type_array[i] == 3)
				out_type_temp.push(3); 
			else if (out_type_array[i] == 4)
				out_type_temp.push(4);
		}

		let pairs_index = [];
		let all = this.hand_tiles.copy();
		all.push(this.last_tile);
		all.sort_tiles();

		if (all.length == 2){
			this.jiang[0] = this.last_tile;
			this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
			this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();
			this.possible_mianzi = 1;
			return;
		}

		for (let i = 0; i < all.length; i++)
			if (i < all.length - 1 && all[i] == all[i + 1] && (i == 0 || !(all[i] == all[i - 1]))) pairs_index.push(i);

		for (let pair_num = 0; pair_num < pairs_index.length; pair_num++) {
			let triplets_index = [];
			let tiles_copy = all.copy();
			let jiang_temp = tiles_copy[pairs_index[pair_num]];
			
			tiles_copy.splice(pairs_index[pair_num], 2);

			for (let i = 0; i < tiles_copy.length; i++)
				if (i < tiles_copy.length - 2
					&& tiles_copy[i] == tiles_copy[i + 1]
					&& tiles_copy[i] == tiles_copy[i + 2]
					&& (i == 0 || !(tiles_copy[i] == tiles_copy[i - 1]))){
					triplets_index.push(i);
				}
					
			let triplets_num = triplets_index.length;


			let temp = this.check_seq(tiles_copy);
			if (temp != false) {
				this.mianzi_array.push([]);
				this.mianzi_type.push([]);
				this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
				this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();
				for (let i = 0; i < temp.length / 3; i++){
					this.mianzi_array[this.possible_mianzi].push(
						[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
					this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
				}
				this.jiang[this.possible_mianzi] = jiang_temp;
				this.possible_mianzi ++;
			}
			
			if (triplets_num == tiles_copy.length / 3){
				this.mianzi_array.push([]);
				this.mianzi_type.push([]);
				this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
				this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();
				for (let i = 0; i < triplets_num; i++){
					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[i]], tiles_copy[triplets_index[i]], tiles_copy[triplets_index[i]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
				}
				this.jiang[this.possible_mianzi] = jiang_temp;
				this.possible_mianzi ++;
				return;
			}

			
			if (triplets_num == 1) {
				let tiles_copy2 = tiles_copy.copy();
				tiles_copy2.splice(triplets_index[0], 3);

				let temp = this.check_seq(tiles_copy2);
				if (temp != false) {
					this.mianzi_array.push([]);
					this.mianzi_type.push([]);
					this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
					this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();
					
					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[0]], tiles_copy[triplets_index[0]], tiles_copy[triplets_index[0]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠

					for (let i = 0; i < temp.length / 3; i++){
						this.mianzi_array[this.possible_mianzi].push(
							[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
						this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
					}
					this.jiang[this.possible_mianzi] = jiang_temp;
					this.possible_mianzi ++;
				}
			}

			if (triplets_num == 2) {
				for (let j = 0; j < 2; j++) {
					let tiles_copy2 = tiles_copy.copy();
					tiles_copy2.splice(triplets_index[j], 3);
					
					let temp = this.check_seq(tiles_copy2);
					if (temp != false) {
						this.mianzi_array.push([]);
				this.mianzi_type.push([]);
						this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
						this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();
						
						this.mianzi_array[this.possible_mianzi].push(
							[tiles_copy[triplets_index[j]], tiles_copy[triplets_index[j]], tiles_copy[triplets_index[j]]]);
						this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
						
						for (let i = 0; i < temp.length / 3; i++){
							this.mianzi_array[this.possible_mianzi].push(
								[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
							this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
						}
						this.jiang[this.possible_mianzi] = jiang_temp;
						this.possible_mianzi ++;
					}
				}

				let tiles_copy2 = tiles_copy.copy();
				tiles_copy2.splice(triplets_index[1], 3);
				tiles_copy2.splice(triplets_index[0], 3);
				let temp = this.check_seq(tiles_copy2);
				if (temp != false) {
					this.mianzi_array.push([]);
					this.mianzi_type.push([]);
					this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
					this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();

					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[1]], tiles_copy[triplets_index[1]], tiles_copy[triplets_index[1]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[0]], tiles_copy[triplets_index[0]], tiles_copy[triplets_index[0]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠

					for (let i = 0; i < temp.length / 3; i++){
						this.mianzi_array[this.possible_mianzi].push(
							[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
						this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
					}
					this.jiang[this.possible_mianzi] = jiang_temp;
					this.possible_mianzi ++;
				}
			}

			if (triplets_num == 3) {
				for (let j = 0; j < 3; j++) {
					let tiles_copy2 = tiles_copy.copy();
					tiles_copy2.splice(triplets_index[j], 3);

					let temp = this.check_seq(tiles_copy2);
					if (temp != false) {
						this.mianzi_array.push([]);
						this.mianzi_type.push([]);
						this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
						this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();
						
						this.mianzi_array[this.possible_mianzi].push(
							[tiles_copy[triplets_index[j]], tiles_copy[triplets_index[j]], tiles_copy[triplets_index[j]]]);
						this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
						
						for (let i = 0; i < temp.length / 3; i++){
							this.mianzi_array[this.possible_mianzi].push(
								[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
							this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
						}
						this.jiang[this.possible_mianzi] = jiang_temp;
						this.possible_mianzi ++;
					}
				}

				for (let j = 0; j < 3; j++) {
					let tiles_copy2 = tiles_copy.copy();
					let triplets_index_copy = triplets_index.copy();
					triplets_index_copy.splice(j, 1);
					tiles_copy2.splice(triplets_index_copy[1], 3);
					tiles_copy2.splice(triplets_index_copy[0], 3);

					let temp = this.check_seq(tiles_copy2);
					if (temp != false) {
						this.mianzi_array.push([]);
						this.mianzi_type.push([]);
						this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
						this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();

						this.mianzi_array[this.possible_mianzi].push(
							[tiles_copy[triplets_index_copy[1]], tiles_copy[triplets_index_copy[1]], tiles_copy[triplets_index_copy[1]]]);
						this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
						this.mianzi_array[this.possible_mianzi].push(
							[tiles_copy[triplets_index_copy[0]], tiles_copy[triplets_index_copy[0]], tiles_copy[triplets_index_copy[0]]]);
						this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠

						for (let i = 0; i < temp.length / 3; i++){
							this.mianzi_array[this.possible_mianzi].push(
								[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
							this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
						}
						this.jiang[this.possible_mianzi] = jiang_temp;
						this.possible_mianzi ++;
					}
				}

				let tiles_copy2 = tiles_copy.copy();
				tiles_copy2.splice(triplets_index[2], 3);
				tiles_copy2.splice(triplets_index[1], 3);
				tiles_copy2.splice(triplets_index[0], 3);
				let temp = this.check_seq(tiles_copy2);
				if (temp != false) {
					this.mianzi_array.push([]);
					this.mianzi_type.push([]);
					this.mianzi_array[this.possible_mianzi] = out_tiles_temp.copy();
					this.mianzi_type[this.possible_mianzi] = out_type_temp.copy();

					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[2]], tiles_copy[triplets_index[2]], tiles_copy[triplets_index[2]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[1]], tiles_copy[triplets_index[1]], tiles_copy[triplets_index[1]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
					this.mianzi_array[this.possible_mianzi].push(
						[tiles_copy[triplets_index[0]], tiles_copy[triplets_index[0]], tiles_copy[triplets_index[0]]]);
					this.mianzi_type[this.possible_mianzi].push(1);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠

					for (let i = 0; i < temp.length / 3; i++){
						this.mianzi_array[this.possible_mianzi].push(
							[temp[3 * i], temp[3 * i + 1], temp[3 * i + 2]]);
						this.mianzi_type[this.possible_mianzi].push(0);// mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
					}
					this.jiang[this.possible_mianzi] = jiang_temp;
					this.possible_mianzi ++;
				}
			}
		}
		return;
	};
}



class one_of_possible_mianzi{
	constructor(obj, num, tiles, last_tile){
		this.mianzi_array = obj.mianzi_array[num];
		this.mianzi_type = obj.mianzi_type[num];
		this.jiang = obj.jiang[num];
		this.tiles = tiles;
		this.last_tile = last_tile;
		this.hu_pos = [];
		this.hu_pos_num = 0;
		this.find_hu_pos();
	}

	find_hu_pos(){
		for(let i = 0; i < 4; i++)
			for (let j = 0; j < 3; j++)
				if (this.last_tile == this.mianzi_array[i][j]){
					this.hu_pos.push([i, j]);
					this.hu_pos_num ++;
					break;
				}
		if(this.jiang == this.last_tile){
			this.hu_pos.push([5, 0]);
			this.hu_pos_num ++;
		}
	}
}

class one_of_possible_hu_pos {
	constructor(obj, num){
		this.mianzi_array = obj.mianzi_array;
		this.mianzi_type = obj.mianzi_type;
		this.jiang = obj.jiang;
		this.tiles = obj.tiles;
		this.last_tile = obj.last_tile;
		this.hu_pos = obj.hu_pos[num];
		this.fan = 0;
		this.fan_score_array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.qidui = false;
		this.all = this.tiles.copy();
		this.all.push(this.last_tile);
		this.all.sort_tiles();

		this.yi = [0, 0, 0, 0, 0]; //0中 1发 2白 3门风 4圈风
		this.fu = 0;
	}

	add_fan(index, num){
		this.fan_score_array[index] = num;
		this.fan += num;

		if (index == 0) //七对
			this.qidui = true;
		if (index == 1 && this.qidui){ // 两杯
			this.qidui = false;
			this.fan -= 2;
			this.fan_score_array[0] = 0;
		}
		return true;
	}
}


function calculate_not_yiman(tiles, last_tile){
	let mianzis = new mianzi(tiles, last_tile);

	mianzis.split_mianzi();
	let mianzi_array = mianzis.mianzi_array;
	let mianzi_type = mianzis.mianzi_type;
	let jiang = mianzis.jiang;
	let possible_mianzi = mianzis.possible_mianzi;
	let content = "";

	// for (let i = 0; i < possible_mianzi; i++){
	// 	content += "组" + (i + 1) + ":<br>";
	// 	for (let j = 0; j < 4; j++){
	// 		for (let k = 0; k < 3; k++){
	// 			content += all_tiles_dic[mianzi_array[i][j][k]];
	// 		}
	// 		let temp;
	// 		switch (mianzi_type[i][j]){
	// 			case 0: temp = "（暗顺）"; break;
	// 			case 1: temp = "（暗刻）"; break;
	// 			case 2: temp = "（明顺）"; break;
	// 			case 3: temp = "（明刻/杠）"; break;
	// 			case 4: temp = "（暗杠）"; break;
	// 		}
	// 		content += temp;
	// 		content += "<br>";
	// 	}
	// 	content += all_tiles_dic[jiang[i]] + all_tiles_dic[jiang[i]] + "<br> <br>";
		
	// }

	let obj_array = [];
	let highest_fan = 0;
	let highest_index = 0;

	for (let i = 0; i < possible_mianzi; i++){
		let obj = calculate_not_yiman_fan(mianzis, i, tiles, last_tile);
		obj_array.push(obj);
		if (obj.fan >= highest_fan){
			highest_fan = obj.fan;
			highest_index = i;
		}
	}

	let fan = highest_fan;
	let final_obj = obj_array[highest_index];

	switch (richi_state){
		case 1: content += "立直 1 番<br>"; fan += 1; break;
		case 2: content += "两立直 2 番<br>"; fan += 2; break;
	}

	if (menqing && extra_states[0]){ //extra_states [0]自摸 [1]一发 [2]杠开 [3]抢杠 [4]海底/河底 [5]天/地和
		content += "门清自摸 1 番<br>"
		fan += 1;
	}

	if (extra_states[1]){
		content += "一发 1 番<br>"
		fan += 1;
	}

	if (extra_states[2]){
		content += "岭上开花 1 番<br>"
		fan += 1;
	}

	if (extra_states[3]){
		content += "抢杠 1 番<br>"
		fan += 1;
	}

	if (extra_states[4] && self_wind == 41){
		content += "海底捞月 1 番<br>"
		fan += 1;
	}

	if (extra_states[4] && self_wind != 41){
		content += "河底捞鱼 1 番<br>"
		fan += 1;
	}

	for (let i = 0; i < 17; i++){
		if (final_obj.fan_score_array[i] != 0){
			content += fan_name_dic[i];
			content += ` ${final_obj.fan_score_array[i]} 番<br>`;
		}
	}


	for (let i = 0; i < 5; i++){
		if (final_obj.yi[i] != 0){ //0中 1发 2白 3门风 4圈风
			let temp = "";
			switch (i){
				case 0: temp = "役牌 中"; break;
				case 1: temp = "役牌 发"; break;
				case 2: temp = "役牌 白"; break;
				case 3: temp = "门风刻"; break;
				case 4: temp = "圈风刻"; break;
			}
			content += temp;
			content += " 1 番<br>";
		}
	}

	content += `宝牌 ${dora_num} 番<br>`;
	fan += dora_num;

	content += `共计 ${fan} 番<br><br>`;

	content += calculate_fu(final_obj);
	let fu = final_obj.fu;

	content += `共计 ${fu} 符<br>`;
	if (fu % 10 != 0)
		content += `切上 ${Math.ceil(fu / 10) * 10} 符<br>`;

	content += "<br>";

	content += calculate_dian(final_obj);


	return content;
}

function calculate_not_yiman_fan(obj, num, tiles, last_tile) {

	let one = new one_of_possible_mianzi(obj, num, tiles, last_tile);
	let hu_pos_num = one.hu_pos_num;
	let obj_array = [];
	let highest_fan = 0;
	let highest_index = 0;
	for (let i = 0; i < hu_pos_num; i++){
		let one_pos = new one_of_possible_hu_pos(one, i);
		for (let j = 0; j < 18; j++){
			fan_dic[j](one_pos);
		}
		obj_array.push(one_pos);
		if (one_pos.fan >= highest_fan){
			highest_fan = one_pos.fan;
			highest_index = i;
		}
	}
	return obj_array[highest_index];
}

function calculate_fu(obj){
	let content = "";
	let fu = 20;
	let pos = obj.hu_pos;

	if(obj.qidui){
		obj.fu = 25;
		content = "七对 25 符<br>";
		return content;
	}

	if (obj.fan_score_array[11] && extra_states[0]){ //平和自摸
		obj.fu = 20;
		content = "平和自摸 20 符<br>";
		return content;	
	}

	
	if (obj.last_tile < 40){
		let temp = 0;
		for (let i = 0; i < 4; i++){
			if (obj.mianzi_type[i] == 0 || obj.mianzi_type[i] == 2) // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
				temp++;
		}

		if (temp == 4){
			if (obj.hu_pos[0] == 5) temp = 0;
			if (obj.hu_pos[1] == 1) temp = 0; // 坎张
			if ((obj.last_tile % 10 == 3 && obj.hu_pos[1] == 2) || (obj.last_tile % 10 == 7 && obj.hu_pos[1] == 0)) //边张
				temp = 0;			
		}
		if (temp == 4 && !extra_states[0]){
			obj.fu = 30;
			content = "副露平和型荣和 30 符<br>";
			return content;			
		}
	}
	
	content += "底符 20 符<br>"
	if (menqing) {
		fu += 10;
		content += "门清 10 符<br>";
	}
	if(pos[0] == 5){ //单钓将
		fu += 2;
		content += "钓将 2 符<br>";
	}
	else if (obj.mianzi_type[pos[0]] == 0){ // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
		if ((obj.last_tile % 10 == 3 && obj.hu_pos[1] == 2) || (obj.last_tile % 10 == 7 && obj.hu_pos[1] == 0)){ //边张
			fu += 2;
			content += "边张 2 符<br>";
		}
		else if (obj.hu_pos[1] == 1){ // 坎张
			fu += 2;
			content += "坎张 2 符<br>";
		}
	}
	if (obj.jiang == circle_wind){
		fu += 2;
		content += "圈风将 2 符<br>";
	}
	if (obj.jiang == self_wind){
		fu += 2;
		content += "门风将 2 符<br>";
	}
	if (obj.jiang > 50){
		fu += 2;
		content += "役牌将 2 符<br>";
	}

	let anke = 0;
	let mingke = 0;
	let angang = 0;
	let minggang = 0;
	let anke_19 = 0;
	let mingke_19 = 0;
	let angang_19 = 0;
	let minggang_19 = 0; 

	for (let i = 0; i < out_group_num; i++){
		if(out_type_array[i] == 2){ //0无 1顺 2刻 3明杠 4暗杠
			if (out_tiles[i][0] > 40 || out_tiles[i][0] % 10 == 1 || out_tiles[i][0] % 10 == 9)
				mingke_19 += 4;
			else mingke += 2;
		}
		if(out_type_array[i] == 3){ //0无 1顺 2刻 3明杠 4暗杠
			if (out_tiles[i][0] > 40 || out_tiles[i][0] % 10 == 1 || out_tiles[i][0] % 10 == 9)
				minggang_19 += 16;
			else minggang += 8;
		}
		if(out_type_array[i] == 4){ //0无 1顺 2刻 3明杠 4暗杠
			if (out_tiles[i][0] > 40 || out_tiles[i][0] % 10 == 1 || out_tiles[i][0] % 10 == 9)
				angang_19 += 32;
			else angang += 16;
		}
	}

	for (let i = 0; i < 4; i++){
		if (obj.mianzi_type[i] == 1){ // mianzi_type 0暗顺，1暗刻，2明顺，3明刻/杠, 4暗杠
			if (obj.mianzi_array[i][0] > 40 || obj.mianzi_array[i][0] % 10 == 1 || obj.mianzi_array[i][0] % 10 == 9)
				anke_19 += 8;
			else anke += 4;
		}
	}

	fu = fu + anke + mingke + angang + minggang + anke_19 + mingke_19 + angang_19 + minggang_19;

	obj.fu = fu;

	if (mingke != 0) content += `明刻 ${mingke} 符<br>`;
	if (mingke_19 != 0) content += `明幺九刻 ${mingke_19} 符<br>`;	
	if (anke != 0) content += `暗刻 ${anke} 符<br>`;
	if (anke_19 != 0) content += `暗幺九刻 ${anke_19} 符<br>`;
	if (minggang != 0) content += `明杠 ${minggang} 符<br>`;
	if (minggang_19 != 0) content += `明幺九杠 ${minggang_19} 符<br>`;
	if (angang != 0) content += `暗杠 ${angang} 符<br>`;
	if (angang_19 != 0) content += `暗幺九杠 ${angang_19} 符<br>`;

	return content;
}

function calculate_dian (obj){
	let fu = obj.fu;
	fu = Math.ceil(fu / 10) * 10;
	let fan = obj.fan + dora_num;
	let content = "";
	let total;
	let xian_point;
	let zhuang_point;
	let a;

	if (fan >= 5){
		switch(fan){
			case 5: a = 2000; content += "满贯<br>"; break;
			case 6: 
			case 7: a = 3000; content += "跳满<br>"; break;
			case 8:
			case 9:
			case 10: a = 4000; content += "倍满<br>"; break;
			case 11:
			case 12: a = 6000; content += "三倍满<br>"; break;
			default: a = 8000; content += "累计役满<br>"; break;
		}
	}
	else{
		a = fu * (2 ** (2 + fan));
		if (a > 2000){
			a = 2000;
			content += "满贯<br>";
		}
	} 
	if (self_wind == 41){
		total = 6 * a + 300 * chang_num;
		if(extra_states[0]){
			xian_point = 2 * a + 100 * chang_num;
			content += `庄家 自摸 获 ${total} 点<br>每家付 ${xian_point} 点<br>`;
		}
		else{
			xian_point = 6 * a + 300 * chang_num;
			content += `庄家 荣胡 获 ${total} 点<br>`;
		}
	}
	else {
		total = 4 * a + 300 * chang_num;
		if(extra_states[0]){
			xian_point = 1 * a + 100 * chang_num;
			zhuang_point = 2 * a + 100 * chang_num;
			content += `闲家 自摸 获 ${total} 点<br>庄家付 ${zhuang_point} 点<br>闲家付 ${xian_point} 点<br>`;
		}
		else{
			xian_point = 4 * a + 300 * chang_num;
			content += `闲家 荣胡 获 ${total} 点<br>`;
		}
	}
	return content;
}


//---------------------------------------//

function check_situations(tiles) {
	tiles.sort_tiles();

	for (let i = 0; i < out_group_num; i ++)
		if (out_tiles_now_num[i][0] != 3)
			return "";

	if (now_tiles_num == 13) return check_ting(tiles);

	if (now_tiles_num == 14){
		tiles.push(hu[0]);
		if (check_hu(tiles) == 0)
			return "没和";
		let all = hand_tiles.copy();
		for(let i = 0; i < out_group_num; i++)
			all = all.concat(out_tiles[i]);	
		all.sort_tiles();
		return calculate_fan(all, hu[0]);		
	}


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

		if (!(check_hu(tiles_copy) == 0)) tings.push(tile);
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
			return 0;

	tiles.sort_tiles();
	if (check_seven_pairs(tiles)) return 1;
	else if (check_thirteen_yao(tiles)) return 1;
	else if (check_chichen_hu(tiles)) return 1;
	return 0;
};

function check_seven_pairs(tiles) {
	if (out_group_num != 0)
		return false;

	for (let i = 0; i < tiles.length; i += 2){
		if (!(tiles[i] == tiles[i + 1])) return false;
		if (i < tiles.length-2 && (tiles[i] == tiles[i + 2]))
			return false;
	}
	return true;
};

function check_thirteen_yao(tiles) {
	if (out_group_num != 0)
		return false;

	let tiles_copy = tiles.copy();
	let orphans = [11, 19, 21, 29, 31, 39, 41, 43, 45, 47, 51, 53, 55, 0];
	for (let i = 0; i < tiles_copy.length; i++)
		if (!(tiles_copy[i] == orphans[i])){
			if (i == 0)
				return false;
			else if (!(tiles_copy[i] == tiles_copy[i - 1]))
				return false;
			else{
				tiles_copy.splice(i, 1);
				break;
			}
		}
	for (let i = 0; i < tiles_copy.length; i++)
		if (!(tiles_copy[i] == orphans[i])) return false;
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