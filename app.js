var fs = require('fs');
var repl = require('repl');
var bank = {
	10990: {
		name: 'simba',
		id: 10990,
		money: 10000
	}
};
var IDs = [];

class Person {
	constructor(name){
		this.name = name;
		this.id = genID(IDs, 5);
		this.money = 0;
	}
}

function save(){
	let data = JSON.stringify(bank);
	fs.writeFileSync('./bank.json', data);
}

function load(){
	let newData = require('./bank.json');
	data = newData;
}

function withdrawal(name, amount){
	let user;
	for(let i in bank){
		if(bank[i].name === name){
			user = bank[i];
		}
	}
	console.log(user);
}

function deposit(name, amount){
	
}

function show(){
	console.log(bank);
}

function cycle(n){

}

function genID(from, n){
	let flag = false;
	let t;
	do{
		t = Math.floor(Math.random() * Math.pow(10,n));
		console.log(t);
	}while(from.includes(t));
	from.push(t);
	return t;
}

var context = repl.start().context;

context.save = save;
context.load = load;
context.withdrawal = withdrawal;
context.deposit = deposit;
context.show = show;
context.cycle = cycle;
context.genID = genID;
context.bank = bank;
