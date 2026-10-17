const $ = (id) => document.getElementById(id);
const state = { buses: [], selectedBus: null, seats: [], paymentMethod: "mpesa", passenger: null, trip: {} };
const money = n => `KES ${Number(n).toLocaleString("en-KE")}`;
const today = new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
$("travelDate").min = today.toISOString().slice(0,10);
$("travelDate").value = today.toISOString().slice(0,10);
$("returnDate").min = $("travelDate").value;
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "";
const safe = str => String(str).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const busTemplates = [
  {via:"MIGORI", depart:"05:00 AM", arrive:"12:12 PM", duration:"7h 12m", type:"LUXO", rating:"3.9", left:13, fare:1700, time:"early", amenities:["wifi"]},
  {via:"HOMABAY", depart:"05:00 AM", arrive:"09:45 PM", duration:"16h 45m", type:"LUXO", rating:"3.8", left:14, fare:1700, time:"early", amenities:["wifi"]},
  {via:"KEHANCHA", depart:"07:30 AM", arrive:"06:32 PM", duration:"11h 2m", type:"LUXURY", rating:"4.1", left:41, fare:1700, time:"day", amenities:["wifi","luxury"]},
  {via:"RANGWE - SORI", depart:"07:30 AM", arrive:"07:25 PM", duration:"11h 55m", type:"LUXURY", rating:"4.2", left:33, fare:1700, time:"day", amenities:["wifi","luxury"]},
  {via:"KISII - KENYENYA", depart:"07:30 AM", arrive:"04:00 PM", duration:"8h 30m", type:"SHUTTLE", rating:"3.9", left:8, fare:1700, time:"day", amenities:[]},
  {via:"KISII - MAGENA", depart:"07:30 AM", arrive:"02:05 PM", duration:"6h 35m", type:"SHUTTLE", rating:"4.0", left:11, fare:1700, time:"day", amenities:[]},
  {via:"DIRECT EXPRESS", depart:"01:30 PM", arrive:"08:00 PM", duration:"6h 30m", type:"EXPRESS", rating:"4.3", left:18, fare:1850, time:"late", amenities:["wifi"]}
];
function showToast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),3000)}
function openModal(id){$(id).classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(id){$(id).classList.add("hidden");document.body.style.overflow=""}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(el=>el.addEventListener("click",e=>{if(e.target===el)closeModal(el.id)}));
$("menuBtn").onclick=()=>$("mobileMenu").classList.toggle("hidden");
$("languageBtn").onclick=()=>showToast("Language: English");
$("myBookingsBtn").onclick=()=>{ $("mobileMenu").classList.add("hidden"); const saved=JSON.parse(localStorage.getItem("enaBookings")||"[]"); showToast(saved.length?`${saved.length} booking record(s) saved on this device.`:"No bookings saved on this device."); };
document.querySelectorAll('input[name="tripType"]').forEach(r=>r.addEventListener("change",()=>{$("returnDateWrap").classList.toggle("hidden",r.value!=="round"||!r.checked);if(r.value==="round"&&r.checked)$("returnDate").min=$("travelDate").value;}));
$("travelDate").addEventListener("change",()=>{$("returnDate").min=$("travelDate").value;if($("returnDate").value<$("travelDate").value)$("returnDate").value=$("travelDate").value;});
$("swapBtn").onclick=()=>{const a=$("fromCity"),b=$("toCity"),v=a.value;a.value=b.value;b.value=v;};
$("searchBtn").onclick=()=>{
 const from=$("fromCity").value,to=$("toCity").value,date=$("travelDate").value;
 if(from===to){$("searchError").textContent="Choose two different cities."; $("searchError").classList.remove("hidden");return;}
 if(!date){$("searchError").textContent="Select a travel date."; $("searchError").classList.remove("hidden");return;}
 if(document.querySelector('input[name="tripType"]:checked').value==="round"&&(!$("returnDate").value||$("returnDate").value<date)){$("searchError").textContent="Select a valid return date."; $("searchError").classList.remove("hidden");return;}
 $("searchError").classList.add("hidden");
 state.trip={from,to,date,returnDate:$("returnDate").value,round:document.querySelector('input[name="tripType"]:checked').value==="round"};
 $("routeTitle").textContent=`${from} - ${to}`;$("routeDate").textContent=formatDate(date)+(state.trip.round?` · Return ${formatDate(state.trip.returnDate)}`:"");
 $("resultsSection").classList.remove("hidden");$("booking").classList.add("hidden");$("amenities").classList.add("hidden");renderBuses();$("resultsSection").scrollIntoView({behavior:"smooth"});
};
$("backToSearch").onclick=showSearch;$("modifyTrip").onclick=showSearch;
function showSearch(){$("resultsSection").classList.add("hidden");$("booking").classList.remove("hidden");$("amenities").classList.remove("hidden");$("booking").scrollIntoView({behavior:"smooth"});}
["boardingFilter","droppingFilter","departureFilter","amenitiesFilter"].forEach(id=>$(id).addEventListener("change",renderBuses));
function renderBuses(){
 const dep=$("departureFilter").value,amen=$("amenitiesFilter").value;
 const buses=busTemplates.filter(b=>(!dep||b.time===dep)&&(!amen||b.amenities.includes(amen)));
 $("foundCount").textContent=`${buses.length} Found`;
 $("busList").innerHTML=buses.map((b,i)=>`<article class="bus-card"><div class="bus-route-label">${safe(state.trip.from)} - ${safe(b.via)}</div><div class="bus-times"><div class="time-place"><strong>${safe(state.trip.from)}</strong><b>${b.depart}</b></div><div class="journey-line"><span>${b.duration}</span></div><div class="time-place"><strong>${safe(state.trip.to)}</strong><b>${b.arrive}</b></div></div><div class="bus-meta"><img class="bus-logo" src="/assets/ena-mark.svg" alt="ENA Coach"><span class="bus-class">${b.type}</span><span class="rating">★ ${b.rating}</span></div><div class="bus-bottom"><span class="fare">Normal: <b>${money(b.fare)}</b></span><span class="seats-left">${b.left} left</span><button class="view-seats" data-bus="${busTemplates.indexOf(b)}">View Seats</button></div></article>`).join("")||'<p class="empty">No buses match these filters. Try another filter.</p>';
 document.querySelectorAll("[data-bus]").forEach(btn=>btn.onclick=()=>{state.selectedBus=busTemplates[Number(btn.dataset.bus)];state.seats=[];$("boardingPoint").value=$("boardingFilter").value;$("droppingPoint").value=$("droppingFilter").value;renderSeats();updateSeatSummary();openModal("seatModal");});
}
function renderSeats(){
 const layout=$("busLayout");layout.innerHTML="";
 const total=state.selectedBus.type==="SHUTTLE"?13:34;
 const seatNames=state.selectedBus.type==="SHUTTLE"?Array.from({length:13},(_,i)=>`${i+1}L`):Array.from({length:total},(_,i)=>`A${i+1}`);
 const bookedSet=new Set([2,3,4,5,9,12,15,18,21,26,30].filter(n=>n<=total));
 const isShuttle=state.selectedBus.type==="SHUTTLE";
 const seatOrder=isShuttle?seatNames:Array.from({length:Math.ceil(total/4)},(_,row)=>[seatNames[row*4],seatNames[row*4+1],null,seatNames[row*4+2],seatNames[row*4+3]]).flat().filter((v,i,a)=>v!==null||i%5===2);
 if(isShuttle){
  layout.style.gridTemplateColumns="repeat(4,minmax(36px,1fr))";
  layout.insertAdjacentHTML("beforeend",'<span class="seat-gap"></span><span class="seat-gap"></span><span class="seat-gap"></span><span class="steering">◎</span>');
  const groups=[[0],[1,2,3],[4,5,6],[7,8,9],[10,11,12]];
  groups.forEach((g,idx)=>{if(idx>0)layout.insertAdjacentHTML("beforeend",'<span class="seat-gap"></span>');g.forEach(n=>appendSeat(seatNames[n],n+1,bookedSet));});
 }else{
  layout.style.gridTemplateColumns="repeat(5,minmax(32px,1fr))";
  layout.insertAdjacentHTML("beforeend",'<span class="seat-gap"></span><span class="seat-gap"></span><span class="seat-gap"></span><span class="seat-gap"></span><span class="steering">◎</span>');
  for(let i=0;i<total;i+=4){appendSeat(seatNames[i],i+1,bookedSet);appendSeat(seatNames[i+1],i+2,bookedSet);layout.insertAdjacentHTML("beforeend",'<span class="seat-gap"></span>');appendSeat(seatNames[i+2],i+3,bookedSet);appendSeat(seatNames[i+3],i+4,bookedSet);}
 }
 function appendSeat(name,num,booked){if(!name)return;const btn=document.createElement("button");btn.className="seat"+(booked.has(num)?" booked":"")+(num===1?" vip":"")+(num===6?" business":"");btn.textContent=name;btn.type="button";btn.disabled=booked.has(num);btn.setAttribute("aria-label",`Seat ${name}${btn.disabled?", booked":""}`);btn.onclick=()=>{if(state.seats.includes(name))state.seats=state.seats.filter(s=>s!==name);else if(state.seats.length<5)state.seats.push(name);else showToast("You can select up to 5 seats per booking.");renderSeatsSelection();updateSeatSummary();};layout.appendChild(btn);}
}
function renderSeatsSelection(){document.querySelectorAll(".seat").forEach(btn=>btn.classList.toggle("selected",state.seats.includes(btn.textContent)));updateSeatSummary();}
function updateSeatSummary(){const n=state.seats.length;$("selectedSeatsText").textContent=n?`Seats: ${state.seats.join(", ")} · ${n} ${n===1?"Normal seat":"seats"}`:"No seats selected";$("seatTotal").textContent=money(n*(state.selectedBus?.fare||0));const ready=n>0&&$("boardingPoint").value&&$("droppingPoint").value;$("continuePassenger").disabled=!ready;$("continuePassenger").textContent=ready?"Continue to passenger details":"Select seats and both points";}
["boardingPoint","droppingPoint"].forEach(id=>$(id).addEventListener("change",updateSeatSummary));
$("continuePassenger").onclick=()=>{if(!$("continuePassenger").disabled){closeModal("seatModal");$("resultsSection").classList.add("hidden");$("passengerPage").classList.remove("hidden");$("passengerSeat").textContent=state.seats.join(", ");$("passengerPage").scrollIntoView({behavior:"smooth"});}};
$("viewBusInfo").onclick=$("paymentBusInfo").onclick=()=>showToast(`${state.selectedBus?.type||"ENA Coach"} · ${state.trip.from} to ${state.trip.to} · ${state.selectedBus?.depart||""}`);
$("passengerForm").onsubmit=e=>{e.preventDefault();state.passenger={name:$("passengerName").value.trim(),id:$("passengerId").value.trim(),nationality:$("nationality").value.trim(),age:$("passengerAge").value,gender:$("gender").value,email:$("passengerEmail").value.trim(),phone:$("passengerPhone").value.trim()};$("paymentPhone").value=state.passenger.phone.replace(/\D/g,"").replace(/^0/,"");$("paymentTotal").textContent=money(state.seats.length*state.selectedBus.fare);$("passengerPage").classList.add("hidden");$("paymentPage").classList.remove("hidden");$("paymentPage").scrollIntoView({behavior:"smooth"});};
document.querySelectorAll(".payment-method").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".payment-method").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");state.paymentMethod=btn.dataset.method;$("payBtn").textContent=`♙  Pay Securely with ${state.paymentMethod==="mpesa"?"Mpesa":"Airtel Money"}`;});
$("walletLogin").onclick=()=>showToast("Wallet login requires a configured customer account service.");
$("privacyLink").onclick=$("termsLink").onclick=e=>{e.preventDefault();showToast("Add your published privacy policy and terms URL before launch.");};
let remaining=600;const countdownTimer=setInterval(()=>{if($("paymentPage").classList.contains("hidden"))return;if(remaining>0)remaining--;const m=String(Math.floor(remaining/60)).padStart(2,"0"),s=String(remaining%60).padStart(2,"0");$("countdown").textContent=`${m}:${s} Remaining`;},1000);
$("payBtn").onclick=()=>{
 if(!$("paymentPhone").value.trim()){showToast("Enter the phone number to receive the payment prompt.");return;}
 if(!$("paymentConsent").checked){showToast("Please accept the privacy and booking terms.");return;}
 // This demo intentionally does not claim to charge money. Add a server-side Daraja/Airtel integration for real payment requests.
 const ref=`ENA${Date.now().toString().slice(-8)}`;
 const booking={reference:ref,createdAt:new Date().toISOString(),trip:state.trip,bus:state.selectedBus,seats:state.seats,boarding:$("boardingPoint").value,dropping:$("droppingPoint").value,passenger:state.passenger,amount:state.seats.length*state.selectedBus.fare,paymentMethod:state.paymentMethod,paymentStatus:"demo_pending"};
 const saved=JSON.parse(localStorage.getItem("enaBookings")||"[]");saved.unshift(booking);localStorage.setItem("enaBookings",JSON.stringify(saved));
 $("paymentStatusSymbol").textContent="i";$("paymentStatusTitle").textContent="Payment Integration Required";$("paymentStatusText").textContent=`Booking ${ref} has been saved on this device as a demo. No money has been charged and no STK Push has been sent. Configure a secure payment backend to request payment on your phone.`;$("paymentReference").textContent=`Reference: ${ref} · Amount: ${money(booking.amount)}`;
 openModal("paymentModal");
};
$("closePaymentResult").onclick=()=>{closeModal("paymentModal");$("paymentPage").classList.add("hidden");$("booking").classList.remove("hidden");$("amenities").classList.remove("hidden");$("resultsSection").classList.add("hidden");$("booking").scrollIntoView({behavior:"smooth"});};
