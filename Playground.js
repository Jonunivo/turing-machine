// ---- playground area: basic script to test things around (for now)

console.log("Hello world");

//changes color from orange to black & back when clicking on text
function changeColor(event){
    if(event.target.style.color === 'black'){
        event.target.style.color = 'rgb(255, 168, 36)';
        event.target.style.backgroundColor = 'black';
    }
    else{
        event.target.style.color = 'black';
        event.target.style.backgroundColor = 'white';

    }
}
document.getElementById('head-title').onclick = changeColor;

