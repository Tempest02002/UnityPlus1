$(".signin-btn").on("click", function(){
    var a=$(".signin");
    a.css({"display": "block","transition":"opacity 3s ease"});
});

$(".close").on("click", function(){
    var a=$(".signin");
    a.css({"display": "none","transition":"opacity 3s ease"});
    var m=$(".newsign");
    m.css({"display": "none","transition":"opacity 3s ease"});
});

$(".reg").on("click", function(){
    var a=$(".signin");
    $(".btn-primary").css("display","none");
    a.css({"display": "none","transition":"opacity 3s ease-out"});
    var m=$(".newsign").css("display","block");
});

$(".otpver").on("click",async function(event){
    event.preventDefault();
    if (!validateForm()) {
        event.stopPropagation();
    }
    else{
        try{
            const phoneInput= document.getElementById("number").value
            const sendOtpApi= await axios.post("http://localhost:8080/user/signin", {phone: `+91${phoneInput}`})
            console.log(sendOtpApi.data);
            $(".otp1").css("display","flex");
            $(".numberEntity").css("display","none");
            $(".reg").css("display","none");
            $(".otp-input-fields").find(".otp__field__1").focus();
            
            $(".otpver").css("display","none");
            $(".sub").css("display","block");
          }
        catch(err){
            document.getElementById("notExist").innerHTML="Couldn't find your account"
            // alert("User does not exist, Register now!")
            throw new Error("User does not Exist, Register now")
        }
    }
});
$(".sub").on("click", async function(event) {
    event.preventDefault();
    try{
        const phoneInput= document.getElementById("number").value
        const otpInputs= document.getElementsByClassName("otp__digit1")
        const otpInputsValues = [];
        for (let i = 0; i < otpInputs.length; i++) {
            otpInputsValues.push(otpInputs[i].value);
        }
        const otpInputsValuesString= otpInputsValues.join('');
        const otpValueNumber= Number.parseInt(otpInputsValuesString)
        // console.log(otpValueNumber);
        const verifyOtpApi= await axios.post("http://localhost:8080/user/signin/verify",{
            phone: `+91${phoneInput}`,
            otp: otpValueNumber
        })
        console.log(verifyOtpApi.status);
        
        try {
            await handleSignInResponse(verifyOtpApi, phoneInput);
        } catch (error) {
            console.error(error.message);
        }
        
        // if(verifyOtpApi.status===200){
        //     // setting an item in local storage and assigning its value to true
        //     localStorage.setItem('authenticated', true);
        //     const changeSignIn= document.getElementById("subFinalSignIn")
        //     const encodedPhone= encodeURIComponent(`+91${phoneInput}`)
        //     const changeSignInApi= await axios.get(`http://localhost:8080/user/logged-in?phone=${encodedPhone}`)
        //     const fetchedName= changeSignInApi.data
        //     const finalName= fetchedName[0].name
        //     // changeSignIn.innerHTML=finalName;
        //     // using local storage 
        //     localStorage.setItem('userName', finalName);
        //     $('#subFinalSignIn').text(finalName); // Display user's name
        //     $('#subFinalSignIn').css({
        //         "background": "none",
        //         "color": "#6c4f36",
        //         "cursor": "text"
        //         })
        //     $('.signin').hide(); // Hide the sign-in form
        //     // $(".logoutBtn").css("display","flex")
        //     $(".logoutBtn").show()
        //     $(".form").hide()
            
        // }
        // else{
        //     throw new Error("User non exist, Register now!")
        // }
    }
    catch(err){
        throw new Error("User does not exist, Register now!")
    }
});

async function handleSignInResponse(verifyOtpApi, phoneInput) {
    
    if (verifyOtpApi.status === 200) {
        // setting an item in local storage and assigning its value to true
        localStorage.setItem('authenticated', true);
        const changeSignIn = document.getElementById("subFinalSignIn");
        const encodedPhone = encodeURIComponent(`+91${phoneInput}`);
        const changeSignInApi = await axios.get(`http://localhost:8080/user/logged-in?phone=${encodedPhone}`);
        const fetchedName = changeSignInApi.data;
        const finalName = fetchedName[0].name;
        // changeSignIn.innerHTML = finalName;
        // using local storage 
        localStorage.setItem('userName', finalName);
        $('#subFinalSignIn').text(finalName); // Display user's name
        $('#subFinalSignIn').css({
            "background": "none",
            "color": "#6c4f36",
            "cursor": "text"
        });
        $('.signin').hide(); // Hide the sign-in form
        $(".logoutBtn").show();
        $(".closepopup").hide();
        $(".dropdown").hide()
    } else {
        throw new Error("User does not exist, Register now!");
    }
}


