let zimo = false;
let zhuang = false;
let yiman = false;
let chang = 0;
let fu = 20;
let fan = 1;
let bei = 1;

function set_zimo(){
	zimo = ! zimo;
	change_state();
}

function set_zhuang(){
	zhuang = ! zhuang;
	change_state();
}

function set_yiman(){
	yiman = ! yiman;

	if (yiman){
		document.getElementById("fu").hidden = true;
		document.getElementById("label_fu").hidden = true;
		document.getElementById("fan").hidden = true;
		document.getElementById("label_fan").hidden = true;
		document.getElementById("bei").hidden = false;
		document.getElementById("label_bei").hidden = false;
	}
	else{
		document.getElementById("fu").hidden = false;
		document.getElementById("label_fu").hidden = false;
		document.getElementById("fan").hidden = false;
		document.getElementById("label_fan").hidden = false;
		document.getElementById("bei").hidden = true;
		document.getElementById("label_bei").hidden = true;
	}

	change_state();
}

function change_chang(value){
	chang = parseInt(value);
	change_state();
}

function change_fu(value){
	fu = parseInt(value);
	change_state();
}

function change_fan(value){
	fan = parseInt(value);
	change_state();
}

function change_bei(value){
	bei = parseInt(value);
	change_state();
}

function change_state(){
	let content = "";
	content += chang + "本场 ";
	content += zhuang ? "庄家 " : "闲家 ";
	content += zimo ? "自摸" : "荣和";
	document.getElementById('user_state').innerHTML = content;

	content = calculate();
	document.getElementById('answer').innerHTML = content;
}

function calculate(){
	let content = "";
	let total;
	let xian_point;
	let zhuang_point;
	let a = 0;

	if (yiman){
		content += `${bei}倍役满<br><br>`;
		a = 8000;
		a = bei * a;

		if (zhuang){
			total = 6 * a + 300 * chang;
			if(zimo){
				xian_point = 2 * a + 100 * chang;
				content += `庄家 自摸 获 ${total} 点<br>每家付 ${xian_point} 点<br>`;
			}
			else{
				xian_point = 6 * a + 300 * chang;
				content += `庄家 荣胡 获 ${total} 点<br>`;
			}
		}
		else {
			total = 4 * a + 300 * chang;
			if(zimo){
				xian_point = 1 * a + 100 * chang;
				zhuang_point = 2 * a + 100 * chang;
				content += `闲家 自摸 获 ${total} 点<br>庄家付 ${zhuang_point} 点<br>闲家付 ${xian_point} 点<br>`;
			}
			else{
				xian_point = 4 * a + 300 * chang;
				content += `闲家 荣胡 获 ${total} 点<br>`;
			}
		}
		return content;
	}
	else {
		content += `${fan}番${fu}符<br>`;
		if (fan == 0 || fu == 0){
			return content;
		}

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
			console.log(a);
			if (a > 2000){
				a = 2000;
				content += "满贯<br>";
			}

		} 
		if (zhuang){
			total = Math.ceil(6 * a / 100) * 100 + 300 * chang;
			if(zimo){
				xian_point = Math.ceil(2 * a / 100) * 100 + 100 * chang;
				content += `庄家 自摸 获 ${total} 点<br>每家付 ${xian_point} 点<br>`;
			}
			else{
				content += `庄家 荣胡 获 ${total} 点<br>`;
			}
		}
		else {
			total = Math.ceil(4 * a / 100) * 100 + 300 * chang;
			if(zimo){
				xian_point = Math.ceil(1 * a / 100) * 100 + 100 * chang;
				zhuang_point = Math.ceil(2 * a / 100) * 100 + 100 * chang;
				content += `闲家 自摸 获 ${total} 点<br>庄家付 ${zhuang_point} 点<br>闲家付 ${xian_point} 点<br>`;
			}
			else{
				content += `闲家 荣胡 获 ${total} 点<br>`;
			}
		}
		return content;
	}
}