var a = document.getElementById("thedropdown");

var input = document.getElementById('amt');
var btn = document.getElementById('milk_btn');

a.onchange = function() {
   // input.value = a.value;
    if(a.value==='1 day'){input.value='55₹ INR'; btn.textContent='Subscribe Milk@55₹ for 1 day';}
    	else if(a.value==='15 day'){input.value='795₹ INR';   btn.textContent='Subscribe Milk@795₹ for 15 days';}
    		else if(a.value==='1 month'){input.value='1500₹ INR';  btn.textContent='Subscribe Milk@1500₹ for 1 month';}
    				else if(a.value==='so'){input.value='Please Select Duration';  btn.textContent='Subscribe';}
    					else {input.value='an error has occured please refresh';  btn.textContent='Subscribe';}
    				}
