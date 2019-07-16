var fs = require('fs');
var repl = require('repl');
var bank = {};
var IDs = [];
var rate = 0.01;
var mode = 'release';

class Person {
	constructor(name){
		if(!name) return console.error('name missed');
		let flag = true;
		for(let i in bank){
			if(name === bank[i].name) flag = false;
		}
		if(flag){
			this.name = name;
			this.id = genID(IDs, 5);
			this.money = 0;
			bank[this.id] = this;
			if(mode === 'release') show();
		}else{
			console.error('User already exist !!');
		}
	}
}

function save(){
	let data = JSON.stringify(bank);
	fs.writeFileSync('./bank.json', data);
	if(mode === 'release') show();
}

function load(){
	let newData = require('./bank.json');
	Object.assign(bank, newData);
	if(mode === 'release') show();
}

function withdrawal(name, amount){
	let user;
	for(let i in bank){
		if(bank[i].name === name){
			user = bank[i];
		}
	}
	if(user){
		if(amount > user.money){
			return console.error('you don\'t have so much money');
		}
		console.table([{
			name: user.name,
			id: user.id,
			money: user.money,
			withdrawal: amount,
			left: user.money - amount
		}]);
	
		user.money -= amount;
		if(mode === 'release') show();
	}else{
		return console.error('You don\'t have account new');
	}
}

function deposit(name, amount){
	let user;
	for(let i in bank){
		if(bank[i].name === name){
			user = bank[i];
		}
	}
	if(user){
		console.table([{
			name: user.name,
			id: user.id,
			money: user.money,
			deposit: amount,
			left: user.money + amount
		}]);
		user.money += amount;
	}else{
		let user = new Person(name);
		if(user){
			console.table([{
				name: user.name,
				id: user.id,
				money: user.money,
				deposit: amount,
				left: user.money + amount
			}]);
			user.money = amount;	
		}
	}
	if(mode === 'release') show();
	
}

function show(){
	console.table(bank);
}

function cycle(n = 1){
	for(let i in bank){
		bank[i].money = bank[i].money * (1 + Math.pow(rate, n));
	}
	if(mode === 'release') show();
}

function genID(from, n){
	let flag = false;
	let t;
	do{
		t = Math.floor(Math.random() * Math.pow(10,n));
	}while(from.includes(t));
	from.push(t);
	return t;
}

var context = repl.start().context;

Object.assign(context, {
	save: save,
	load: load,
	withdrawal: withdrawal,
	deposit: deposit,
	show: show,
	cycle: cycle,
	genID: genID,
	bank: bank,
	Person: Person,
	mode: mode
});
