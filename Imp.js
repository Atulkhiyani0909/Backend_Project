username='Atul';
const arrow=()=>{
    atul:{
        username:"Rohan"
    }
    console.log("Arrow ",this.username);//accessing from the lexical scope window 
}
arrow();

function normal(){
    atul:{
        username:"Rohan"
    }
    console.log("Normal ",this.username);//accessing from the Global scope
}
normal();


myArray=[1,2,3,4,5];
myArray.forEach(function(e){
    e=e*2;
    console.log(e);
});
console.log(myArray);

myArray.forEach((e)=>e*2);
console.log(myArray);


//IIFE immediately invoked function expression
// Excuted immediately when the server start and this is done to protect from the pollution of the global scope
(function DB(prop){
    console.log(`${prop} IIFE`);
})('Named');

((prop)=>{
    console.log(`${prop} IIFE`);
})('Unnamed');


//map  holds the unique value 
const map=new Map();
map.set('name','Atul');
map.set('age',21);
map.set('city','Delhi');
console.log(map);

//forof loop in map
for(let [key,value] of map){
    console.log(key," : - " , value);
}

let bookSchema=new mongoose.Schema({})
export default Book= mongoose.model('Book',bookSchema);
//validation 


//loops on object

console.log(" Object");
const person={
    name:'Atul',
    age:21,
    city:'Delhi'
}

for(let key in person){
    console.log(key," : ",person[key]);
}

//Json type data [{}]
let data=[
    {name:'Atul',age:21,city:'Delhi'},
    {name:'Rohan',age:22,city:'Mumbai'},
    {name:'Rahul',age:23,city:'Chennai'}
]
console.log("For of Loop");
for(let da of data){
    console.log(da.city);
}

console.log("ForEach");
data.forEach((da)=>{
    console.log(da.name)
});

let arr=[1,2,3,4,5,6,7,8,9,10];
for(let ar in arr){
    console.log(arr[ar]);
}


//filter function 
let value=arr.filter((e)=>(e%2==0));
let val2=arr.filter((e)=>{//in this we have to write return also because we are using {} explicit return and inplicit return rule
    return (e%2==0 && e%3==0);
});
console.log("Filter " , value);
console.log("Filter " , val2);


//objects are iterable on use for in loop for iteration
let sepData=  {name:'Atul',age:21,city:'Delhi'};
for(let sep in sepData){
    console.log(sepData[sep]);
};