// this will execute code when DOM is fully loaded, any code in this will work one DOM is fully loaded
$(document).ready(function (){
    if(localStorage.getItem('authenticated')){
        $('#subFinalSignIn').text(localStorage.getItem('userName'))
        $('#subFinalSignIn').css({
            "background": "none",
            "color": "#6c4f36",
            "cursor": "text"
    })
        // $(".logoutBtn").css("display","flex")
        $(".logoutBtn").show()
        $(".form").hide()

    }
})
$('.logoutBtn').click(function() {
    console.log("logout clicked");
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('rzp_device_id')
    localStorage.removeItem('rzp_checkout_anon_id')
    $('.signin').show();
    // Hide the logout button
    $(this).hide();
    location.reload();
});
$('.otp__digit').on('input', function() {
    $('.otp__digit').attr("maxlength", "1");
    var $this = $(this);
    if ($this.val().length >= 1) {
    $this.next('.otp__digit').focus();
    }
});

$(".otpver1").on('click',async function(event) {
    event.preventDefault()
    if (!validateForm2()) {
        event.stopPropagation();
    }
    else{
        try{
            $(".otp2").css("display","flex");
            $(".btn-primary").css("display","flex");
            $(".otpver1").css("display","none");
            $(".form-group").css({
                "display":"none",
            });
            $(".newsign").css("height","22rem");
            const name= document.getElementById("username").value
            const email= document.getElementById("email").value
            const phone= document.getElementById("phone").value
            await axios.post("http://localhost:8080/user/signup",{
            name: name,
            email: email,
            phone: `+91${phone}`
            })
        }
        catch(err){
            throw new Error("something went wrong")
        }
    }
});
$(".sub2").on("click", async function(event) {
    event.preventDefault();
    try{
        const phoneInput= document.getElementById("phone").value
        const otpInputs= document.getElementsByClassName("otp__digit2")
        const otpInputsValues = [];
        for (let i = 0; i < otpInputs.length; i++) {
            otpInputsValues.push(otpInputs[i].value);
        }
        const otpInputsValuesString= otpInputsValues.join('');
        const otpValueNumber= Number.parseInt(otpInputsValuesString)
        console.log(otpValueNumber);
        const verifyOtpApi= await axios.post("http://localhost:8080/user/signup/verify",{
            phone: `+91${phoneInput}`,
            otp: otpValueNumber
        })
        console.log(verifyOtpApi.data);
    //     if(verifyOtpApi.status===200){
    //         // setting an item in local storage and assigning its value to true
    //         localStorage.setItem('authenticated', true);
    //         const changeSignIn= document.getElementById("subFinalSignIn")
    //         const encodedPhone= encodeURIComponent(`+91${phoneInput}`)
    //         const changeSignInApi= await axios.get(`http://localhost:8080/user/logged-in?phone=${encodedPhone}`)
    //         const fetchedName= changeSignInApi.data
    //         const finalName= fetchedName[0].name
    //         // changeSignIn.innerHTML=finalName;
    //         // using local storage 
    //         localStorage.setItem('userName', finalName);
    //         $('#subFinalSignIn').text(finalName); // Display user's name
    //         $('#subFinalSignIn').css({
    //             "background": "none",
    //             "color": "#6c4f36",
    //             "cursor": "text"
    //             })
    //         $('.signin').hide(); // Hide the sign-in form
    //         // $(".logoutBtn").css("display","flex")
    //         $(".logoutBtn").show()
    //         $(".newsign").hide()
    //     }

    try {
        await handleSignInResponse(verifyOtpApi, phoneInput);
    } catch (error) {
        console.error(error.message);
    }
    }
    catch(err){
        throw new Error("Wrong OTP")
    }
});

