var mini = true;

function toggleSidebar() {
    if (mini) {
        console.log("opening sidebar");
        document.getElementById("mySidebar").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
        this.mini = false;
    } else {
        console.log("closing sidebar");
        document.getElementById("mySidebar").style.width = "80px";
        document.getElementById("main").style.marginLeft = "80px";
        this.mini = true;
    }
}
function darkmode() {
    const wasDarkmode = localStorage.getItem('darkmode') === 'true';
    localStorage.setItem('darkmode', !wasDarkmode);
    const element = document.body;
    element.classList.toggle('dark-mode', !wasDarkmode);
   
  }
  
  function onload() {
    document.body.classList.toggle('dark-mode', localStorage.getItem('darkmode') === 'true');
    
  }

 // Create a script element
const script = document.createElement('script');

// Set the data-grow-initializer attribute
script.setAttribute('data-grow-initializer', '');

// Add the script content inside a self-executing function
script.textContent = `!(function(){
  window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));
  var e=document.createElement("script");
  e.type="text/javascript";
  e.src="https://faves.grow.me/main.js";
  e.defer=true;
  e.setAttribute("data-grow-faves-site-id","U2l0ZTpmYzVhOGUxYS03NTJlLTRiNTQtOGFjMy1mYWNmYWJhMjMxMmM=");
  var t=document.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(e,t);
})();`;

// Append the script to the end of the body
document.body.appendChild(script);
