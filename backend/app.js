#! /usr/bin/env node
var fs = require('fs');
var repl = require('repl');
var bank = {};
var IDs = [];
var rate = 0.01;
var mode = 'release';
var doRenewInfo = true;
var renew;
var file = './test-bank.json';

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
		}else{
			console.error('User already exist !!');
		}
	}
}

function save(file = './bank.json'){
	let data = JSON.stringify(bank);
	fs.writeFileSync(file, data);
	if(mode === 'release') show();
}

function load(file = './bank.json'){
	let newData = require('./' + file);
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
			console.error('you don\'t have so much money');
			return {
				type: 'error',
				errorCode: 100,
				user: user
			};
		}
		console.table([{
			name: user.name,
			id: user.id,
			money: user.money,
			withdrawal: amount,
			left: user.money - amount
		}]);
	
		user.money -= amount;
		save(file);
		if(mode === 'release') show();
	}else{
		console.error('You don\'t have account new');
		return {
			type: 'error',
			errorCode: 101,
		};
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
		save(file);
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
	require('./handlers.js').update(require('./index.js').clients);
	console.clear();
	console.table(bank);
}

function cycle(n = 1){
	for(let i in bank){
		bank[i].money = bank[i].money * (1 + Math.pow(rate, n));
	}
	save(file);
	if(doRenewInfo) show();
}

function cycleStart(n){
	if(!n) return console.error('n missed');
	renew = setTimeout(() => {
		cycle();
		cycleStart(n);
	}, n)
}

function cycleStop(){
	clearTimeout(renew);
}

function clear(name){
	if(!name) return console.error('name missed');
	let user;
	for(let i in bank){
		if(bank[i].name === name){
			user = bank[i];
		}
	}
	if(user){
		user.money = 0;
		save(file);
		if(mode === 'release') show();
	}else{
		return console.error('user not found');
	}
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

function setDRI(n){
	doRenewInfo = n;
}

var output = {
	save: save,
	load: load,
	withdrawal: withdrawal,
	deposit: deposit,
	show: show,
	cycle: cycle,
	genID: genID,
	bank: bank,
	Person: Person,
	mode: mode,
	cycleStop: cycleStop,
	cycleStart: cycleStart,
	setDRI: setDRI,
	clear: clear,
	//alias
	start: cycleStart,
	stop: cycleStop,
	s: cycleStop
};

Object.assign(repl.start().context,output);
module.exports = output;