//  later added js
  function validateForm() {
    const mobileNumber = document.getElementById("number").value;
    if (/^\d{10}$/.test(mobileNumber)) {
        // $(".form h6").css("display","none");
    $("#number").css({"border-color":"black","box-shadoow":"0 0 8px 0 #b47f50"});
      return true;
    }
    else {
    //   alert("Please enter a valid 10-digit mobile number");
    $(".form h6").css("display","block");
    $("#number").css({"border-color":"rgb(168, 8, 8)","box-shadoow":"none"});
    return false;
    }
  }
  function validateForm2() {
    const name= document.getElementById("username").value
    const email= document.getElementById("email").value
    const phone= document.getElementById("phone").value
    if (/^\d{10}$/.test(phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && name.length>1 ) {
        $(".username, .email, .phone").css({"border-color":"black","box-shadoow":"0 0 8px 0 #b47f50"});
        // $("#newsign_form #wrongInputRegister").css("display","none");
      return true;
    }
    else {
        alert("Wrong Inputs")
    $(".newsign_form h6").css("display","block");
    $(".username, .email, .phone").css({"border-color":"rgb(168, 8, 8)","box-shadoow":"none"});
    return false;
    }
  }
async function redirectNgo(ngoType){
    // when a page is redirected the data you fetched is lost in old page for saving it we are using queary params
    // during redirection data is sent through url with showList using encodeURIComponent(), 
    const response= await axios.get(`http://localhost:8080/ngos?ngoType=${ngoType}`)
    const showList = encodeURIComponent(JSON.stringify(response.data.ngoList));
    window.location.href = `ngos.html?ngoList=${showList}`
 }
async function redirectDonate(){
    const response = await axios.get(`http://localhost:8080/ngos/all`)
    const  allNgos = encodeURIComponent(JSON.stringify(response.data.allNgos));
    window.location.href=`/UnityPlus2/Donate.html?ngoList=${allNgos}`
}
async function fetchedNgoList(){
    // window.location.search returns the query string portion of the URL (i.e., everything after the ? character).
    const urlParams = new URLSearchParams(window.location.search);
    const ngoListData = urlParams.get('ngoList');
    // console.log(ngoListData)
    const fetchedData= JSON.parse(ngoListData)
    console.log(fetchedData);
    for (let i = 0; i < fetchedData.length; i++) {
        const parent = document.createElement("div");
        parent.classList.add("parent");
        // document.body.appendChild(parent)

        const head = document.createElement("div");
        head.classList.add("head");
        parent.appendChild(head);

        const orgName = document.createElement("h4");
        orgName.classList.add("orgName");
        // .textContent is used as it set and returns the text content of the element
        orgName.textContent = fetchedData[i].orgName;
        head.appendChild(orgName);

        const classification = document.createElement("h6");
        classification.textContent = `(${fetchedData[i].classification})`;
        head.appendChild(classification);

        const combined = document.createElement("div");
        combined.classList.add("combined");
        parent.appendChild(combined);

        const ngoImg= document.createElement("img")
        ngoImg.setAttribute("src", "https://img.freepik.com/premium-vector/ngo-nongovernmental-organization-serve-specific-social-template-hand-drawn-illustration_2175-7898.jpg?w=2000")
        ngoImg.setAttribute("alt", "can't load image")
        ngoImg.classList.add("ngoImg")
        combined.appendChild(ngoImg)

        const leftContent = document.createElement("div");
        leftContent.classList.add("left-content");
        combined.appendChild(leftContent);

        const ngoDescription = document.createElement("p");
        ngoDescription.classList.add("description");
        ngoDescription.textContent = fetchedData[i].description; 
        leftContent.appendChild(ngoDescription);

        const rightContent = document.createElement("div");
        rightContent.classList.add("right-content");
        combined.appendChild(rightContent);

        const email = document.createElement("a");
        email.setAttribute("href", `mailto:${fetchedData[i].email}`);
        email.classList.add("email");
        email.textContent = `✉ ${fetchedData[i].email}`;
        rightContent.appendChild(email);

        // const location = document.createElement("span");
        // location.textContent = `⚲ ${fetchedData[i].location}`;
        // rightContent.appendChild(location);
        const location = document.createElement("a");
        location.setAttribute("href",`https://www.google.com/maps/search/?api=1&query=28.675861834357168,77.50189680749739`)
        location.setAttribute("target", "_blank")
        location.textContent = `⚲ ${fetchedData[i].location}`;
        rightContent.appendChild(location);

        const redirectLink = document.createElement("a");
        redirectLink.setAttribute("href", `http://${fetchedData[i].websiteUrl}`);
        redirectLink.setAttribute("target", "_blank")
        redirectLink.classList.add("btn");
        redirectLink.textContent = "Visit us";
        rightContent.appendChild(redirectLink); 
        
        document.body.insertBefore(parent, document.querySelector("footer"))
    }
}
window.onload = function() {
    if (window.location.pathname === "/UnityPlus2/ngos.html" || window.location.pathname === "/UnityPlus2/Donate.html" ) {
        fetchedNgoList();
    }
}

//razorpay
if(window.location.pathname==="/UnityPlus2/Donate.html"){
    document.getElementById('donateBtn').addEventListener('click', () => {
        const amountInput = document.getElementById('amountInput').value;
        const amount = parseFloat(amountInput);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount to pay.');
            return;
        }
        axios.post('http://localhost:8080/api/order', { amount })
            .then(response => {
                const { id, currency, amount } = response.data; 
                const options = {
                    key: 'rzp_test_Xdqdq0R7A7gS4N',
                    amount: amount * 100, 
                    currency: currency,
                    name: 'Unity+',
                    description: 'Donate',
                    // image: '/photos/unity+logo.png',
                    order_id: id,
                    handler: function (response) {
                        const data = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        };
                        axios.post('http://localhost:8080/api/payment/success', data)
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(error => {
                                console.error('Error verifying payment:', error);
                            });
                    }
                };
                const rzp1 = new Razorpay(options);
                rzp1.open();
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    });
}
