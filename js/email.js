
var email = document.getElementById("email");
email.removeAttribute('disabled');

function onOpenEmail(token) {
    let user = "contact";
    let domain = "najeemkanishka";
    let org = "com"
    email.innerHTML = '<a class="text-white !important" href=\"mailto:' + user + '&#64;' + domain + "." + org + '\">' + user + "&#64;" + domain + "." + org +'</a>';
}

function onOpenResume(token) {
    document.getElementById("email").innerHTML = "contact" + "@najeemka"+ "nishka.com";
}