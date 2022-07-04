import {username,  diffDays} from './allDebrid/account.js';

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

delay(5).then(() => {
  const showDiv = document.getElementsByClassName('nologged');
  showDiv[0].style.display = 'block'
  const hideDiv = document.getElementsByClassName('logged');
  hideDiv[0].style.display = 'none'
  var allSubInfo = document.getElementsByClassName('sub_info');
  if(username == undefined) {
    for (let index = 0; index < allSubInfo.length; index++) {
      allSubInfo[index].innerHTML = '<p>Salut, connecte toi pour utiliser l’extension</p>'; 
      allSubInfo[index].disabled = true;  
    }
  } else {  
    const hideDiv = document.getElementsByClassName('nologged');
    hideDiv[0].style.display = 'none'
    const showDiv = document.getElementsByClassName('logged');
    showDiv[0].style.display = 'block'
    for (let index = 0; index < allSubInfo.length; index++) {
      allSubInfo[index].innerHTML = '<p>Salut, ' + username + ' ton abonnement prendra fin dans ' + diffDays + ' jours </p>'; 
      allSubInfo[index].disabled = true;  
    }
  }
});