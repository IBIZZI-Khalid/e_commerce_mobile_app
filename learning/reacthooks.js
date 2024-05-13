// useState hook
import React , {useState} from 'react' ;
function App (){
    const [count ,setCount] = useState(()=>{
        console.log("init");
        return 4;
        
    }) 
    return (
        <>
        <button>-</button>
        <span>{count}</span>  {/* current state element */}
        <button>+</button>
        </>
    )
}


export  default App;

//useState is jst a function  that returns an array of two elements. 
//The first (count) is the current state and 
//the second (setCount) is a function to update it.
//both are just names , the function is auto defined by react and we just call it 


//useState function in the normal case 'useState(4)' it give each time a current value of 4 which can slow down the app in complex code cases
//exemple:
// function count(){
//     console.log('running function...');
//     return 4;
// }
// const [count ,setCount] = useState(count())
// //this is gonna count each  time we render our component 

 
______________________________________________________________________



// //but in a case like this : 
// const [count ,setCount] = useState(()=>{
//     console.log('running function...');
//     return 4;
// }) 
//it only runs and give the value 4 the  very first time the component renders,  

