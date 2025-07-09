function sendMail(){
 let parms = {
    name : document.getElementById("name").value,
    email : document.getElementById("email").value,
    subject : document.getElementById("subject").value,
    message : document.getElementById("message").value,
    
 }   

 emailjs.send("service_q69yn98","template_0s88x65",parms).then(alert("Email Was sent !!"))
}